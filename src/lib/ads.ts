import { GoogleAdMob } from '@apps-in-toss/web-framework';

/** 재도전 광고 그룹 ID */
const AD_GROUP_ID_PROD = 'ait.v2.live.e5638822a9304075';

/**
 * Toss Ads 공식 테스트 전용 광고 ID (리워드 광고)
 * 참고: https://developers-apps-in-toss.toss.im/ads/develop.html#테스트하기
 * 실제 광고 ID로 테스트하면 정책 위반으로 간주되어 불이익을 받을 수 있습니다.
 */
const AD_GROUP_ID_TEST = 'ait-ad-test-rewarded-id';

/**
 * 테스트 광고 여부 결정
 *  - VITE_AD_ENV=test        → 테스트 ID 강제 사용
 *  - VITE_AD_ENV=production  → 프로덕션 ID 강제 사용
 *  - 미설정                  → 개발 빌드이면 테스트 ID, 아니면 프로덕션 ID
 */
const _useTestAd = (() => {
  const adEnv = import.meta.env.VITE_AD_ENV;
  if (adEnv === 'test') return true;
  if (adEnv === 'production') return false;
  return import.meta.env.DEV;
})();

const AD_GROUP_ID = _useTestAd ? AD_GROUP_ID_TEST : AD_GROUP_ID_PROD;

function _isAitSupported(): boolean {
  try {
    return GoogleAdMob.loadAppsInTossAdMob.isSupported() === true;
  } catch {
    return false;
  }
}

/**
 * 광고 시청 후 재도전 기회 획득
 *
 * AIT 환경: loadAppsInTossAdMob → showAppsInTossAdMob 두 단계로 동작합니다.
 *   - loaded 이벤트 수신 시 광고 준비 완료
 *   - userEarnedReward 이벤트 수신 시 보상 획득 확정
 *   - dismissed 이벤트 수신 시 최종 결과를 반환합니다 (보상 미획득이면 false)
 * 개발/데스크톱 환경: 1.5초 지연 후 true를 반환하는 Mock으로 폴백합니다.
 *
 * @returns 광고를 끝까지 시청해 보상을 받으면 true, 아니면 false
 */
export async function watchAd(): Promise<boolean> {
  if (!_isAitSupported()) {
    await new Promise<void>((r) => setTimeout(r, 1500));
    return true;
  }

  // 1단계: 광고 로드
  await new Promise<void>((resolve, reject) => {
    const cleanup = GoogleAdMob.loadAppsInTossAdMob({
      options: { adGroupId: AD_GROUP_ID },
      onEvent: (event) => {
        if (event.type === 'loaded') { cleanup(); resolve(); }
      },
      onError: (error) => { cleanup(); reject(error); },
    });
  });

  // 2단계: 광고 표시 & 보상 확인
  return new Promise<boolean>((resolve) => {
    let rewarded = false;
    GoogleAdMob.showAppsInTossAdMob({
      options: { adGroupId: AD_GROUP_ID },
      onEvent: (event) => {
        if (event.type === 'userEarnedReward') rewarded = true;
        if (event.type === 'dismissed')        resolve(rewarded);
        if (event.type === 'failedToShow')     resolve(false);
      },
      onError: () => resolve(false),
    });
  });
}
