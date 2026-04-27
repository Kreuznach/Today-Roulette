import { useState, useCallback } from 'react';
import type { RoulettePlayRecord, RouletteCategoryKey, RouletteFinalResult } from '../types';
import { ROULETTE_RESULTS } from '../data/results';
import { CATEGORY_MAP } from '../data/categories';
import { drawResult } from '../utils/random';
import { getTodayKST } from '../utils/date';
import {
  loadTodayRecord,
  saveTodayRecord,
  loadRecentHistory,
  appendToHistory,
} from '../storage/rouletteStorage';

export function useRouletteGame() {
  const [todayRecord, setTodayRecord] = useState<RoulettePlayRecord | null>(
    () => loadTodayRecord(),
  );
  const [history] = useState(() => loadRecentHistory(7));

  // ─── 카테고리 선택 ────────────────────────────────────

  const selectCategory = useCallback((key: RouletteCategoryKey) => {
    const catInfo = CATEGORY_MAP[key];
    const record: RoulettePlayRecord = {
      date: getTodayKST(),
      category: key,
      categoryLabel: catInfo.label,
      firstResult: null,
      finalResult: null,
      isFinalized: false,
      usedAdRetry: false,
      createdAt: new Date().toISOString(),
    };
    saveTodayRecord(record);
    setTodayRecord(record);
  }, []);

  // ─── 1차 룰렛 스핀 ───────────────────────────────────

  const spinFirst = useCallback((): RouletteFinalResult | null => {
    if (!todayRecord) return null;
    const items = ROULETTE_RESULTS[todayRecord.category];
    const { finalResult } = drawResult(items);
    const updated: RoulettePlayRecord = {
      ...todayRecord,
      firstResult: finalResult,
    };
    saveTodayRecord(updated);
    setTodayRecord(updated);
    return finalResult;
  }, [todayRecord]);

  // ─── 결과 확정 ───────────────────────────────────────

  const confirmResult = useCallback(() => {
    if (!todayRecord?.firstResult) return;
    const updated: RoulettePlayRecord = {
      ...todayRecord,
      finalResult: todayRecord.firstResult,
      isFinalized: true,
      finalizedAt: new Date().toISOString(),
    };
    saveTodayRecord(updated);
    appendToHistory(updated);
    setTodayRecord(updated);
  }, [todayRecord]);

  // ─── 광고 후 재추첨 결과 저장 ────────────────────────

  const saveRetryResult = useCallback(
    (retryResult: RouletteFinalResult) => {
      if (!todayRecord) return;
      const updated: RoulettePlayRecord = {
        ...todayRecord,
        finalResult: retryResult,
        isFinalized: true,
        usedAdRetry: true,
        finalizedAt: new Date().toISOString(),
      };
      saveTodayRecord(updated);
      appendToHistory(updated);
      setTodayRecord(updated);
    },
    [todayRecord],
  );

  // ─── 재추첨용 스핀 (광고 완료 후) ───────────────────

  const spinRetry = useCallback((): RouletteFinalResult | null => {
    if (!todayRecord) return null;
    const items = ROULETTE_RESULTS[todayRecord.category];
    const { finalResult } = drawResult(items);
    return finalResult;
  }, [todayRecord]);

  // ─── Computed ────────────────────────────────────────

  const canPlayToday = todayRecord === null;
  const hasSelectedCategory = todayRecord !== null && todayRecord.firstResult === null;
  const hasFirstResult =
    todayRecord !== null && todayRecord.firstResult !== null && !todayRecord.isFinalized;
  const isFinalized = todayRecord?.isFinalized ?? false;
  const canRetry =
    todayRecord !== null &&
    todayRecord.firstResult !== null &&
    !todayRecord.isFinalized &&
    !todayRecord.usedAdRetry;

  return {
    todayRecord,
    history,
    canPlayToday,
    hasSelectedCategory,
    hasFirstResult,
    isFinalized,
    canRetry,
    selectCategory,
    spinFirst,
    confirmResult,
    saveRetryResult,
    spinRetry,
  };
}
