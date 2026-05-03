# 광고 재추첨 플로우

## 개요

사용자는 1차 룰렛 결과를 받은 후, 광고를 시청하면 같은 카테고리 내에서 한 번 더 추첨할 기회를 얻습니다. 재추첨 기회는 하루 1회로 제한됩니다.

## 상태 다이어그램

```
[1차 결과 화면 /result]
        │
        ├─── "오늘 결과 확정" ──────────────────→ [최종 결과 /final]
        │
        └─── "광고 보고 한 번 더" (canRetry=true)
                │
                ↓
         [확인 다이얼로그 표시]
                │
         ┌──────┴──────┐
         │ 취소          │ 광고 보기
         ↓              ↓
     [원래 결과 유지]  startAd()  ← watchAd() 내부: load → show
                        │
                  ┌─────┴─────┐
                  │ false       │ true (보상 획득)
                  ↓            ↓
            [에러 메시지]   spinRetry()
                  │
             saveRetryResult()
                  │
                  ↓
          [최종 결과 /final]
          (usedAdRetry=true 뱃지)
```

## 코드 구현

### `src/lib/ads.ts` — AIT Bridge 추상화

```typescript
// AIT 환경: load → show 두 단계 순차 실행
// 비 AIT 환경 (개발/브라우저): 1.5초 Mock 후 true 반환
export async function watchAd(): Promise<boolean>  // 광고 시청 후 보상 획득 여부
```

### `src/features/roulette/hooks/useRewardAd.ts` — 훅

```typescript
const { adState, errorMessage, prepareAd, triggerAd, reset } = useRewardAd()
// adState: 'idle' | 'loading' | 'ready' | 'showing' | 'done' | 'error'
```

### `src/features/roulette/hooks/useRouletteGame.ts` — 게임 훅

```typescript
canRetry       // boolean: 오늘 재추첨 가능 여부
spinRetry()    // () => RouletteFinalResult | null — 재추첨 실행
saveRetryResult(result) // 재추첨 결과 저장
```

## 환경별 동작

| 환경 | `loadAd()` | `showAd()` |
|------|-----------|-----------|
| DEV (VITE_AD_MOCK=true) | 600ms 후 `true` 반환 | 2000ms 후 `'completed'` 반환 |
| Production | `window.__AIT_BRIDGE__.ads.loadFullScreenAd()` 호출 | `window.__AIT_BRIDGE__.ads.showFullScreenAd()` 호출 |

## 보안 고려사항

- `adGroupId`는 환경변수(`VITE_AD_GROUP_ID`)로 관리, 하드코딩 금지
- 광고 완료 여부는 클라이언트 로컬에서 검증 (MVP 기준)
- 서버 검증이 필요한 경우 v2에서 Supabase Edge Function으로 구현 예정
