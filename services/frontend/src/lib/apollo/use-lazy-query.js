import { useRef, useCallback, useEffect } from 'react';
import { useLazyQuery as useApolloLazyQuery } from '@apollo/react-hooks';

export const useLazyQuery = (query, options) => {
  const [ execute, result ] = useApolloLazyQuery(query, options);
  const resolveRef = useRef();
  const rejectRef = useRef();

  useEffect(() => {
    if (result.called) {
      if (result.data !== undefined && resolveRef.current) {
        resolveRef.current(result.data);
      } else if (result.error !== undefined && rejectRef.current) {
        rejectRef.current(result.error);
      } else {
        return;
      }
      resolveRef.current = undefined;
      rejectRef.current = undefined;
    }
  }, [ result.data, result.error, result.called ]);

  const runQuery = useCallback((payload) => {
    execute(payload);
    return new Promise((resolve, reject) => {
      resolveRef.current = resolve;
      rejectRef.current = reject;
    })
  }, [execute]);

  return [ runQuery, result ];
};
