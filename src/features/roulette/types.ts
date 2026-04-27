// 룰렛 카테고리 키 (내부 영문 snake_case)
export type RouletteCategoryKey =
  | 'energy'
  | 'spending'
  | 'meal'
  | 'social'
  | 'mission';

// 결과 사전 단일 항목
export interface RouletteResultItem {
  result_key: string;
  title: string;
  summary_variants: string[];
  lucky_points: string[];
  avoid_points: string[];
  recommended_actions: string[];
}

// 최종 결과 (각 variants에서 1개씩 선택된 상태)
export interface RouletteFinalResult {
  result_key: string;
  title: string;
  summary: string;
  lucky_point: string;
  avoid_point: string;
  recommended_action: string;
}

// 오늘의 플레이 기록
export interface RoulettePlayRecord {
  date: string; // KST 날짜 (YYYY-MM-DD)
  category: RouletteCategoryKey;
  categoryLabel: string; // 화면 노출용 한국어 레이블
  firstResult: RouletteFinalResult | null; // 1차 결과 (null = 아직 룰렛 안 돌림)
  finalResult: RouletteFinalResult | null; // 최종 결과 (null = 미확정)
  isFinalized: boolean;
  usedAdRetry: boolean; // 광고 재추첨 사용 여부
  createdAt: string; // ISO timestamp
  finalizedAt?: string; // ISO timestamp
}

// 앱 전체 상태
export type AppPhase =
  | 'idle' // 오늘 플레이 전
  | 'category_selected' // 카테고리 선택됨, 룰렛 미실행
  | 'first_result' // 1차 결과 표시 중 (미확정)
  | 'finalized'; // 오늘 결과 확정
