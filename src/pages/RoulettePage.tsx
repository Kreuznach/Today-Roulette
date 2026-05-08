import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRouletteGame } from '@/features/roulette/hooks/useRouletteGame';
import { RouletteWheel } from '@/features/roulette/components/RouletteWheel';
import { CATEGORY_MAP } from '@/features/roulette/data/categories';
import { ROULETTE_RESULTS } from '@/features/roulette/data/results';

export function RoulettePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRetry = (location.state as { isRetry?: boolean } | null)?.isRetry === true;
  const { todayRecord, spinFirst, spinRetry, saveRetryResult, isFinalized } = useRouletteGame();
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

  // 1차 결과가 있고 retry 모드가 아닌 경우
  if (todayRecord.firstResult && !isRetry) {
    navigate('/result', { replace: true });
    return null;
  }

  const category = CATEGORY_MAP[todayRecord.category];
  const items = ROULETTE_RESULTS[todayRecord.category];

  const handleSpinComplete = (_index: number) => {
    setHasSpun(true);
    if (isRetry) {
      // 광고 후 재추첨: spinRetry()로 결과 계산 후 최종 확정
      const retryResult = spinRetry();
      if (retryResult) {
        saveRetryResult(retryResult);
        setTimeout(() => {
          navigate('/final', { replace: true });
        }, 800);
      }
    } else {
      // 첫 번째 스핀: spinFirst()로 결과 저장 후 결과 화면으로
      const result = spinFirst();
      if (result) {
        setTimeout(() => {
          navigate('/result');
        }, 800);
      }
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
            {isRetry ? '한 번 더 돌려보세요' : '룰렛을 돌려보세요'}
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
            : isRetry
              ? '광고 시청 완료! 다시 돌려서 새로운 결과를 받아보세요'
              : '버튼을 누르면 오늘의 결과가 정해져요\n하루에 한 번만 돌릴 수 있어요'}
        </p>
      </div>
    </div>
  );
}
