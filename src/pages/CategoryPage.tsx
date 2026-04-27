import { useNavigate, useLocation } from 'react-router-dom';
import { useRouletteGame } from '@/features/roulette/hooks/useRouletteGame';
import { CATEGORY_MAP, CATEGORIES } from '@/features/roulette/data/categories';
import type { RouletteCategoryKey } from '@/features/roulette/types';

export function CategoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectCategory, todayRecord } = useRouletteGame();

  // 홈에서 넘어온 선택 키
  const preselectedKey = (location.state as { selectedKey?: RouletteCategoryKey } | null)
    ?.selectedKey;

  const catInfo = preselectedKey ? CATEGORY_MAP[preselectedKey] : null;

  // 이미 오늘 카테고리를 선택했으면 룰렛 화면으로 이동
  if (todayRecord?.category) {
    navigate('/roulette', { replace: true });
    return null;
  }

  const handleConfirm = () => {
    if (!preselectedKey) return;
    selectCategory(preselectedKey);
    navigate('/roulette');
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (!catInfo) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <div className="page-container">
      <div className="page-content">
        {/* 뒤로가기 */}
        <button
          onClick={handleCancel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            fontSize: '15px',
            color: '#6B7684',
            cursor: 'pointer',
            padding: '0',
            marginBottom: '32px',
          }}
        >
          ← 뒤로
        </button>

        {/* 카테고리 정보 */}
        <div
          style={{
            background: catInfo.lightColor,
            borderRadius: '20px',
            padding: '32px 24px',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>{catInfo.icon}</div>
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#191F28',
              marginBottom: '8px',
              letterSpacing: '-0.5px',
            }}
          >
            {catInfo.label}
          </h2>
          <p style={{ fontSize: '15px', color: '#6B7684', lineHeight: 1.5, margin: 0 }}>
            {catInfo.description}
          </p>
        </div>

        {/* 안내 메시지 */}
        <div className="card" style={{ padding: '20px', marginBottom: '28px' }}>
          <div style={{ fontSize: '15px', color: '#3D4046', lineHeight: 1.65 }}>
            <strong style={{ color: catInfo.color }}>{catInfo.label}</strong>로 오늘 룰렛을
            시작할게요.
          </div>
          <div style={{ fontSize: '13px', color: '#8B95A1', marginTop: '8px', lineHeight: 1.5 }}>
            ⚠️ 카테고리를 선택하면 오늘 하루 동안 고정돼요.
            <br />
            12개 결과 중 하나가 무작위로 선택됩니다.
          </div>
        </div>

        {/* 전체 카테고리 목록 */}
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '13px', color: '#8B95A1', marginBottom: '12px' }}>
            다른 카테고리로 바꾸려면 아래를 선택하세요
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CATEGORIES.filter((c) => c.key !== preselectedKey).map((cat) => (
              <button
                key={cat.key}
                onClick={() =>
                  navigate('/category', {
                    state: { selectedKey: cat.key },
                    replace: true,
                  })
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: '#F9FAFB',
                  border: '1.5px solid #E5E8EB',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                <span style={{ fontSize: '14px', color: '#6B7684', fontWeight: 500 }}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 확인 버튼 */}
        <button
          className="btn-primary"
          onClick={handleConfirm}
          style={{ background: catInfo.color, boxShadow: `0 4px 12px ${catInfo.color}40` }}
        >
          {catInfo.label}로 룰렛 시작하기
        </button>
      </div>
    </div>
  );
}
