# v2 Supabase 연동 계획

## 배경

MVP는 localStorage만 사용하므로 디바이스 변경 시 기록이 유실됩니다. v2에서는 Supabase를 통해 서버 저장 및 크로스 디바이스 동기화를 지원합니다.

## 예상 스키마

### users 테이블

```sql
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  toss_user_id TEXT UNIQUE NOT NULL,  -- AIT에서 제공하는 사용자 식별자
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### roulette_records 테이블

```sql
CREATE TABLE roulette_records (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  play_date         DATE NOT NULL,                    -- KST 날짜 (YYYY-MM-DD)
  category          TEXT NOT NULL,                    -- RouletteCategoryKey
  category_label    TEXT NOT NULL,
  first_result_key  TEXT,
  first_result_json JSONB,                            -- RouletteFinalResult
  final_result_key  TEXT,
  final_result_json JSONB,
  is_finalized      BOOLEAN NOT NULL DEFAULT false,
  used_ad_retry     BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT now(),
  finalized_at      TIMESTAMPTZ,

  UNIQUE (user_id, play_date)                         -- 하루 1회 강제
);

CREATE INDEX ON roulette_records (user_id, play_date DESC);
```

### ad_verifications 테이블 (광고 서버 검증용)

```sql
CREATE TABLE ad_verifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id    UUID REFERENCES roulette_records(id),
  ad_group_id  TEXT NOT NULL,
  verified_at  TIMESTAMPTZ DEFAULT now(),
  ait_callback JSONB                                  -- AIT 콜백 페이로드
);
```

## v2 마이그레이션 전략

1. `rouletteStorage.ts` → Supabase 클라이언트로 교체 (인터페이스 동일 유지)
2. 오프라인 우선: localStorage를 캐시로 유지 → 온라인 시 Supabase 동기화
3. 광고 완료 검증: AIT 콜백 → Supabase Edge Function → `ad_verifications` 저장

## 예상 API 인터페이스 (v2)

```typescript
// 현재 MVP (localStorage)
import { loadTodayRecord, saveTodayRecord } from '@/features/roulette/storage/rouletteStorage'

// v2 (Supabase — 동일 인터페이스)
import { loadTodayRecord, saveTodayRecord } from '@/features/roulette/storage/supabaseStorage'
```

인터페이스를 동일하게 유지하므로 훅/페이지 코드 변경 없이 스토리지 레이어만 교체 가능.
