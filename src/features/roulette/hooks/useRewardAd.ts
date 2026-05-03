import { useState, useCallback } from 'react';
import { watchAd } from '@/lib/ads';

type AdState = 'idle' | 'loading' | 'done' | 'error';

interface UseRewardAdReturn {
  adState: AdState;
  errorMessage: string | null;
  startAd: () => Promise<boolean>;
  reset: () => void;
}

export function useRewardAd(): UseRewardAdReturn {
  const [adState, setAdState] = useState<AdState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startAd = useCallback(async (): Promise<boolean> => {
    setAdState('loading');
    setErrorMessage(null);
    try {
      const rewarded = await watchAd();
      if (rewarded) {
        setAdState('done');
        return true;
      } else {
        setAdState('error');
        setErrorMessage('광고를 끝까지 시청해야 재추첨할 수 있어요.');
        return false;
      }
    } catch {
      setAdState('error');
      setErrorMessage('광고를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setAdState('idle');
    setErrorMessage(null);
  }, []);

  return { adState, errorMessage, startAd, reset };
}
