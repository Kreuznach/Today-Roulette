import type { CategoryInfo } from '../data/categories';

interface CategoryCardProps {
  category: CategoryInfo;
  onClick: (key: CategoryInfo['key']) => void;
  disabled?: boolean;
}

export function CategoryCard({ category, onClick, disabled = false }: CategoryCardProps) {
  return (
    <button
      onClick={() => !disabled && onClick(category.key)}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        width: '100%',
        padding: '18px 20px',
        background: disabled ? '#F9FAFB' : '#FFFFFF',
        border: `1.5px solid ${disabled ? '#E5E8EB' : '#E5E8EB'}`,
        borderRadius: '16px',
        cursor: disabled ? 'default' : 'pointer',
        textAlign: 'left',
        transition: 'transform 0.1s, box-shadow 0.1s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        WebkitTapHighlightColor: 'transparent',
        opacity: disabled ? 0.6 : 1,
      }}
      onMouseDown={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)';
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
      onTouchStart={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)';
      }}
      onTouchEnd={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
    >
      {/* 아이콘 배경 */}
      <div
        style={{
          flexShrink: 0,
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: category.lightColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
        }}
      >
        {category.icon}
      </div>

      {/* 텍스트 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#191F28',
            marginBottom: '3px',
          }}
        >
          {category.label}
        </div>
        <div
          style={{
            fontSize: '13px',
            color: '#8B95A1',
            lineHeight: 1.4,
          }}
        >
          {category.description}
        </div>
      </div>

      {/* 화살표 */}
      <div
        style={{
          flexShrink: 0,
          color: category.color,
          fontSize: '18px',
          fontWeight: 300,
        }}
      >
        ›
      </div>
    </button>
  );
}
