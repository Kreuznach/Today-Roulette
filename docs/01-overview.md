# 오늘의 룰렛 — 프로젝트 개요

## 서비스 소개

**오늘의 룰렛**은 Apps in Toss WebView 기반 미니앱으로, 사용자가 매일 한 번 룰렛을 돌려 당일의 재미있는 참고 결과(에너지, 소비, 식사, 소셜, 미션 중 택1)를 받는 경험을 제공합니다.

## 핵심 가치

| 항목 | 내용 |
|------|------|
| **타깃** | Toss 앱 사용자 (전 연령, 특히 MZ 세대) |
| **플레이 주기** | 하루 1회 |
| **세션 길이** | 약 1~2분 |
| **재미 요소** | 룰렛 스핀 애니메이션, 광고 보고 재추첨, 기록 히스토리 |

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | React 18 + TypeScript |
| 빌드 도구 | Vite 5 |
| 라우팅 | React Router DOM v6 (HashRouter) |
| 상태 관리 | React hooks (useState, useEffect) |
| 영속성 | localStorage (KST 날짜 기반) |
| 광고 SDK | Apps in Toss AIT Bridge (+ Dev Mock) |
| 패키지 매니저 | pnpm |

## 디렉토리 구조

```
src/
├── main.tsx                    # 앱 진입점
├── App.tsx                     # 라우트 설정 (HashRouter)
├── index.css                   # 전역 스타일 / 디자인 토큰
├── vite-env.d.ts               # Vite 환경변수 타입
├── lib/
│   └── ads.ts                  # AIT SDK 추상화 + Dev Mock
├── features/roulette/
│   ├── types.ts                # 핵심 타입 정의
│   ├── data/
│   │   ├── categories.ts       # 5개 카테고리 메타데이터
│   │   └── results.ts          # 60개 결과 데이터 (카테고리 × 12)
│   ├── utils/
│   │   ├── random.ts           # 무작위 추첨, 회전각 계산
│   │   └── date.ts             # KST 날짜 유틸
│   ├── storage/
│   │   └── rouletteStorage.ts  # localStorage CRUD
│   ├── hooks/
│   │   ├── useRouletteGame.ts  # 게임 상태 중앙 관리 훅
│   │   └── useRewardAd.ts      # 광고 상태 관리 훅
│   └── components/
│       ├── CategoryCard.tsx
│       ├── RouletteWheel.tsx   # SVG 12칸 룰렛 + 스핀 애니메이션
│       ├── ResultCard.tsx
│       └── HistoryList.tsx
└── pages/
    ├── HomePage.tsx
    ├── CategoryPage.tsx
    ├── RoulettePage.tsx
    ├── ResultPage.tsx
    ├── FinalResultPage.tsx
    └── HistoryPage.tsx
```

## 화면 플로우

```
홈(/) → 카테고리 선택(/category) → 룰렛(/roulette) → 1차 결과(/result)
                                                              ↓              ↓
                                                    확정(/final)    광고 재추첨 → 최종(/final)
홈(/) ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
                ↕ (언제든 이동)
          기록(/history)
```
