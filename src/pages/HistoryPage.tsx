import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRouletteGame } from '@/features/roulette/hooks/useRouletteGame';
import { HistoryList } from '@/features/roulette/components/HistoryList';
import { ResultCard } from '@/features/roulette/components/ResultCard';
import type { RoulettePlayRecord } from '@/features/roulette/types';
import { formatDateKorean } from '@/features/roulette/utils/date';

export function HistoryPage() {
  const navigate = useNavigate();
  const { history } = useRouletteGame();
  const [selectedRecord, setSelectedRecord] = useState<RoulettePlayRecord | null>(null);

  const handleSelectRecord = (record: RoulettePlayRecord) => {
    setSelectedRecord(record);
  };

  const handleCloseDetail = () => {
    setSelectedRecord(null);
  };

  return (
    <div className="page-container">
      <div className="page-content">
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px',
              color: '#6B7684',
            }}
          >
            ←
          </button>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#191F28',
              letterSpacing: '-0.4px',
              margin: 0,
            }}
          >
            내 기록
          </h2>
        </div>

        {/* 기간 안내 */}
        <p style={{ fontSize: '13px', color: '#8B95A1', marginBottom: '16px' }}>
          최근 7일 기록을 보여드려요
        </p>

        {/* 기록 목록 */}
        <HistoryList records={history} onSelectRecord={handleSelectRecord} />

        {/* 상세 모달 */}
        {selectedRecord && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(25, 31, 40, 0.6)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'flex-end',
              padding: '0',
            }}
            onClick={handleCloseDetail}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '430px',
                margin: '0 auto',
                background: '#FFFFFF',
                borderRadius: '20px 20px 0 0',
                padding: '0 0 env(safe-area-inset-bottom, 24px)',
                maxHeight: '85vh',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 모달 핸들 */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
                <div
                  style={{
                    width: '36px',
                    height: '4px',
                    background: '#E5E8EB',
                    borderRadius: '2px',
                  }}
                />
              </div>

              {/* 모달 헤더 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px 12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', color: '#8B95A1', marginBottom: '2px' }}>
                    {formatDateKorean(selectedRecord.date)}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#191F28' }}>
                    {selectedRecord.categoryLabel}
                  </div>
                </div>
                <button
                  onClick={handleCloseDetail}
                  style={{
                    background: '#F2F4F6',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#6B7684',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* 결과 카드 */}
              <div style={{ padding: '0 20px 24px' }}>
                {(selectedRecord.finalResult ?? selectedRecord.firstResult) && (
                  <ResultCard
                    categoryKey={selectedRecord.category}
                    result={selectedRecord.finalResult ?? selectedRecord.firstResult!}
                    isFinalized={selectedRecord.isFinalized}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
