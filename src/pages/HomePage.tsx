import { useNavigate } from 'react-router-dom';
import { useRouletteGame } from '@/features/roulette/hooks/useRouletteGame';
import { CategoryCard } from '@/features/roulette/components/CategoryCard';
import { CATEGORIES } from '@/features/roulette/data/categories';
import type { RouletteCategoryKey } from '@/features/roulette/types';

export function HomePage() {
  const navigate = useNavigate();
  const { todayRecord, isFinalized, hasSelectedCategory, hasFirstResult } = useRouletteGame();

  const handleCategorySelect = (key: RouletteCategoryKey) => {
    // 카테고리 선택 확인은 CategoryPage에서 처리
    navigate('/category', { state: { selectedKey: key } });
  };

  // 오늘 최종 결과가 있을 때
  if (isFinalized && todayRecord) {
    return (
      <div className="page-container">
        <div className="page-content">
          {/* 헤더 */}
          <div style={{ marginBottom: '32px' }}>
            <h1 className="app-title">오늘의 룰렛</h1>
            <p className="app-subtitle">오늘 결과가 확정됐어요</p>
          </div>

          {/* 확정 카드 */}
          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>
              {CATEGORIES.find((c) => c.key === todayRecord.category)?.icon}
            </div>
            <div style={{ fontSize: '13px', color: '#8B95A1', marginBottom: '6px' }}>
              {todayRecord.categoryLabel}
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#191F28',
                marginBottom: '24px',
                letterSpacing: '-0.4px',
              }}
            >
              {todayRecord.finalResult?.title}
            </div>
            <p style={{ fontSize: '14px', color: '#6B7684', lineHeight: 1.6, marginBottom: '24px' }}>
              내일 다시 돌릴 수 있어요 😊
            </p>
            <button className="btn-primary" onClick={() => navigate('/final')}>
              오늘의 결과 보기
            </button>
          </div>

          {/* 기록 보기 */}
          <button
            className="btn-ghost"
            onClick={() => navigate('/history')}
            style={{ marginTop: '16px', width: '100%' }}
          >
            내 기록 보기
          </button>
        </div>
      </div>
    );
  }

  // 카테고리 선택 후 룰렛 미실행 상태
  if (hasSelectedCategory && todayRecord) {
    const catInfo = CATEGORIES.find((c) => c.key === todayRecord.category);
    return (
      <div className="page-container">
        <div className="page-content">
          <div style={{ marginBottom: '32px' }}>
            <h1 className="app-title">오늘의 룰렛</h1>
            <p className="app-subtitle">카테고리가 선택됐어요</p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '32px 24px', marginBottom: '16px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>{catInfo?.icon}</div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#191F28', marginBottom: '8px' }}>
              {catInfo?.label}
            </div>
            <p style={{ fontSize: '14px', color: '#6B7684', marginBottom: '24px' }}>
              룰렛을 돌릴 준비가 됐어요!
            </p>
            <button
              className="btn-primary"
              onClick={() => navigate('/roulette')}
              style={{ background: catInfo?.color }}
            >
              룰렛 돌리기
            </button>
          </div>

          <button
            className="btn-ghost"
            onClick={() => navigate('/history')}
            style={{ width: '100%' }}
          >
            내 기록 보기
          </button>
        </div>
      </div>
    );
  }

  // 1차 결과가 있는데 미확정 상태
  if (hasFirstResult && todayRecord) {
    return (
      <div className="page-container">
        <div className="page-content">
          <div style={{ marginBottom: '32px' }}>
            <h1 className="app-title">오늘의 룰렛</h1>
            <p className="app-subtitle">결과를 확인해보세요</p>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '32px 24px', marginBottom: '16px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#191F28', marginBottom: '24px' }}>
              오늘의 결과가 나왔어요
            </div>
            <button className="btn-primary" onClick={() => navigate('/result')}>
              결과 보기
            </button>
          </div>
          <button
            className="btn-ghost"
            onClick={() => navigate('/history')}
            style={{ width: '100%' }}
          >
            내 기록 보기
          </button>
        </div>
      </div>
    );
  }

  // 오늘 플레이 전 → 카테고리 선택
  return (
    <div className="page-container">
      <div className="page-content">
        {/* 헤더 */}
        <div style={{ marginBottom: '28px' }}>
          <h1 className="app-title">오늘의 룰렛</h1>
          <p className="app-subtitle">오늘 궁금한 주제를 고르고 룰렛을 돌려보세요</p>
        </div>

        {/* 안내 */}
        <div
          style={{
            background: '#F2F7FF',
            border: '1px solid #CADDFF',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '20px',
          }}
        >
          <p style={{ fontSize: '13px', color: '#3182F6', margin: 0, lineHeight: 1.5 }}>
            💡 카테고리를 선택하면 오늘의 주제가 고정돼요.
            <br />
            하루에 한 번만 돌릴 수 있어요.
          </p>
        </div>

        {/* 카테고리 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.key} category={cat} onClick={handleCategorySelect} />
          ))}
        </div>

        {/* 기록 보기 */}
        <button
          className="btn-ghost"
          onClick={() => navigate('/history')}
          style={{ width: '100%' }}
        >
          내 기록 보기
        </button>
      </div>
    </div>
  );
}
