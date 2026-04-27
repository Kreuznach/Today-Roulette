import type { RoulettePlayRecord } from '../types';
import { getTodayKST, isSameDayKST } from '../utils/date';

const KEY_TODAY = 'roulette_today_record';
const KEY_HISTORY = 'roulette_history';

// ─── 오늘 기록 ────────────────────────────────────────────

export function loadTodayRecord(): RoulettePlayRecord | null {
  try {
    const raw = localStorage.getItem(KEY_TODAY);
    if (!raw) return null;
    const record: RoulettePlayRecord = JSON.parse(raw);
    // KST 날짜 기준으로 오늘 것만 유효
    if (!isSameDayKST(record.date, getTodayKST())) return null;
    return record;
  } catch {
    return null;
  }
}

export function saveTodayRecord(record: RoulettePlayRecord): void {
  try {
    localStorage.setItem(KEY_TODAY, JSON.stringify(record));
  } catch {
    // 저장 실패 시 무시 (용량 초과 등)
  }
}

export function clearTodayRecord(): void {
  localStorage.removeItem(KEY_TODAY);
}

// ─── 히스토리 (최근 30일) ─────────────────────────────────

export function loadHistory(): RoulettePlayRecord[] {
  try {
    const raw = localStorage.getItem(KEY_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw) as RoulettePlayRecord[];
  } catch {
    return [];
  }
}

export function appendToHistory(record: RoulettePlayRecord): void {
  try {
    const history = loadHistory();
    // 같은 날짜 기록이 있으면 교체
    const idx = history.findIndex((r) => isSameDayKST(r.date, record.date));
    if (idx >= 0) {
      history[idx] = record;
    } else {
      history.unshift(record);
    }
    // 최근 30일만 유지
    const trimmed = history.slice(0, 30);
    localStorage.setItem(KEY_HISTORY, JSON.stringify(trimmed));
  } catch {
    // 저장 실패 시 무시
  }
}

/** 최근 7일 기록만 반환 (최신순) */
export function loadRecentHistory(days = 7): RoulettePlayRecord[] {
  const history = loadHistory();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return history.filter((r) => {
    const [y, m, d] = r.date.split('-').map(Number);
    const ts = Date.UTC(y, m - 1, d);
    return ts >= cutoff;
  });
}
