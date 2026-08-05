import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { agent, ChatMessage } from '@/api/agent';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Bot,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  Square,
  Trash2,
  User,
  Wifi,
  WifiOff
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatBubble extends ChatMessage {
  id: string;
  timestamp: Date;
}

interface AgentChatPortalProps {
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ─── Suggestion Chips ─────────────────────────────────────────────────────────

const SUGGESTIONS = [
  'Explain how invoicing works',
  'Help me write a payment reminder',
  'Summarize best practices for billing',
  'Draft a thank you message for a client'
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">{copied ? 'Copied!' : 'Copy'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function MessageBubble({ message }: { message: ChatBubble }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'group flex gap-3 px-4 py-3 transition-colors duration-200',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <Avatar className={cn('h-8 w-8 shrink-0 ring-2 ring-offset-2 ring-offset-background', isUser ? 'ring-primary/30' : 'ring-violet-500/30')}>
        <AvatarFallback
          className={cn(
            'text-xs font-semibold',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-linear-to-br from-violet-500 to-indigo-600 text-white'
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className={cn('flex flex-col gap-1 max-w-[75%]', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-md'
              : 'bg-muted/60 text-foreground rounded-tl-md border border-border/40'
          )}
        >
          <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
        </div>

        {/* Meta row */}
        <div className={cn('flex items-center gap-1.5', isUser ? 'flex-row-reverse' : 'flex-row')}>
          <span className="text-[10px] text-muted-foreground/60">{formatTime(message.timestamp)}</span>
          {!isUser && <CopyButton text={message.content} />}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-3">
      <Avatar className="h-8 w-8 shrink-0 ring-2 ring-violet-500/30 ring-offset-2 ring-offset-background">
        <AvatarFallback className="bg-linear-to-br from-violet-500 to-indigo-600 text-white">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-muted/60 border border-border/40 px-4 py-3 shadow-sm">
        <span className="h-2 w-2 rounded-full bg-violet-500/70 animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-violet-500/70 animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-violet-500/70 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function EmptyState({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
      {/* Animated logo */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-linear-to-br from-violet-500/20 to-indigo-500/20 blur-xl animate-pulse" />
        <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
          <Sparkles className="h-9 w-9 text-white" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold tracking-tight">Agent Assistant</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Ask me anything — I can help with writing, summaries, brainstorming, and more.
        </p>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap justify-center gap-2 max-w-md">
        {SUGGESTIONS.map((text) => (
          <button
            key={text}
            onClick={() => onSuggestionClick(text)}
            className="px-3 py-1.5 text-xs rounded-full border border-border/60 bg-background hover:bg-muted/80 hover:border-violet-500/40 text-muted-foreground hover:text-foreground transition-all duration-200 shadow-sm hover:shadow"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const AgentChatPortal = ({ className }: AgentChatPortalProps) => {
  const [messages, setMessages] = useState<ChatBubble[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const streamingMessageRef = useRef<string>('');

  // ─── Health check on mount ───────────────────────────────────────────────

  useEffect(() => {
    agent.health().then(setIsOnline);
  }, []);

  // ─── Auto-scroll to bottom ──────────────────────────────────────────────

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ─── Auto-resize textarea ──────────────────────────────────────────────

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  // ─── Send message ──────────────────────────────────────────────────────

  const sendMessage = useCallback(
    (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isStreaming) return;

      const userMsg: ChatBubble = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date()
      };

      const assistantMsg: ChatBubble = {
        id: generateId(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      const updatedMessages = [...messages, userMsg];
      setMessages([...updatedMessages, assistantMsg]);
      setInput('');
      setIsStreaming(true);
      streamingMessageRef.current = '';

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      // Build chat history for API
      const chatHistory: ChatMessage[] = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      abortRef.current = agent.streamChat(
        chatHistory,
        // onToken
        (token) => {
          streamingMessageRef.current += token;
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.role === 'assistant') {
              updated[updated.length - 1] = {
                ...last,
                content: streamingMessageRef.current
              };
            }
            return updated;
          });
          scrollToBottom();
        },
        // onDone
        () => {
          setIsStreaming(false);
          abortRef.current = null;
        },
        // onError
        (error) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.role === 'assistant') {
              updated[updated.length - 1] = {
                ...last,
                content: `⚠️ ${error}`
              };
            }
            return updated;
          });
          setIsStreaming(false);
          abortRef.current = null;
        }
      );
    },
    [input, isStreaming, messages, scrollToBottom]
  );

  // ─── Stop streaming ───────────────────────────────────────────────────

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  // ─── Clear chat ────────────────────────────────────────────────────────

  const clearChat = useCallback(() => {
    stopStreaming();
    setMessages([]);
  }, [stopStreaming]);

  // ─── Keyboard handling ─────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        'flex flex-col h-full w-full overflow-hidden rounded-xl border border-border/50 bg-background shadow-sm',
        className
      )}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-muted/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Agent Chat</h2>
            <div className="flex items-center gap-1.5">
              {isOnline === null ? (
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              ) : isOnline ? (
                <Wifi className="h-3 w-3 text-emerald-500" />
              ) : (
                <WifiOff className="h-3 w-3 text-destructive" />
              )}
              <span className="text-[11px] text-muted-foreground">
                {isOnline === null ? 'Checking...' : isOnline ? 'Connected' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <Badge variant="secondary" className="text-[10px] mr-2 font-normal">
              {messages.filter((m) => m.role === 'user').length} messages
            </Badge>
          )}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  id="agent-chat-refresh"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => agent.health().then(setIsOnline)}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Check connection</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  id="agent-chat-clear"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive/70 hover:text-destructive"
                  onClick={clearChat}
                  disabled={messages.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Clear chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* ── Messages ───────────────────────────────────────────────────── */}
      <ScrollArea ref={scrollRef} className="flex-1">
        <div className="py-4 min-h-full flex flex-col">
          {messages.length === 0 ? (
            <EmptyState onSuggestionClick={(text) => sendMessage(text)} />
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isStreaming && messages[messages.length - 1]?.content === '' && <TypingIndicator />}
            </>
          )}
        </div>
      </ScrollArea>

      {/* ── Input area ─────────────────────────────────────────────────── */}
      <div className="border-t border-border/50 bg-muted/20 p-4">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <textarea
              id="agent-chat-input"
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                autoResize();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              disabled={isStreaming || isOnline === false}
              className={cn(
                'flex w-full rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm',
                'placeholder:text-muted-foreground/50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'resize-none transition-all duration-200',
                'min-h-[44px] max-h-[160px]'
              )}
            />

            {/* Character count for long messages */}
            {input.length > 200 && (
              <span className="absolute bottom-1.5 right-14 text-[10px] text-muted-foreground/50">
                {input.length}
              </span>
            )}
          </div>

          {isStreaming ? (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    id="agent-chat-stop"
                    variant="destructive"
                    size="icon"
                    className="h-[44px] w-[44px] rounded-xl shrink-0 shadow-sm"
                    onClick={stopStreaming}
                  >
                    <Square className="h-4 w-4 fill-current" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Stop generating</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    id="agent-chat-send"
                    size="icon"
                    className={cn(
                      'h-[44px] w-[44px] rounded-xl shrink-0 shadow-sm transition-all duration-200',
                      input.trim()
                        ? 'bg-linear-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white shadow-violet-500/25'
                        : ''
                    )}
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isOnline === false}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Send message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <p className="text-center text-[10px] text-muted-foreground/40 mt-2">
          Press <kbd className="px-1 py-0.5 rounded border border-border/40 bg-muted/50 text-[9px]">Enter</kbd> to send
          · <kbd className="px-1 py-0.5 rounded border border-border/40 bg-muted/50 text-[9px]">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
};
