/**
 * granite.config.ts
 * Apps in Toss WebView 미니앱 설정 파일 (@apps-in-toss/web-framework v2.x)
 *
 * [심사 제출 전 확인 사항]
 * - brand.icon: Toss 파트너 콘솔에서 심사용 아이콘을 업로드하고 발급된 URL로 교체 필요
 * - brand.primaryColor: 디자인 확정 후 변경 가능
 */
import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'today-roulette',

  brand: {
    displayName: '오늘의 룰렛',
    // NOTE: 심사 제출 전 Toss 파트너 콘솔에서 발급된 실제 아이콘 URL로 교체
    icon: 'https://placehold.co/96x96/3182F6/ffffff.png?text=🎯',
    primaryColor: '#3182F6',
  },

  web: {
    host: 'localhost',
    port: 3000,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },

  outdir: 'dist',

  permissions: [],

  // 앱 내 뒤로가기 버튼으로 히스토리 백 / 앱 종료를 처리
  navigationBar: {
    withBackButton: false,
  },
});
