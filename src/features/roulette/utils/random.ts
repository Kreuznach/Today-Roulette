import type { RouletteResultItem, RouletteFinalResult } from '../types';

/** 배열에서 무작위 인덱스 하나 반환 */
export function randomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

/** 배열에서 무작위 요소 하나 반환 */
export function pickRandom<T>(arr: readonly T[]): T {
  return arr[randomIndex(arr.length)];
}

/** 12개 결과 목록에서 하나를 무작위 선택하고 세부 문구도 랜덤 확정 */
export function drawResult(items: RouletteResultItem[]): {
  selectedIndex: number;
  finalResult: RouletteFinalResult;
} {
  const selectedIndex = randomIndex(items.length);
  const item = items[selectedIndex];
  return {
    selectedIndex,
    finalResult: {
      result_key: item.result_key,
      title: item.title,
      summary: pickRandom(item.summary_variants),
      lucky_point: pickRandom(item.lucky_points),
      avoid_point: pickRandom(item.avoid_points),
      recommended_action: pickRandom(item.recommended_actions),
    },
  };
}

/**
 * 룰렛 스핀 후 휠이 지정 세그먼트에 정확히 멈추도록
 * 회전 각도(deg)를 계산한다.
 *
 * @param currentRotation - 현재 누적 회전각 (deg)
 * @param targetIndex     - 멈춰야 할 세그먼트 인덱스 (0-based, 12개)
 * @returns 새로운 누적 회전각 (deg)
 */
export function calcSpinRotation(currentRotation: number, targetIndex: number): number {
  // 각 세그먼트 크기: 360 / 12 = 30도
  // 세그먼트 i의 중간 각도(시계 방향, 12시 기준): i * 30 + 15
  const segmentMidAngle = targetIndex * 30 + 15;
  const currentAngle = currentRotation % 360;
  // 포인터(12시)가 segmentMidAngle을 가리키려면 휠을 (360 - segmentMidAngle)만큼 회전
  const desiredAngle = (360 - segmentMidAngle) % 360;
  const delta = (desiredAngle - currentAngle + 360) % 360;
  // 최소 4바퀴(1440도) 추가
  return currentRotation + delta + 1440;
}
