import { useRef, useState } from 'react';
import type { RouletteResultItem } from '../types';
import { calcSpinRotation } from '../utils/random';

/** result_key → 이모지 룩업 맵 */
const RESULT_EMOJIS: Record<string, string> = {
  // ── energy ──────────────────────────────────────────────
  runaway_train_mode: '🚂',
  calm_otter_mode: '🦦',
  silent_observer_mode: '🔭',
  infinite_positive_mode: '🌟',
  careful_turtle_mode: '🐢',
  flash_lightning_mode: '⚡',
  foggy_haze_mode: '🌫️',
  solid_rock_mode: '🪨',
  free_wind_mode: '💨',
  cool_analyst_mode: '🔍',
  warm_sunshine_mode: '☀️',
  before_earthquake_mode: '🌋',
  // ── spending ────────────────────────────────────────────
  impulse_buy_alert: '🛍️',
  value_hunter_mode: '🎯',
  small_luxury_day: '💅',
  full_saving_mode: '🐷',
  benefit_collector_mode: '🎁',
  subscription_clean_up_day: '✂️',
  delivery_temptation_mode: '🛵',
  cart_patrol_mode: '🛒',
  coffee_ritual_day: '☕',
  big_spend_warning: '💸',
  point_use_day: '🎫',
  buy_god_descends: '👑',
  // ── meal ────────────────────────────────────────────────
  broth_craving_day: '🍲',
  light_meal_day: '🥗',
  hearty_meal_day: '🍖',
  solo_meal_day: '🍱',
  eat_together_day: '🍻',
  spicy_crave_day: '🌶️',
  healthy_food_day: '🥦',
  delivery_is_answer_day: '📦',
  dine_out_day: '🍽️',
  home_cooked_best_day: '🏠',
  quick_fix_day: '⏱️',
  new_menu_day: '🆕',
  // ── social ──────────────────────────────────────────────
  save_your_words_day: '🤫',
  presence_explosion_day: '💥',
  mediator_position_day: '⚖️',
  silent_watchman_day: '👁️',
  fast_reply_day: '📨',
  listening_mode_day: '👂',
  step_back_day: '🚶',
  honest_speak_day: '💬',
  considerate_day: '💝',
  teamwork_master_day: '🤝',
  meeting_focus_day: '📋',
  intuition_100_day: '🔮',
  // ── mission ─────────────────────────────────────────────
  drink_2l_water: '💧',
  walk_10_minutes: '👟',
  no_delivery_today: '🚫',
  clean_desk_mission: '🗂️',
  stretch_3_minutes: '🧘',
  send_gratitude_message: '💌',
  sns_1hour_cut: '📵',
  new_music_mission: '🎵',
  sleep_early_challenge: '😴',
  cook_own_meal: '🍳',
  compliment_someone: '⭐',
  write_one_line_diary: '📝',
};

/** result_key에 해당하는 이모지 반환. 없으면 카테고리 fallback 사용 */
function getEmoji(resultKey: string, fallback = '🎲'): string {
  return RESULT_EMOJIS[resultKey] ?? fallback;
}

interface RouletteWheelProps {
  items: RouletteResultItem[];
  categoryColor: string;
  categoryLightColor: string;
  onSpinComplete: (index: number) => void;
  disabled?: boolean;
}

const SEGMENT_COUNT = 12;
const CX = 150;
const CY = 150;
const R = 138;
const INNER_R = 18; // 중심 원

// 12칸 교대 색상 (카테고리 컬러 기반)
const getSegmentColors = (lightColor: string): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < SEGMENT_COUNT; i++) {
    colors.push(i % 2 === 0 ? lightColor : '#FFFFFF');
  }
  return colors;
};

function getSegmentPath(index: number): string {
  const startAngle = -Math.PI / 2 + (index * 2 * Math.PI) / SEGMENT_COUNT;
  const endAngle = -Math.PI / 2 + ((index + 1) * 2 * Math.PI) / SEGMENT_COUNT;
  const x1 = CX + R * Math.cos(startAngle);
  const y1 = CY + R * Math.sin(startAngle);
  const x2 = CX + R * Math.cos(endAngle);
  const y2 = CY + R * Math.sin(endAngle);
  return `M ${CX} ${CY} L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${R} ${R} 0 0 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`;
}

function getTextTransform(index: number): string {
  const midAngle = -Math.PI / 2 + ((index + 0.5) * 2 * Math.PI) / SEGMENT_COUNT;
  const textR = R * 0.62;
  const tx = CX + textR * Math.cos(midAngle);
  const ty = CY + textR * Math.sin(midAngle);
  const rotDeg = (midAngle * 180) / Math.PI + 90;
  return `translate(${tx.toFixed(2)}, ${ty.toFixed(2)}) rotate(${rotDeg.toFixed(2)})`;
}

export function RouletteWheel({
  items,
  categoryColor,
  categoryLightColor,
  onSpinComplete,
  disabled = false,
}: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const targetIndexRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);

  const segmentColors = getSegmentColors(categoryLightColor);

  const handleSpin = () => {
    if (isSpinning || disabled) return;

    // 결과는 이미 외부에서 결정되어 있으므로 UI만 돌리면 됨
    // 실제 결과는 spin 시작 전에 계산해서 targetIndex로 전달받는 구조
    // 여기서는 간단히 random으로 결정
    const targetIndex = Math.floor(Math.random() * SEGMENT_COUNT);
    targetIndexRef.current = targetIndex;

    const newRotation = calcSpinRotation(rotationRef.current, targetIndex);
    rotationRef.current = newRotation;
    setRotation(newRotation);
    setIsSpinning(true);

    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete(targetIndex);
    }, 2800);
  };

  // 외부에서 spin을 제어할 수 있도록 imperative handle 대신 event 방식 사용
  // 실제로는 페이지에서 버튼 클릭 → handleSpin 호출

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      {/* 포인터 (삼각형) */}
      <div style={{ position: 'relative', width: '340px', height: '340px' }}>
        {/* 포인터 */}
        <div
          style={{
            position: 'absolute',
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: `22px solid ${categoryColor}`,
            zIndex: 10,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
          }}
        />

        {/* 룰렛 SVG */}
        <svg
          viewBox="0 0 300 300"
          width="340"
          height="340"
          style={{ overflow: 'visible' }}
        >
          {/* 외곽 그림자 원 */}
          <circle
            cx={CX}
            cy={CY}
            r={R + 2}
            fill="none"
            stroke="#E5E8EB"
            strokeWidth="3"
          />

          {/* 회전하는 그룹 */}
          <g
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: `${CX}px ${CY}px`,
              transition: isSpinning
                ? 'transform 2.8s cubic-bezier(0.17, 0.67, 0.08, 1.0)'
                : 'none',
            }}
          >
            {/* 세그먼트 */}
            {items.slice(0, SEGMENT_COUNT).map((item, i) => (
              <g key={item.result_key}>
                <path
                  d={getSegmentPath(i)}
                  fill={segmentColors[i]}
                  stroke="#E5E8EB"
                  strokeWidth="0.8"
                />
                <text
                  transform={getTextTransform(i)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="15"
                  style={{ userSelect: 'none', fontFamily: "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif" }}
                >
                  {getEmoji(item.result_key)}
                </text>
              </g>
            ))}

            {/* 중심 원 */}
            <circle cx={CX} cy={CY} r={INNER_R} fill={categoryColor} />
            <circle cx={CX} cy={CY} r={INNER_R - 4} fill="white" opacity={0.25} />
          </g>
        </svg>
      </div>

      {/* 돌리기 버튼 */}
      <button
        onClick={handleSpin}
        disabled={isSpinning || disabled}
        style={{
          padding: '16px 48px',
          background: isSpinning || disabled ? '#B0B8C1' : categoryColor,
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '14px',
          fontSize: '17px',
          fontWeight: 700,
          cursor: isSpinning || disabled ? 'default' : 'pointer',
          transition: 'background 0.2s, transform 0.1s',
          WebkitTapHighlightColor: 'transparent',
          boxShadow: isSpinning || disabled ? 'none' : `0 4px 12px ${categoryColor}40`,
          letterSpacing: '-0.3px',
        }}
        onMouseDown={(e) => {
          if (!isSpinning && !disabled)
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
        }}
        onTouchStart={(e) => {
          if (!isSpinning && !disabled)
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
        }}
        onTouchEnd={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
        }}
      >
        {isSpinning ? '돌아가는 중...' : '룰렛 돌리기'}
      </button>
    </div>
  );
}
