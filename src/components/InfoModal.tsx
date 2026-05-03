import { useEffect } from 'react';
import appInfo from '@/data/appInfo.json';

interface InfoModalProps {
  onClose: () => void;
}

export function InfoModal({ onClose }: InfoModalProps) {
  // 배경 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '0',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px 20px 0 0',
          width: '100%',
          maxWidth: '430px',
          maxHeight: '80dvh',
          overflowY: 'auto',
          padding: '28px 24px 40px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 */}
        <div
          style={{
            width: '36px',
            height: '4px',
            background: '#E5E8EB',
            borderRadius: '2px',
            margin: '0 auto 24px',
          }}
        />

        {/* 앱 아이콘 + 이름 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: '#EBF3FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              flexShrink: 0,
            }}
          >
            🎯
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#191F28', letterSpacing: '-0.3px' }}>
              {appInfo.appName}
            </div>
            <div style={{ fontSize: '13px', color: '#8B95A1', marginTop: '2px' }}>
              최근 업데이트: {appInfo.lastUpdate}
            </div>
          </div>
        </div>

        {/* 설명 */}
        <p
          style={{
            fontSize: '14px',
            color: '#4E5968',
            lineHeight: 1.7,
            marginBottom: '24px',
          }}
        >
          {appInfo.description}
        </p>

        {/* 구분선 */}
        <hr style={{ border: 'none', borderTop: '1px solid #F2F4F6', marginBottom: '20px' }} />

        {/* 업데이트 내역 */}
        <div>
          <p
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#8B95A1',
              letterSpacing: '0.3px',
              marginBottom: '14px',
              textTransform: 'uppercase',
            }}
          >
            업데이트 내역
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {appInfo.changelog.map((entry, i) => (
              <div key={i}>
                <div
                  style={{
                    display: 'inline-block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#3182F6',
                    background: '#EBF3FF',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    marginBottom: '8px',
                  }}
                >
                  {entry.date}
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {entry.items.map((item, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: '14px',
                        color: '#4E5968',
                        lineHeight: 1.6,
                        paddingLeft: '14px',
                        position: 'relative',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: '2px',
                          top: '10px',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: '#B0B8C1',
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 닫기 버튼 */}
        <button
          className="btn-ghost"
          onClick={onClose}
          style={{ width: '100%', marginTop: '24px' }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
