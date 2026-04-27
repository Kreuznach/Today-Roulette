# 데이터 사전

## 카테고리 (CategoryInfo)

| 필드 | 타입 | 설명 |
|------|------|------|
| `key` | `RouletteCategoryKey` | 카테고리 식별자 |
| `label` | `string` | 표시 이름 |
| `description` | `string` | 한 줄 설명 |
| `color` | `string` | 기본 컬러 (hex) |
| `lightColor` | `string` | 밝은 컬러 (룰렛 교대 칸) |
| `icon` | `string` | 이모지 아이콘 |

### 카테고리 목록

| key | label | color |
|-----|-------|-------|
| `energy` | 에너지 | `#3182F6` |
| `spending` | 소비 | `#F04452` |
| `meal` | 식사 | `#F5A623` |
| `social` | 소셜 | `#00B493` |
| `mission` | 미션 | `#9B4FF4` |

---

## 결과 아이템 (RouletteResultItem)

| 필드 | 타입 | 설명 |
|------|------|------|
| `result_key` | `string` | 고유 결과 식별자 (`energy_01` 등) |
| `title` | `string` | 결과 제목 (6자 초과 시 룰렛에서 말줄임) |
| `summary_variants` | `string[]` | 요약 문구 변형 (최소 3개, 랜덤 선택) |
| `lucky_points` | `string[]` | 행운 포인트 목록 (랜덤 1개 선택) |
| `avoid_points` | `string[]` | 주의 포인트 목록 (랜덤 1개 선택) |
| `recommended_actions` | `string[]` | 추천 행동 목록 (랜덤 1개 선택) |

각 카테고리당 12개 = 총 **60개** 결과 아이템 (`src/features/roulette/data/results.ts`)

---

## 플레이 기록 (RoulettePlayRecord)

| 필드 | 타입 | 설명 |
|------|------|------|
| `date` | `string` | KST 날짜 `YYYY-MM-DD` |
| `category` | `RouletteCategoryKey` | 선택된 카테고리 |
| `categoryLabel` | `string` | 카테고리 표시 이름 |
| `firstResult` | `RouletteFinalResult \| null` | 1차 추첨 결과 |
| `finalResult` | `RouletteFinalResult \| null` | 최종 확정 결과 |
| `isFinalized` | `boolean` | 결과 확정 여부 |
| `usedAdRetry` | `boolean` | 광고 재추첨 사용 여부 |
| `createdAt` | `number` | 생성 타임스탬프 (UTC ms) |
| `finalizedAt` | `number \| undefined` | 확정 타임스탬프 |

---

## 최종 결과 (RouletteFinalResult)

추첨 시 `RouletteResultItem`의 variants 배열에서 랜덤 1개씩 선택하여 생성:

| 필드 | 타입 | 설명 |
|------|------|------|
| `result_key` | `string` | 원본 결과 키 |
| `title` | `string` | 결과 제목 |
| `summary` | `string` | 선택된 요약 문구 |
| `lucky_point` | `string` | 선택된 행운 포인트 |
| `avoid_point` | `string` | 선택된 주의 포인트 |
| `recommended_action` | `string` | 선택된 추천 행동 |

---

## localStorage 스키마

| 키 | 형식 | 설명 |
|----|------|------|
| `roulette_today_record` | `RoulettePlayRecord JSON` | 오늘의 플레이 기록 |
| `roulette_history` | `RoulettePlayRecord[] JSON` | 전체 히스토리 배열 |

- `roulette_today_record`는 매 로드 시 KST 날짜 비교 → 날짜 불일치 시 자동 삭제
- `roulette_history`는 확정 시 `appendToHistory()`로 추가, `loadRecentHistory(7)`로 조회

---

## 앱 단계 (AppPhase)

```typescript
type AppPhase =
  | 'idle'              // 오늘 아직 플레이 안 함
  | 'category_selected' // 카테고리만 선택됨
  | 'first_result'      // 1차 결과까지 받음
  | 'finalized';        // 최종 확정 완료
```
