import { useState, useCallback } from 'react';
import { isAdSupported, loadAd, showAd, type AdResult } from '@/lib/ads';

type AdState = 'idle' | 'loading' | 'ready' | 'showing' | 'done' | 'error';

interface UseRewardAdReturn {
  adState: AdState;
  errorMessage: string | null;
  prepareAd: () => Promise<boolean>;
  triggerAd: () => Promise<AdResult>;
  reset: () => void;
}

export function useRewardAd(): UseRewardAdReturn {
  const [adState, setAdState] = useState<AdState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /** 광고 사전 로드 */
  const prepareAd = useCallback(async (): Promise<boolean> => {
    setAdState('loading');
    setErrorMessage(null);

    if (!isAdSupported()) {
      setAdState('error');
      setErrorMessage('광고를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      return false;
    }

    const loaded = await loadAd();
    if (!loaded) {
      setAdState('error');
      setErrorMessage('광고를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      return false;
    }

    setAdState('ready');
    return true;
  }, []);

  /** 광고 표시 및 결과 반환 */
  const triggerAd = useCallback(async (): Promise<AdResult> => {
    if (adState !== 'ready') return 'failed';

    setAdState('showing');
    const result = await showAd();

    if (result === 'completed') {
      setAdState('done');
    } else {
      setAdState('error');
      if (result === 'dismissed') {
        setErrorMessage('광고를 끝까지 시청해야 재추첨할 수 있어요.');
      } else {
        setErrorMessage('광고를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      }
    }

    return result;
  }, [adState]);

  const reset = useCallback(() => {
    setAdState('idle');
    setErrorMessage(null);
  }, []);

  return { adState, errorMessage, prepareAd, triggerAd, reset };
}
