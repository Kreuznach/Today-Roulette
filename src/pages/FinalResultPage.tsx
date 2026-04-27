import { useNavigate } from 'react-router-dom';
import { useRouletteGame } from '@/features/roulette/hooks/useRouletteGame';
import { ResultCard } from '@/features/roulette/components/ResultCard';
import { formatDateKorean } from '@/features/roulette/utils/date';

export function FinalResultPage() {
  const navigate = useNavigate();
  const { todayRecord } = useRouletteGame();

  if (!todayRecord?.finalResult || !todayRecord.isFinalized) {
    navigate('/', { replace: true });
    return null;
  }

  const finalResult = todayRecord.finalResult;

  return (
    <div className="page-container">
      <div className="page-content">
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          {/* 완료 뱃지 */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#E6F9F5',
              padding: '6px 14px',
              borderRadius: '20px',
              marginBottom: '14px',
            }}
          >
            <span style={{ fontSize: '14px' }}>✅</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#00B493' }}>
              결과 저장 완료
            </span>
          </div>

          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#191F28',
              letterSpacing: '-0.4px',
              marginBottom: '6px',
            }}
          >
            오늘의 최종 결과
          </h2>
          <p style={{ fontSize: '13px', color: '#8B95A1', margin: 0 }}>
            {formatDateKorean(todayRecord.date)}
          </p>
        </div>

        {/* 재추첨 표시 */}
        {todayRecord.usedAdRetry && (
          <div
            style={{
              background: '#F3EAFF',
              border: '1px solid #D9C1FF',
              borderRadius: '12px',
              padding: '10px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '14px' }}>🔄</span>
            <p style={{ fontSize: '13px', color: '#9B4FF4', margin: 0 }}>
              재추첨된 결과예요
            </p>
          </div>
        )}

        {/* 결과 카드 */}
        <div style={{ marginBottom: '24px' }}>
          <ResultCard
            categoryKey={todayRecord.category}
            result={finalResult}
            isFinalized={true}
          />
        </div>

        {/* 내일 안내 */}
        <div
          style={{
            background: '#F9FAFB',
            border: '1px solid #E5E8EB',
            borderRadius: '14px',
            padding: '16px 20px',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          <p style={{ fontSize: '14px', color: '#6B7684', margin: 0, lineHeight: 1.6 }}>
            오늘은 여기까지예요 😊
            <br />
            <strong style={{ color: '#3182F6' }}>내일 자정 이후</strong>에 다시 돌릴 수 있어요.
          </p>
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="btn-ghost" onClick={() => navigate('/history')} style={{ width: '100%' }}>
            내 기록 보기
          </button>
          <button className="btn-ghost" onClick={() => navigate('/')} style={{ width: '100%' }}>
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
