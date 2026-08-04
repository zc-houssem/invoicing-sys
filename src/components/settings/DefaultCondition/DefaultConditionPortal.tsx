import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { DefaultConditionItem } from './DefaultConditionItem';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import React from 'react';
import { useDefaultConditionManager } from './hooks/useDefaultConditionManager';
import { UpdateDefaultConditionDto } from '@/types';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { Spinner } from '@/components/shared';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useRouter } from 'next/router';
import { useActiveCompanyContext } from '@/context/ActiveCompanyContext';
import { useFooter } from '@/context/FooterContext';

interface DefaultConditionPortalProps {
  className?: string;
}
// Memoized wrapper is moved outside to prevent unmounting/remounting on every render
const MemoizedConditionItemWrapper = React.memo(
  ({ condition, handleItemChange, tSettings }: any) => {
    const onChange = React.useCallback(
      (value: string) => {
        handleItemChange(condition.id || 0, value);
      },
      [condition.id, handleItemChange]
    );

    return (
      <DefaultConditionItem
        title={tSettings(`default_condition.elements.${condition.document_type}`)}
        value={condition.value || ''}
        onChange={onChange}
      />
    );
  }
);
MemoizedConditionItemWrapper.displayName = 'MemoizedConditionItemWrapper';

export const DefaultConditionPortal = ({ className }: DefaultConditionPortalProps) => {
  //next-router
  const router = useRouter();
  const { t: tSettings } = useTranslation('settings');
  const { t: tCommon } = useTranslation('common');

  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: tCommon('menu.settings.title') },
      { title: tCommon('menu.enterprise.title') },
      { title: tCommon('settings.system.default_condition') }
    ]);
  }, [router.locale, setRoutes, tCommon]);

  const { activeCompanyId } = useActiveCompanyContext();
  const defaultConditionsStore = useDefaultConditionManager((state) => state.defaultConditions);
  const setDefaultConditionsStore = useDefaultConditionManager(
    (state) => state.setDefaultConditions
  );
  const setDefaultConditionByIdStore = useDefaultConditionManager(
    (state) => state.setDefaultConditionById
  );

  const { setContent, clearContent } = useFooter();

  const {
    isPending: isDefaultConditionsPending,
    data: defaultConditions,
    refetch: refetchDefaultConditions
  } = useQuery({
    queryKey: ['default-conditions', activeCompanyId],
    queryFn: () => api.defaultCondition.find(activeCompanyId ?? undefined),
    enabled: !!activeCompanyId
  });

  React.useEffect(() => {
    if (defaultConditions) {
      setDefaultConditionsStore(defaultConditions);
    }
  }, [defaultConditions, setDefaultConditionsStore]);

  const { mutate: updateDefaultConditions, isPending: isUpdatePending } = useMutation({
    mutationFn: (
      updateDefaultConditions: UpdateDefaultConditionDto | UpdateDefaultConditionDto[]
    ) => {
      if (!activeCompanyId) throw new Error('No active company');
      return api.defaultCondition.update(activeCompanyId, updateDefaultConditions);
    },
    onSuccess: () => {
      toast.success(tSettings('default_condition.action_edit_success'));
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, tSettings('default_condition.action_edit_failure')));
    }
  });

  const defaultConditionsRef = React.useRef(defaultConditionsStore);
  defaultConditionsRef.current = defaultConditionsStore;

  const handleSubmitUpdate = React.useCallback(() => {
    updateDefaultConditions(defaultConditionsRef.current);
  }, [updateDefaultConditions]);

  const handleItemChange = React.useCallback(
    (id: number, value: string) => {
      setDefaultConditionByIdStore(id, value);
    },
    [setDefaultConditionByIdStore]
  );

  React.useEffect(() => {
    setContent?.(
      <div className="flex justify-end w-full gap-2">
        <Button
          onClick={handleSubmitUpdate}
          disabled={isUpdatePending || isDefaultConditionsPending}>
          {tCommon('commands.save')}
          {isUpdatePending && <Spinner show />}
        </Button>
        <Button variant="secondary" onClick={() => refetchDefaultConditions()}>
          {tCommon('commands.cancel')}
        </Button>
      </div>
    );
    return () => clearContent?.();
  }, [
    handleSubmitUpdate,
    isUpdatePending,
    isDefaultConditionsPending,
    tCommon,
    setContent,
    clearContent,
    refetchDefaultConditions
  ]);

  return (
    <div className={cn('flex flex-col flex-1', className)}>
        {defaultConditionsStore?.map((condition) => {
          return (
            <MemoizedConditionItemWrapper
              key={condition.id}
              condition={condition}
              handleItemChange={handleItemChange}
              tSettings={tSettings}
            />
          );
        })}
    </div>
  );
};
