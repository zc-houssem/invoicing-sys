import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';

interface CardViewProps<T> {
  data: T[];
  renderCard: (item: T) => React.ReactNode;
  className?: string;
}

export function CardView<T>({ data, renderCard, className }: CardViewProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground w-full h-full">
        <p>No items found.</p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2', className)}>
      {data.map((item, i) => (
        <div key={i}>{renderCard(item)}</div>
      ))}
    </div>
  );
}

interface CommonCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
  actions?: React.ReactNode;
}

export function CommonCard({ title, description, imageUrl, onClick, className, actions }: CommonCardProps) {
  return (
    <Card 
      className={cn("overflow-hidden cursor-pointer hover:shadow-md transition-shadow group flex flex-col h-full relative", className)} 
      onClick={onClick}
    >
      <div className="w-full aspect-video bg-muted flex items-center justify-center border-b border-border overflow-hidden relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
          />
        ) : (
          <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
        )}
      </div>
      <CardContent className="p-4 flex-1 flex flex-col justify-start">
        <h3 className="font-semibold text-lg line-clamp-1 mb-1 pr-8">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </CardContent>
      {actions && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1 z-10" onClick={(e) => e.stopPropagation()}>
          {actions}
        </div>
      )}
    </Card>
  );
}
