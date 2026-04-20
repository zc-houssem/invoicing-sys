import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { OverflowNode } from '@lexical/overflow';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { Klass, LexicalNode, LexicalNodeReplacement, ParagraphNode, TextNode } from 'lexical';

import { AutocompleteNode } from '@/components/shared/editor/nodes/autocomplete-node';
import { TweetNode } from '@/components/shared/editor/nodes/embeds/tweet-node';
import { YouTubeNode } from '@/components/shared/editor/nodes/embeds/youtube-node';
import { EmojiNode } from '@/components/shared/editor/nodes/emoji-node';
import { ImageNode } from '@/components/shared/editor/nodes/image-node';
import { KeywordNode } from '@/components/shared/editor/nodes/keyword-node';
import { LayoutContainerNode } from '@/components/shared/editor/nodes/layout-container-node';
import { LayoutItemNode } from '@/components/shared/editor/nodes/layout-item-node';
import { MentionNode } from '@/components/shared/editor/nodes/mention-node';

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> = [
  HeadingNode,
  ParagraphNode,
  TextNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  OverflowNode,
  HashtagNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  CodeNode,
  CodeHighlightNode,
  HorizontalRuleNode,
  MentionNode,
  ImageNode,
  EmojiNode,
  KeywordNode,
  LayoutContainerNode,
  LayoutItemNode,
  AutoLinkNode,
  TweetNode,
  YouTubeNode,
  AutocompleteNode
];
