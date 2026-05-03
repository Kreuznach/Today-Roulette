# AIT 빌드 가이드

> Apps in Toss WebView 미니앱 배포용 `.ait` 아티팩트 빌드 방법

---

## 사전 요구사항

| 항목 | 버전 |
|------|------|
| Node.js | 18 이상 |
| @apps-in-toss/web-framework | **2.0.0 이상** (현재: 2.4.7) |

의존성 설치:
```bash
npm install
```

---

## 일반 웹 빌드 (개발/미리보기)

```bash
npm run build
```
- TypeScript 타입 체크 → Vite 프로덕션 빌드 순으로 실행
- 출력: `dist/` 폴더

---

## AIT 빌드 (.ait 아티팩트)

```bash
npm run build:ait
```

내부적으로 다음 순서로 동작합니다:
1. `vite build` — Vite 프로덕션 번들 생성 (`dist/`)
2. RN 0.84.0 빌드
3. RN 0.72.6 빌드 (하위 호환)
4. `.ait` 패키지 생성

성공 시 프로젝트 루트에 **`today-roulette.ait`** 파일이 생성됩니다.

### 출력 예시

```
◇  [1/2] Built for RN 0.84.0
◇  [2/2] Built for RN 0.72.6
◇  Creating .ait artifact...
◆  AIT build completed (today-roulette.ait)
●  deploymentId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## 광고 환경 설정

`VITE_AD_ENV` 환경변수로 광고 동작을 제어합니다:

| 값 | 동작 |
|----|------|
| `test` | AIT 공식 테스트 광고 ID 사용 |
| `production` | 프로덕션 광고 ID 강제 사용 |
| 미설정 | DEV 빌드 → Mock, 프로덕션 빌드 → 실제 광고 |

프로덕션 AIT 빌드:
```bash
# 프로덕션 광고 ID를 명시적으로 지정하여 빌드
VITE_AD_ENV=production npm run build:ait
```

프로덕션 광고 ID: `ait.v2.live.e5638822a9304075`

---

## 배포

빌드 완료된 `.ait` 파일을 AIT CLI로 배포합니다:

```bash
# API 키 등록 (최초 1회)
node_modules/@apps-in-toss/web-framework/ait.js token add

# 배포
node_modules/@apps-in-toss/web-framework/ait.js deploy
```

또는 `ait.ps1`을 직접 실행:
```powershell
.\node_modules\.bin\ait.ps1 deploy
```

---

## 설정 파일

`granite.config.ts`에서 앱 메타정보를 관리합니다:

| 필드 | 설명 | 현재 값 |
|------|------|---------|
| `appName` | AIT 콘솔 앱 ID | `today-roulette` |
| `brand.displayName` | 노출명 | `오늘의 룰렛` |
| `brand.icon` | 심사용 아이콘 URL | placeholder (배포 전 교체 필요) |
| `brand.primaryColor` | 브랜드 컬러 | `#3182F6` |
| `web.port` | 로컬 개발 서버 포트 | `3000` |
| `navigationBar.withBackButton` | 네비게이션 뒤로가기 버튼 | `false` |

> **주의**: `brand.icon`은 심사 제출 전 Toss 파트너 콘솔에서 업로드한 실제 URL로 교체해야 합니다.

---

## 주의사항

- `.ait` 파일은 `.gitignore`에 의해 저장소에서 제외됩니다 (용량 큰 바이너리)
- `build:ait` 스크립트는 내부에서 `vite build`를 자동으로 호출하므로 사전 빌드 불필요
- Windows에서 `npm run build:ait`로 실행 시 Node.js 경고(`DEP0190`)는 무시해도 됩니다
