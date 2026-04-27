/**
 * Apps in Toss 광고 연동 추상화 레이어
 *
 * - 개발 환경(VITE_AD_MOCK=true 또는 import.meta.env.DEV): mock 모드로 동작
 * - 실제 환경: AIT SDK 브리지 호출
 *
 * 실제 adGroupId는 환경변수 VITE_AD_GROUP_ID로 관리한다.
 * 코드에 하드코딩하지 말 것.
 */

const AD_GROUP_ID = import.meta.env.VITE_AD_GROUP_ID ?? '';
const USE_MOCK =
  import.meta.env.VITE_AD_MOCK === 'true' || import.meta.env.DEV;

// ─── AIT SDK 타입 선언 ────────────────────────────────────

export type AdResult = 'completed' | 'dismissed' | 'failed';

interface AitAdsBridge {
  isSupported?: () => boolean;
  loadFullScreenAd?: (config: { adGroupId: string }) => Promise<void>;
  showFullScreenAd?: (config: {
    adGroupId: string;
  }) => Promise<{ result: AdResult }>;
}

declare global {
  interface Window {
    __AIT_BRIDGE__?: {
      ads?: AitAdsBridge;
    };
  }
}

// ─── 내부 상태 ────────────────────────────────────────────

let adLoaded = false;

// ─── Public API ───────────────────────────────────────────

/** 광고 기능 지원 여부 확인 */
export function isAdSupported(): boolean {
  if (USE_MOCK) return true;
  return window.__AIT_BRIDGE__?.ads?.isSupported?.() ?? false;
}

/**
 * 광고 사전 로드
 * @returns 로드 성공 여부
 */
export async function loadAd(): Promise<boolean> {
  adLoaded = false;

  if (USE_MOCK) {
    await delay(600);
    adLoaded = true;
    return true;
  }

  const bridge = window.__AIT_BRIDGE__?.ads;
  if (!bridge?.loadFullScreenAd) {
    console.warn('[ads] loadFullScreenAd 브리지가 없습니다.');
    return false;
  }

  try {
    await bridge.loadFullScreenAd({ adGroupId: AD_GROUP_ID });
    adLoaded = true;
    return true;
  } catch (err) {
    console.warn('[ads] 광고 로드 실패:', err);
    return false;
  }
}

/**
 * 광고 표시 (로드된 광고가 없으면 실패 반환)
 * @returns 'completed' | 'dismissed' | 'failed'
 */
export async function showAd(): Promise<AdResult> {
  if (!adLoaded) {
    return 'failed';
  }

  if (USE_MOCK) {
    // 개발 환경: 2초 대기 후 완료 (광고 시청 시뮬레이션)
    await delay(2000);
    adLoaded = false;
    return 'completed';
  }

  const bridge = window.__AIT_BRIDGE__?.ads;
  if (!bridge?.showFullScreenAd) {
    adLoaded = false;
    return 'failed';
  }

  try {
    const result = await bridge.showFullScreenAd({ adGroupId: AD_GROUP_ID });
    adLoaded = false;
    return result.result;
  } catch (err) {
    console.warn('[ads] 광고 표시 실패:', err);
    adLoaded = false;
    return 'failed';
  }
}

// ─── 내부 헬퍼 ───────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
