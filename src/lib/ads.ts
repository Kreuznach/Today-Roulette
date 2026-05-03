import { GoogleAdMob } from '@apps-in-toss/web-framework';

const AD_GROUP_ID_PROD = 'ait.v2.live.e5638822a9304075';
const AD_GROUP_ID_TEST = 'ait-ad-test-rewarded-id';

const _useTestAd = (() => {
  const adEnv = import.meta.env.VITE_AD_ENV;
  if (adEnv === 'test') return true;
  if (adEnv === 'production') return false;
  return import.meta.env.DEV;
})();

const AD_GROUP_ID = _useTestAd ? AD_GROUP_ID_TEST : AD_GROUP_ID_PROD;

export type AdResult = 'completed' | 'dismissed' | 'failed';

export function isAdSupported(): boolean {
  try {
    return GoogleAdMob.loadAppsInTossAdMob.isSupported() === true;
  } catch {
    return false;
  }
}

export async function loadAd(): Promise<boolean> {
  if (!isAdSupported()) { await delay(600); return true; }
  return new Promise((resolve) => {
    try {
      const cleanup = GoogleAdMob.loadAppsInTossAdMob({
        options: { adGroupId: AD_GROUP_ID },
        onEvent: (event) => { if (event.type === 'loaded') { cleanup(); resolve(true); } },
        onError: (err) => { console.warn('[ads] load failed:', err); resolve(false); },
      });
    } catch (err) { console.warn('[ads] loadAppsInTossAdMob failed:', err); resolve(false); }
  });
}

export async function showAd(): Promise<AdResult> {
  if (!isAdSupported()) { await delay(2000); return 'completed'; }
  return new Promise((resolve) => {
    try {
      let rewarded = false;
      GoogleAdMob.showAppsInTossAdMob({
        options: { adGroupId: AD_GROUP_ID },
        onEvent: (event) => {
          if (event.type === 'userEarnedReward') { rewarded = true; }
          if (event.type === 'dismissed') { resolve(rewarded ? 'completed' : 'dismissed'); }
          if (event.type === 'failedToShow') { resolve('failed'); }
        },
        onError: (err) => { console.warn('[ads] show failed:', err); resolve('failed'); },
      });
    } catch (err) { console.warn('[ads] showAppsInTossAdMob failed:', err); resolve('failed'); }
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
