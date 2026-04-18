import React from 'react';
import { cn } from '@/lib/utils';
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DndContext,
  closestCenter
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import SortableLinks from '@/components/ui/sortable';
import { useTranslation } from 'react-i18next';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ArticleManagementProps {
  className?: string;
  title?: string;
  description?: string;
  disabled: boolean;
  articles: any[];
  setArticles: (articles: any[]) => void;
  addArticle: () => void;
  deleteArticle: (id: string) => void;
  renderArticleItem: (item: any, edit: boolean, index: number) => React.ReactNode;
}

export function ArticleManagement({
  className,
  title,
  description,
  disabled,
  articles,
  setArticles,
  addArticle,
  deleteArticle,
  renderArticleItem
}: ArticleManagementProps) {
  const { t: tInvoicing } = useTranslation('invoicing');
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.clientId !== over.clientId) {
      const oldIndex = articles.findIndex((item) => item?.clientId === active.clientId);
      const newIndex = articles.findIndex((item) => item?.clientId === over.clientId);
      setArticles(arrayMove(articles, oldIndex, newIndex));
    }
  }

  function handleDelete(idToDelete: string) {
    if (articles.length > 1) {
      deleteArticle(idToDelete);
    }
  }

  const addNewItem = React.useCallback(() => {
    addArticle();
  }, [addArticle]);

  return (
    <div className="flex flex-col gap-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
        <SortableContext items={articles} strategy={verticalListSortingStrategy}>
          {articles.map((item, index) => (
            <SortableLinks
              key={item.clientId}
              id={item.clientId}
              onDelete={!disabled ? handleDelete : undefined}>
              {renderArticleItem(item, !disabled, index)}
            </SortableLinks>
          ))}
        </SortableContext>
      </DndContext>
      {!disabled && (
        <Button type="button" variant={'outline'} className="h-10 w-fit" onClick={addNewItem}>
          <div className="flex gap-2 items-center w-full justify-center">
            <Plus size={20} />
            {tInvoicing('article.buttons.addArticle')}
          </div>
        </Button>
      )}
    </div>
  );
}
