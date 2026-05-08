import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRouletteGame } from '@/features/roulette/hooks/useRouletteGame';
import { useRewardAd } from '@/features/roulette/hooks/useRewardAd';
import { ResultCard } from '@/features/roulette/components/ResultCard';
import { CATEGORY_MAP } from '@/features/roulette/data/categories';

export function ResultPage() {
  const navigate = useNavigate();
  const { todayRecord, confirmResult, canRetry, isFinalized } = useRouletteGame();
  const { errorMessage, startAd, reset: resetAd } = useRewardAd();
  const [adFlowStep, setAdFlowStep] = useState<'idle' | 'confirm' | 'loading'>('idle');

  // 이미 확정되면 최종 결과 화면으로
  useEffect(() => {
    if (isFinalized) {
      navigate('/final', { replace: true });
    }
  }, [isFinalized, navigate]);

  if (!todayRecord?.firstResult) {
    navigate('/', { replace: true });
    return null;
  }

  const category = CATEGORY_MAP[todayRecord.category];
  const firstResult = todayRecord.firstResult;

  // ─── 결과 확정 ────────────────────────────────────

  const handleConfirm = () => {
    confirmResult();
    navigate('/final');
  };

  // ─── 광고 재추첨 플로우 ───────────────────────────

  const handleAdRetryRequest = async () => {
    setAdFlowStep('confirm');
  };

  const handleAdRetryConfirm = async () => {
    setAdFlowStep('loading');
    const rewarded = await startAd();
    if (rewarded) {
      navigate('/roulette', { state: { isRetry: true } });
    } else {
      setAdFlowStep('idle');
    }
  };

  const handleAdRetryCancel = () => {
    setAdFlowStep('idle');
    resetAd();
  };

  // ─── 렌더링 ──────────────────────────────────────

  return (
    <div className="page-container">
      <div className="page-content">
        {/* 헤더 */}
        <div style={{ marginBottom: '20px' }}>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#191F28',
              letterSpacing: '-0.4px',
              marginBottom: '4px',
            }}
          >
            오늘의 결과
          </h2>
          <p style={{ fontSize: '13px', color: '#8B95A1', margin: 0 }}>
            확정 전까지 한 번 더 돌릴 수 있어요
          </p>
        </div>

        {/* 결과 카드 */}
        <div style={{ marginBottom: '24px' }}>
          <ResultCard
            categoryKey={todayRecord.category}
            result={firstResult}
            isFinalized={false}
          />
        </div>

        {/* 오류 메시지 */}
        {errorMessage && (
          <div
            style={{
              background: '#FFF0F0',
              border: '1px solid #FECDD3',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '16px',
            }}
          >
            <p style={{ fontSize: '13px', color: '#F04452', margin: 0, lineHeight: 1.5 }}>
              {errorMessage}
            </p>
          </div>
        )}

        {/* 버튼 영역 */}
        {adFlowStep === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              className="btn-primary"
              onClick={handleConfirm}
              style={{ background: category.color, boxShadow: `0 4px 12px ${category.color}40` }}
            >
              오늘 결과 확정하기
            </button>

            {canRetry && (
              <button
                className="btn-secondary"
                onClick={handleAdRetryRequest}
              >
                광고 시청 후 같은 카테고리에서 한 번 더 돌리기
              </button>
            )}

            {!canRetry && todayRecord.usedAdRetry && (
              <p style={{ textAlign: 'center', fontSize: '13px', color: '#B0B8C1', margin: 0 }}>
                재추첨은 하루 1회만 가능해요
              </p>
            )}
          </div>
        )}

        {/* 광고 확인 단계 */}
        {adFlowStep === 'confirm' && (
          <div
            style={{
              background: '#F9FAFB',
              border: '1.5px solid #E5E8EB',
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#191F28',
                marginBottom: '8px',
                letterSpacing: '-0.3px',
              }}
            >
              오늘 결과 다시 정하기
            </h3>
            <p style={{ fontSize: '13px', color: '#6B7684', lineHeight: 1.6, marginBottom: '4px' }}>
              • 재추첨은 하루 1회만 가능해요
            </p>
            <p style={{ fontSize: '13px', color: '#6B7684', lineHeight: 1.6, marginBottom: '16px' }}>
              • 두 번째 결과는 오늘의 최종 결과로 저장돼요
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleAdRetryCancel}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#F2F4F6',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#6B7684',
                  cursor: 'pointer',
                }}
              >
                취소
              </button>
              <button
                onClick={handleAdRetryConfirm}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: category.color,
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                광고 보기
              </button>
            </div>
          </div>
        )}

        {/* 광고 로딩/시청 중 */}
        {adFlowStep === 'loading' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '24px',
              background: '#F9FAFB',
              borderRadius: '16px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                border: `3px solid ${category.lightColor}`,
                borderTop: `3px solid ${category.color}`,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <p style={{ fontSize: '14px', color: '#6B7684', margin: 0, textAlign: 'center' }}>
              광고를 불러오는 중이에요...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
