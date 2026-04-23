import React from 'react';
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
import { LineArticle } from '@/types/core/article';

interface ArticleManagementProps {
  className?: string;
  title?: string;
  description?: string;
  disabled?: boolean;
  articles: LineArticle[];
  setArticles: (articles: LineArticle[]) => void;
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

  const sortableItems = React.useMemo(
    () => articles.map((item) => ({ ...item, id: item.clientId })),
    [articles]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = articles.findIndex((item) => item?.clientId === active.id);
    const newIndex = articles.findIndex((item) => item?.clientId === over.id);
    setArticles(arrayMove(articles, oldIndex, newIndex));
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
        <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
          {sortableItems.map((item, index) => (
            <SortableLinks
              key={item.id}
              id={{ id: item.id }}
              onDelete={!disabled ? () => handleDelete(item.clientId) : undefined}>
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
