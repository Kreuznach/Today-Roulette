# 진행 상황 추적

## 현재 버전: v1.1.0 (MVP + 룰렛 UI 개선)

> 마지막 업데이트: 2026-04-27

---

## ✅ 완료된 작업

### 룰렛 UI 개선 (v1.1.0)
- [x] `RouletteWheel.tsx` — 세그먼트 텍스트 → 이모지 60종 교체 (`RESULT_EMOJIS` 룩업 맵)
- [x] `RouletteWheel.tsx` — 렌더 크기 300px → 340px (viewBox 0 0 300 300 유지, 자동 스케일)
- [x] `RouletteWheel.tsx` — `truncateTitle` 함수 제거 (불필요)

### 프로젝트 초기화
- [x] `package.json` — React 18, Vite 5, TypeScript, React Router DOM v6
- [x] `tsconfig.json` — strict 모드, `@/` 경로 별칭
- [x] `vite.config.ts` — 플러그인, 경로 별칭, 청크 분리 설정
- [x] `index.html` — viewport safe-area, 한국어 lang
- [x] `granite.config.ts` — Apps in Toss 앱 설정
- [x] `.env.example` — 환경변수 템플릿
- [x] `.gitignore` — node_modules, dist, .env.local 등
- [x] `.npmrc` — `shamefully-hoist=true` (Windows pnpm 호환성)

### 핵심 로직
- [x] `src/features/roulette/types.ts` — 핵심 타입 5종
- [x] `src/features/roulette/data/categories.ts` — 5개 카테고리
- [x] `src/features/roulette/data/results.ts` — 60개 결과 데이터
- [x] `src/features/roulette/utils/random.ts` — 무작위 추첨, 회전각 계산
- [x] `src/features/roulette/utils/date.ts` — KST 날짜 유틸
- [x] `src/features/roulette/storage/rouletteStorage.ts` — localStorage CRUD
- [x] `src/lib/ads.ts` — AIT SDK 추상화 + Dev Mock

### 훅
- [x] `src/features/roulette/hooks/useRouletteGame.ts` — 게임 상태 중앙 관리
- [x] `src/features/roulette/hooks/useRewardAd.ts` — 광고 상태 관리

### 컴포넌트
- [x] `src/features/roulette/components/CategoryCard.tsx`
- [x] `src/features/roulette/components/RouletteWheel.tsx` — SVG 12칸 룰렛
- [x] `src/features/roulette/components/ResultCard.tsx`
- [x] `src/features/roulette/components/HistoryList.tsx`

### 페이지
- [x] `src/pages/HomePage.tsx`
- [x] `src/pages/CategoryPage.tsx`
- [x] `src/pages/RoulettePage.tsx`
- [x] `src/pages/ResultPage.tsx`
- [x] `src/pages/FinalResultPage.tsx`
- [x] `src/pages/HistoryPage.tsx`

### 앱 엔트리
- [x] `src/main.tsx` — React 18 createRoot
- [x] `src/App.tsx` — HashRouter + Routes
- [x] `src/index.css` — 전역 스타일, 디자인 토큰, 공통 클래스
- [x] `src/vite-env.d.ts` — Vite 환경변수 타입

### 빌드 검증
- [x] TypeScript 타입 체크 통과 (`tsc --noEmit` 오류 없음)
- [x] Vite 프로덕션 빌드 성공
- [x] 출력물: `dist/` (총 gzip ~81KB)

### 문서
- [x] `docs/01-overview.md` — 프로젝트 개요
- [x] `docs/02-mvp-spec.md` — MVP 기능 명세
- [x] `docs/03-data-dictionary.md` — 데이터 사전
- [x] `docs/04-apps-in-toss-checklist.md` — 배포 체크리스트
- [x] `docs/05-ad-flow.md` — 광고 재추첨 플로우
- [x] `docs/06-future-supabase-schema.md` — v2 DB 스키마

---

## 📋 남은 작업 (v2)

### 기능 개선
- [ ] Supabase 연동 (크로스 디바이스 기록 동기화)
- [ ] 광고 완료 서버 검증 (Edge Function)
- [ ] 소셜 공유 실제 구현 (AIT Share API)
- [ ] 결과 즐겨찾기

### UX 개선
- [ ] 로딩 스켈레톤 UI
- [ ] 결과 화면 입장 애니메이션 강화
- [ ] 룰렛 휠 햅틱 피드백 (AIT Haptics API)

### 운영
- [ ] 에러 추적 (Sentry 등)
- [ ] 분석 이벤트 (AIT Analytics)
- [ ] A/B 테스트 결과 문구

---

## 빌드 결과 기록

| 날짜 | 버전 | 빌드 시간 | JS (gzip) | CSS (gzip) |
|------|------|-----------|-----------|-----------|
| 2026-04-27 | 1.0.0 | 4.77s | ~80KB | ~1KB |
| 2026-04-27 | 1.1.0 | 3.61s | ~81KB | ~1KB |
