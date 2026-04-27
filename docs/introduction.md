너는 Apps in Toss(WebView) 미니앱 개발에 익숙한 시니어 프론트엔드 엔지니어이자 제품 설계자다.

이번 프로젝트는 “오늘의 룰렛”이라는 Toss in App 미니앱을 초기 개발하는 것이다.
이 앱은 사용자가 하루에 한 번 카테고리를 선택하고 룰렛을 돌려 오늘의 결과를 받는 서비스다.

중요:
- 이 작업은 실제로 Apps in Toss 콘솔에 번들 업로드 및 검수 제출 가능한 수준의 MVP를 만드는 것이다.
- 기존에 업로드한 today-dice.ait 파일이 있다면, 이는 빌드 결과물 참고용으로만 보고 원본 코드처럼 취급하지 마라.
- 현재 작업 폴더에 기존 today-dice 또는 Toss in App 프로젝트 소스가 있다면 그 구조를 먼저 분석하고, 재사용 가능한 설정/패턴은 최대한 참고하라.
- 단, 무리하게 기존 코드를 복잡하게 이어붙이지 말고, 유지보수 쉬운 구조로 정리하라.
- 결과 사전 JSON은 내가 별도로 첨부/저장한 데이터를 사용한다. 해당 데이터는 docs 폴더의 result_example.json 파일을 참고하라.
- 결과 사전 구조는 아래 형태를 기준으로 한다.

{
  "오늘의 기세": [
    {
      "result_key": "runaway_train_mode",
      "title": "폭주 기관차 모드",
      "summary_variants": ["...", "...", "..."],
      "lucky_points": ["...", "...", "..."],
      "avoid_points": ["...", "...", "..."],
      "recommended_actions": ["...", "...", "..."]
    }
  ],
  "오늘의 소비": [],
  "오늘의 점심-저녁": [],
  "오늘의 사회생활": [],
  "오늘의 미션": []
}

목표:
- 하루 1회 무료 룰렛
- 사용자가 카테고리를 직접 선택
- 선택 가능한 카테고리:
  1. 오늘의 기세
  2. 오늘의 소비
  3. 오늘의 점심-저녁
  4. 오늘의 사회생활
  5. 오늘의 미션
- 각 카테고리에는 12개 대표 결과가 있음
- 룰렛 판은 12칸으로 표시
- 실제 결과 화면에서는 선택된 대표 결과 안에서 summary_variants / lucky_points / avoid_points / recommended_actions 중 각각 1개씩 랜덤 선택하여 출력
- 사용자가 결과가 마음에 들지 않으면 하루 1회 한정으로 광고 시청 후 다시 돌릴 수 있음
- 광고 후 재추첨 결과는 오늘의 최종 결과로 강제 확정
- 현금, 포인트, 쿠폰, 경품 등 재산상 이익은 전혀 없음
- 운세/점괘처럼 보이지 않게 “가벼운 오늘의 참고용 재미 콘텐츠” 톤으로 표현
- 결과 기록은 로컬 저장 우선, 필요 시 Supabase 확장 가능 구조
- MVP에서는 서버 없이도 동작 가능하게 만들되, 추후 Supabase 저장으로 확장하기 쉬운 구조를 유지

플랫폼/기술 조건:
- Apps in Toss WebView 미니앱
- SDK 2.x 기준
- 가능하면 create-ait-app 또는 기존 Apps in Toss WebView 프로젝트 구조에 맞춤
- TDS(Toss Design System)를 사용할 수 있는 구조로 구성
- 라이트 모드 기준
- Safe Area 침범 금지
- 앱 최초 진입 후 10초 이내 첫 화면 표시
- 광고는 사용자가 예상 가능한 순간에만 표시
- 광고는 룰렛 결과 화면에서 “오늘 결과 다시 정하기” 버튼을 누른 뒤에만 표시
- 광고는 사전 로드 후 표시하는 구조로 설계
- 광고 미지원/로드 실패 시에는 “광고를 불러오지 못했어요. 오늘은 기본 결과로 확정해 주세요.” 같은 안전한 폴백 제공
- 샌드박스에서 인앱 광고가 직접 테스트되지 않을 수 있으므로, 개발 환경에서는 mock 모드로 광고 플로우를 테스트할 수 있게 구성
- 번들 용량은 압축 해제 기준 100MB 이하를 목표로 하고, 이미지/사운드 대형 리소스는 넣지 않는다
- 외부 링크, iframe, 외부 서비스 이동은 사용하지 않는다

앱 이름 후보:
- 국문명: 오늘의 룰렛
- 영문 appName 후보: today-roulette
- 내부 prefix: roulette

먼저 현재 프로젝트 구조를 확인한 뒤, 아래 작업을 진행하라.

1. 프로젝트 구조 점검
- package.json, granite.config.ts, src/app 구조, 라우팅 구조를 확인
- Apps in Toss WebView 프로젝트로 정상 빌드 가능한 구조인지 확인
- 기존 today-dice 프로젝트에서 재사용 가능한 패턴이 있으면 정리
- 문제가 있으면 수정 계획을 먼저 제시

2. 데이터 사전 배치
다음 구조 중 하나를 선택해 결과 사전을 저장하라.
추천 구조:
- src/data/rouletteResults.ts
또는
- src/features/roulette/data/results.ts

데이터는 타입 안정성을 위해 TypeScript 상수로 export한다.
타입 예시:
- RouletteCategoryKey
- RouletteResultItem
- RouletteFinalResult
- RoulettePlayRecord

카테고리 key는 내부적으로 영문 snake_case를 사용한다.
예:
- energy
- spending
- meal
- social
- mission

화면 노출명은 한국어를 사용한다.
예:
- 오늘의 기세
- 오늘의 소비
- 오늘의 점심-저녁
- 오늘의 사회생활
- 오늘의 미션

3. MVP 화면 구성
아래 화면을 구현하라.

A. 홈 화면
- 앱 제목: 오늘의 룰렛
- 부제: 오늘 궁금한 주제를 고르고 룰렛을 돌려보세요
- 오늘 플레이 가능 여부 표시
- 이미 오늘 결과가 확정된 경우 “오늘의 결과 보기” 버튼 표시
- 아직 플레이 전이면 카테고리 선택 카드 표시

B. 카테고리 선택 화면 또는 섹션
- 5개 카테고리를 카드 형태로 표시
- 각 카테고리 설명:
  - 오늘의 기세: 오늘의 흐름과 에너지를 가볍게 확인
  - 오늘의 소비: 충동구매, 절약, 작은 사치 힌트
  - 오늘의 점심-저녁: 오늘 어울리는 식사 방향
  - 오늘의 사회생활: 말, 답장, 관계, 눈치 힌트
  - 오늘의 미션: 오늘 하나쯤 해볼 작은 행동
- 카테고리를 선택하면 오늘의 카테고리가 고정된다는 안내 표시

C. 룰렛 화면
- 선택한 카테고리의 12개 title을 12칸 룰렛으로 표시
- “룰렛 돌리기” 버튼
- 돌리는 애니메이션은 과하지 않게 2~3초 정도
- 결과 산출은 클라이언트에서 랜덤하게 수행하되, 하루 1회 제한을 로컬 저장으로 강제
- 추후 서버 판정으로 교체하기 쉬운 함수 구조로 분리

D. 결과 화면
- 카테고리명
- 대표 결과 title
- summary_variants 중 1개
- lucky_points 중 1개
- avoid_points 중 1개
- recommended_actions 중 1개
- 오늘 결과 확정 상태 표시
- 버튼:
  - “오늘 결과 확정하기”
  - “광고 보고 한 번 더 돌리기”
- 광고 재추첨은 하루 1회만 가능

E. 광고 후 재추첨 화면/흐름
- “오늘 결과 다시 정하기”
- “재추첨은 하루 1회만 가능해요”
- “두 번째 결과는 오늘의 최종 결과로 저장돼요”
- 광고 성공 시 같은 카테고리 내에서 다시 룰렛 실행
- 두 번째 결과는 자동으로 최종 확정
- 광고 실패 시 기존 결과 유지

F. 오늘의 최종 결과 화면
- 오늘 확정 결과 표시
- “내일 다시 돌릴 수 있어요” 안내
- “결과 저장 완료” 표시
- 선택 사항: 결과 공유용 카드 UI는 컴포넌트만 준비하고 실제 공유 기능은 MVP에서 제외

G. 내 기록 화면
- 최근 7일 결과를 로컬 저장 기준으로 표시
- 날짜, 카테고리, title만 간단히 표시
- 상세 클릭 시 해당 날짜의 결과 요약 표시
- MVP에서 복잡한 통계는 제외

4. 하루 1회 제한 설계
로컬 저장 기준으로 아래를 구현한다.
- KST 기준 오늘 날짜 계산
- 오늘 플레이 여부
- 오늘 선택한 카테고리
- 오늘 1차 결과
- 광고 재추첨 사용 여부
- 오늘 최종 결과
- 최근 7일 기록

localStorage key 예:
- roulette_today_record
- roulette_history
- roulette_app_state

주의:
- KST 날짜 기준으로 처리
- 사용자가 새로고침해도 오늘 결과 유지
- 광고 후 재추첨은 하루 1회만 허용
- 재추첨 후에는 결과 변경 불가

5. 광고 연동 구조
Apps in Toss 통합 광고 API를 사용할 수 있게 구조화하라.
단, 실제 adGroupId는 환경변수 또는 설정 상수로 관리하고, 코드에 하드코딩하지 않는다.

광고 구현 원칙:
- loadFullScreenAd / showFullScreenAd 기반 구조
- 광고 기능 지원 여부 확인
- 광고 사전 로드
- 광고 로드 실패 시 안전한 폴백
- 개발 환경에서는 mock ad mode 제공
- 광고 시청 완료 후에만 재추첨 실행
- 광고가 중간에 실패하거나 닫히면 기존 결과 유지

필요한 파일 예:
- src/lib/ads.ts
- src/features/roulette/hooks/useRewardAd.ts

UI 문구:
- “오늘 결과 다시 정하기”
- “광고 시청 후 같은 카테고리에서 한 번 더 돌릴 수 있어요”
- “두 번째 결과는 오늘의 최종 결과로 저장돼요”
- “광고를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.”

피해야 할 문구:
- 대박 찬스
- 운세 업그레이드
- 더 좋은 결과 받기
- 행운 강화
- 원하는 결과 뽑기

6. 데이터 타입/로직 분리
아래 로직은 컴포넌트 내부에 직접 넣지 말고 별도 파일로 분리한다.
- 카테고리 목록 생성
- 12칸 결과 목록 추출
- 대표 결과 랜덤 선택
- 세부 문구 랜덤 선택
- KST 날짜 계산
- 오늘 플레이 가능 여부 계산
- 로컬 저장/불러오기
- 광고 상태 관리

추천 파일 구조:
- src/features/roulette/types.ts
- src/features/roulette/data/results.ts
- src/features/roulette/utils/random.ts
- src/features/roulette/utils/date.ts
- src/features/roulette/storage/rouletteStorage.ts
- src/features/roulette/components/CategoryCard.tsx
- src/features/roulette/components/RouletteWheel.tsx
- src/features/roulette/components/ResultCard.tsx
- src/features/roulette/components/HistoryList.tsx
- src/features/roulette/hooks/useRouletteGame.ts
- src/lib/ads.ts

7. UI/디자인 방향
- 모바일 세로 화면 최적화
- 토스 인앱에 어울리게 깔끔하고 가벼운 카드 UI
- 배경은 과하게 화려하지 않게
- 룰렛은 12칸이 식별 가능해야 함
- 결과 카드는 스크린샷을 찍고 싶을 만큼 정돈된 구성이어야 함
- 카테고리별 색상은 너무 과하지 않게 구분
- Safe Area 고려
- 버튼은 누르면 어떤 행동이 이어질지 명확해야 함
- 첫 진입 시 바텀시트나 강제 모달을 띄우지 말 것

8. Apps in Toss 배포 준비
아래를 반드시 점검하라.
- granite.config.ts의 appName을 today-roulette 또는 실제 콘솔 appName으로 설정
- brand.displayName은 “오늘의 룰렛”
- brand.primaryColor 설정
- icon URL 또는 asset 설정
- permissions는 기본적으로 빈 배열
- web.commands.dev / web.commands.build 정상 설정
- outdir 설정 확인
- npm run build 또는 pnpm build 가능해야 함
- ait 번들 생성 흐름 점검
- 번들 용량 100MB 이하 유지
- QR 테스트/샌드박스 테스트 고려
- 실제 라이브 환경에서는 https만 사용된다는 점 고려
- CORS가 필요한 외부 API는 사용하지 않음

9. Supabase 확장 가능성
MVP는 localStorage 기반으로 만들되, 추후 Supabase로 확장할 수 있도록 아래 설계 문서를 docs에 작성하라.
테이블명은 roulette_ 접두사를 사용한다.

예상 테이블:
- roulette_users
- roulette_daily_results
- roulette_categories
- roulette_result_dictionary
- roulette_ad_retry_logs

각 테이블에 대해:
- 역할
- 주요 컬럼
- RLS 고려사항
- MVP에서 당장 만들지 않는 이유
를 정리하라.

10. 문서 생성
아래 문서를 생성하라.
- docs/01-overview.md
- docs/02-mvp-spec.md
- docs/03-data-dictionary.md
- docs/04-apps-in-toss-checklist.md
- docs/05-ad-flow.md
- docs/06-future-supabase-schema.md

각 문서에는 실제 개발자가 이어받아도 이해할 수 있도록 구체적으로 작성한다.

11. 구현 범위
이번 1차 작업에서 구현할 것:
- 결과 사전 TypeScript화
- 카테고리 선택
- 룰렛 실행
- 결과 카드 출력
- 하루 1회 제한
- 광고 재추첨 mock flow
- 최근 7일 기록
- Apps in Toss 설정 점검
- 문서 작성

이번 1차 작업에서 제외할 것:
- 실제 Supabase 저장
- 실제 서버 판정
- 실제 공유 기능
- 푸시/스마트 메시지
- 리더보드
- 사용자 로그인
- 과한 애니메이션
- 사운드/햅틱

12. 작업 방식
작업 전에 먼저 현재 프로젝트 구조를 요약하라.
그 다음 아래 순서로 진행하라.

1. 현재 구조 분석
2. 필요한 파일/폴더 생성 계획 제시
3. 결과 사전 데이터 정리
4. 타입 정의
5. 룰렛 로직 구현
6. localStorage 기반 하루 1회 제한 구현
7. 화면 컴포넌트 구현
8. 광고 mock 및 Apps in Toss 광고 연동 준비
9. 빌드 확인
10. 문서 생성
11. 남은 TODO 정리

13. 품질 기준
- TypeScript 타입 오류 없어야 함
- 빌드가 성공해야 함
- 모바일 화면에서 기본 사용성이 좋아야 함
- 결과가 새로고침 후에도 유지되어야 함
- 오늘 1회 제한이 명확히 적용되어야 함
- 광고 재추첨은 하루 1회만 가능해야 함
- 광고 실패 시 기존 결과가 유지되어야 함
- 문구가 운세/점괘/사행성처럼 보이지 않아야 함

마지막으로, 구현 완료 후 아래를 보고하라.
- 수정/생성한 파일 목록
- 실행 방법
- Apps in Toss 테스트 방법
- 아직 실제 콘솔에서 입력해야 할 값
- 광고 그룹 ID를 넣어야 하는 위치
- Supabase를 붙일 경우 다음 작업