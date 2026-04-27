import type { RoulettePlayRecord } from '../types';
import { CATEGORY_MAP } from '../data/categories';
import { formatDateKorean } from '../utils/date';

interface HistoryListProps {
  records: RoulettePlayRecord[];
  onSelectRecord?: (record: RoulettePlayRecord) => void;
}

export function HistoryList({ records, onSelectRecord }: HistoryListProps) {
  if (records.length === 0) {
    return (
      <div
        style={{
          padding: '48px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>📭</div>
        <div style={{ fontSize: '15px', color: '#8B95A1', lineHeight: 1.5 }}>
          아직 기록이 없어요.
          <br />
          첫 번째 룰렛을 돌려보세요!
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {records.map((record) => (
        <HistoryItem
          key={record.date}
          record={record}
          onClick={onSelectRecord ? () => onSelectRecord(record) : undefined}
        />
      ))}
    </div>
  );
}

interface HistoryItemProps {
  record: RoulettePlayRecord;
  onClick?: () => void;
}

function HistoryItem({ record, onClick }: HistoryItemProps) {
  const category = CATEGORY_MAP[record.category];
  const result = record.finalResult ?? record.firstResult;

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        width: '100%',
        padding: '14px 16px',
        background: '#FFFFFF',
        border: '1.5px solid #E5E8EB',
        borderRadius: '14px',
        cursor: onClick ? 'pointer' : 'default',
        textAlign: 'left',
        WebkitTapHighlightColor: 'transparent',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* 카테고리 아이콘 */}
      <div
        style={{
          flexShrink: 0,
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: category.lightColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
        }}
      >
        {category.icon}
      </div>

      {/* 정보 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '12px',
            color: '#8B95A1',
            marginBottom: '3px',
            letterSpacing: '-0.1px',
          }}
        >
          {formatDateKorean(record.date)} · {category.label}
        </div>
        <div
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#191F28',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {result?.title ?? '결과 없음'}
        </div>
      </div>

      {/* 상태 뱃지 */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
        {record.isFinalized && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: category.color,
              background: category.lightColor,
              padding: '2px 8px',
              borderRadius: '20px',
            }}
          >
            확정
          </span>
        )}
        {record.usedAdRetry && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 500,
              color: '#8B95A1',
              background: '#F2F4F6',
              padding: '2px 6px',
              borderRadius: '20px',
            }}
          >
            재추첨
          </span>
        )}
      </div>
    </button>
  );
}
