import { useFocusEffect } from '@react-native-core';
import { useCallback } from 'react';

export function useRefreshOnFocus(refetch) {
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
}
