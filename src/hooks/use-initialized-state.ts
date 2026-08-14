import React from 'react';
import _ from 'lodash';

interface UseInitializedStateProps {
  data: any;
  getCurrentData: () => any;
  setFormData: (data: any) => void;
  resetData: () => void;
  loading: boolean;
}

const useInitializedState = ({
  data,
  getCurrentData,
  setFormData,
  resetData,
  loading
}: UseInitializedStateProps) => {
  const [initialData, setInitialData] = React.useState<any | null>(null);
  const [isDataLoaded, setIsDataLoaded] = React.useState(false);
  const lastInitializedDataRef = React.useRef<any>(null);

  const initializeData = React.useCallback(
    (force = false) => {
      if (loading) return;

      if (
        !force &&
        lastInitializedDataRef.current !== null &&
        _.isEqual(lastInitializedDataRef.current, data)
      ) {
        return;
      }

      setFormData(data);
      setInitialData(getCurrentData());
      setIsDataLoaded(true);
      lastInitializedDataRef.current = _.cloneDeep(data);
    },
    [data, getCurrentData, loading, setFormData]
  );

  React.useEffect(() => {
    initializeData();
  }, [initializeData]);

  const globalReset = () => {
    resetData();
    initializeData(true);
  };

  const isDisabled = React.useMemo(() => {
    if (!isDataLoaded || loading) return true;
    return _.isEqual(initialData, getCurrentData());
  }, [initialData, getCurrentData, isDataLoaded, loading]);

  return {
    isDisabled,
    globalReset,
    setInitialData,
    isDataLoaded
  };
};

export default useInitializedState;
