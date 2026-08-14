'use client';

import { Expand, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FullscreenTogglePluginProps {
  isFullscreen: boolean;
  onToggle: () => void;
}

export function FullscreenTogglePlugin({ isFullscreen, onToggle }: FullscreenTogglePluginProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={'ghost'}
          onClick={onToggle}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          size={'sm'}
          className="p-2">
          {isFullscreen ? <X className="size-4" /> : <Expand className="size-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isFullscreen ? 'Exit fullscreen' : 'Expand'}</TooltipContent>
    </Tooltip>
  );
}
