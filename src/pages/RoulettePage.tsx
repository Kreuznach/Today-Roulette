import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRouletteGame } from '@/features/roulette/hooks/useRouletteGame';
import { RouletteWheel } from '@/features/roulette/components/RouletteWheel';
import { CATEGORY_MAP } from '@/features/roulette/data/categories';
import { ROULETTE_RESULTS } from '@/features/roulette/data/results';

export function RoulettePage() {
  const navigate = useNavigate();
  const { todayRecord, spinFirst, isFinalized } = useRouletteGame();
  const [hasSpun, setHasSpun] = useState(false);

  // 오늘 이미 확정된 경우
  if (isFinalized) {
    navigate('/final', { replace: true });
    return null;
  }

  // 카테고리 선택 안 된 경우
  if (!todayRecord) {
    navigate('/', { replace: true });
    return null;
  }

  // 이미 1차 결과가 있는 경우
  if (todayRecord.firstResult) {
    navigate('/result', { replace: true });
    return null;
  }

  const category = CATEGORY_MAP[todayRecord.category];
  const items = ROULETTE_RESULTS[todayRecord.category];

  const handleSpinComplete = (_index: number) => {
    // RouletteWheel 컴포넌트가 완료 신호를 보내면
    // 실제 결과 계산은 spinFirst()로 처리
    const result = spinFirst();
    if (result) {
      setHasSpun(true);
      // 잠깐 대기 후 결과 화면으로 이동
      setTimeout(() => {
        navigate('/result');
      }, 800);
    }
  };

  return (
    <div className="page-container">
      <div className="page-content">
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: category.lightColor,
              padding: '6px 14px',
              borderRadius: '20px',
              marginBottom: '12px',
            }}
          >
            <span style={{ fontSize: '16px' }}>{category.icon}</span>
            <span
              style={{ fontSize: '13px', fontWeight: 600, color: category.color }}
            >
              {category.label}
            </span>
          </div>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#191F28',
              letterSpacing: '-0.4px',
              margin: 0,
            }}
          >
            룰렛을 돌려보세요
          </h2>
        </div>

        {/* 룰렛 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <RouletteWheel
            items={items}
            categoryColor={category.color}
            categoryLightColor={category.lightColor}
            onSpinComplete={handleSpinComplete}
            disabled={hasSpun}
          />
        </div>

        {/* 안내 */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#8B95A1',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {hasSpun
            ? '결과를 계산하는 중이에요...'
            : '버튼을 누르면 오늘의 결과가 정해져요\n하루에 한 번만 돌릴 수 있어요'}
        </p>
      </div>
    </div>
  );
}
