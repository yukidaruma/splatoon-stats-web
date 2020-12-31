import { MutableRefObject, useCallback, useEffect } from 'react';

const useEnterKey = (
  onEnter: (e: React.KeyboardEvent) => void,
  ref: MutableRefObject<HTMLInputElement> = { current: (document as unknown) as HTMLInputElement },
): void => {
  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        onEnter(e);
      }
    },
    [onEnter],
  );

  const eventListner = (handleKeyUp as unknown) as EventListener;
  useEffect(() => {
    ref.current?.addEventListener('keyup', eventListner);
    return () => ref.current?.removeEventListener('keyup', eventListner);
  }, [handleKeyUp]);
};

export default useEnterKey;
