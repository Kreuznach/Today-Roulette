/**
 * KST(한국 표준시, UTC+9) 기준 날짜 유틸리티
 */

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 현재 KST 날짜 문자열 (YYYY-MM-DD) */
export function getTodayKST(): string {
  const nowUtcMs = Date.now();
  const kstMs = nowUtcMs + KST_OFFSET_MS;
  const kstDate = new Date(kstMs);
  const year = kstDate.getUTCFullYear();
  const month = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** 두 날짜 문자열이 같은 KST 날인지 확인 */
export function isSameDayKST(dateA: string, dateB: string): boolean {
  return dateA === dateB;
}

/** YYYY-MM-DD → Date (KST 자정 기준) */
export function parseDateKST(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day) - KST_OFFSET_MS);
}

/** 최근 N일 날짜 문자열 배열 (오늘 포함, 최신순) */
export function getRecentDaysKST(days: number): string[] {
  const today = getTodayKST();
  const result: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(Date.now() + KST_OFFSET_MS - i * 86400000);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    result.push(`${year}-${month}-${day}`);
  }
  return result;
  void today; // suppress unused-var if needed
}

/** 날짜 문자열을 한국어 표기로 변환 (예: 4월 27일 (일)) */
export function formatDateKorean(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekDay = weekDays[d.getUTCDay()];
  return `${month}월 ${day}일 (${weekDay})`;
}
