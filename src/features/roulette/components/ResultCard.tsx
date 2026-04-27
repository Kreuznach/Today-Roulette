import type { RouletteFinalResult, RouletteCategoryKey } from '../types';
import { CATEGORY_MAP } from '../data/categories';

interface ResultCardProps {
  categoryKey: RouletteCategoryKey;
  result: RouletteFinalResult;
  isFinalized?: boolean;
}

export function ResultCard({ categoryKey, result, isFinalized = false }: ResultCardProps) {
  const category = CATEGORY_MAP[categoryKey];

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          background: category.lightColor,
          padding: '20px 24px 16px',
          borderBottom: `1.5px solid ${category.color}20`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <span style={{ fontSize: '20px' }}>{category.icon}</span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: category.color,
              letterSpacing: '-0.2px',
            }}
          >
            {category.label}
          </span>
          {isFinalized && (
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '11px',
                fontWeight: 600,
                color: '#FFFFFF',
                background: category.color,
                padding: '2px 8px',
                borderRadius: '20px',
              }}
            >
              확정
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#191F28',
            lineHeight: 1.3,
            letterSpacing: '-0.5px',
          }}
        >
          {result.title}
        </div>
      </div>

      {/* 요약 */}
      <div
        style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #F2F4F6',
        }}
      >
        <p
          style={{
            fontSize: '15px',
            color: '#3D4046',
            lineHeight: 1.65,
            margin: 0,
            letterSpacing: '-0.2px',
          }}
        >
          {result.summary}
        </p>
      </div>

      {/* 상세 섹션 */}
      <div style={{ padding: '16px 24px 24px' }}>
        <DetailRow
          emoji="✨"
          label="오늘의 포인트"
          text={result.lucky_point}
          color={category.color}
          bgColor={category.lightColor}
        />
        <DetailRow
          emoji="⚠️"
          label="조심할 것"
          text={result.avoid_point}
          color="#F5A623"
          bgColor="#FFF8EC"
        />
        <DetailRow
          emoji="💡"
          label="오늘 해볼 것"
          text={result.recommended_action}
          color="#00B493"
          bgColor="#E6F9F5"
          isLast
        />
      </div>
    </div>
  );
}

interface DetailRowProps {
  emoji: string;
  label: string;
  text: string;
  color: string;
  bgColor: string;
  isLast?: boolean;
}

function DetailRow({ emoji, label, text, color, bgColor, isLast = false }: DetailRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        marginBottom: isLast ? 0 : '12px',
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
        }}
      >
        {emoji}
      </div>
      <div style={{ flex: 1, paddingTop: '2px' }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: color,
            marginBottom: '3px',
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: '14px',
            color: '#3D4046',
            lineHeight: 1.5,
            letterSpacing: '-0.2px',
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
