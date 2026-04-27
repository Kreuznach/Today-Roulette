import type { RouletteCategoryKey } from '../types';

export interface CategoryInfo {
  key: RouletteCategoryKey;
  label: string;
  description: string;
  color: string;
  lightColor: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    key: 'energy',
    label: '오늘의 기세',
    description: '오늘의 흐름과 에너지를 가볍게 확인',
    color: '#3182F6',
    lightColor: '#EBF3FF',
    icon: '⚡',
  },
  {
    key: 'spending',
    label: '오늘의 소비',
    description: '충동구매, 절약, 작은 사치 힌트',
    color: '#F04452',
    lightColor: '#FFF0F0',
    icon: '💳',
  },
  {
    key: 'meal',
    label: '오늘의 점심-저녁',
    description: '오늘 어울리는 식사 방향',
    color: '#F5A623',
    lightColor: '#FFF8EC',
    icon: '🍽️',
  },
  {
    key: 'social',
    label: '오늘의 사회생활',
    description: '말, 답장, 관계, 눈치 힌트',
    color: '#00B493',
    lightColor: '#E6F9F5',
    icon: '💬',
  },
  {
    key: 'mission',
    label: '오늘의 미션',
    description: '오늘 하나쯤 해볼 작은 행동',
    color: '#9B4FF4',
    lightColor: '#F3EAFF',
    icon: '🎯',
  },
];

export const CATEGORY_MAP: Record<RouletteCategoryKey, CategoryInfo> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c]),
) as Record<RouletteCategoryKey, CategoryInfo>;
