# Apps in Toss 배포 체크리스트

## granite.config.ts 설정

```typescript
export default defineConfig({
  appName: 'today-roulette',
  brand: {
    displayName: '오늘의 룰렛',
    primaryColor: '#3182F6',
  },
  web: {
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
    outdir: 'dist',
  },
  permissions: [],
});
```

## 배포 전 체크리스트

### 필수 환경변수

| 변수 | 설명 | 예시 |
|------|------|------|
| `VITE_AD_GROUP_ID` | AIT 광고 그룹 ID | `ait_group_xxxxx` |
| `VITE_AD_MOCK` | 개발 중 광고 Mock 모드 | `true` |

> `.env.example` 참조. 실제 값은 `.env.local`에 저장 (git 미포함)

### AIT SDK 연동 확인

- [ ] `window.__AIT_BRIDGE__` 존재 여부 확인 (`isAdSupported()` 함수 참조)
- [ ] `loadFullScreenAd({ adGroupId })` 호출 테스트
- [ ] `showFullScreenAd({ adGroupId })` — result: `'completed' | 'dismissed'` 처리

### WebView 호환성

- [ ] `HashRouter` 사용 (`BrowserRouter` 대신) — WebView history API 제한 대응
- [ ] `viewport` meta — `width=device-width, initial-scale=1, viewport-fit=cover`
- [ ] `safe-area-inset-*` CSS env 변수 적용 확인
- [ ] `overscroll-behavior: none` — 당겨서 새로고침 방지

### 빌드 확인

- [ ] `pnpm run build` 오류 없음
- [ ] `dist/` 폴더 생성 확인
- [ ] JS 총 gzip 크기 < 300KB 권장

### 기능 검증

- [ ] 당일 1회 제한 동작 (KST 자정 기준)
- [ ] 카테고리 선택 → 룰렛 스핀 → 결과 흐름
- [ ] 광고 재추첨 플로우 (mock 모드로 테스트)
- [ ] 광고 dismissed 시 원래 결과 유지 확인
- [ ] 히스토리 기록 7일 조회
- [ ] localStorage 날짜 만료 처리

## 빌드 명령어

```bash
# 개발 서버
pnpm dev

# 타입 체크만
pnpm run typecheck

# 프로덕션 빌드
pnpm run build

# 빌드 미리보기
pnpm run preview
```
