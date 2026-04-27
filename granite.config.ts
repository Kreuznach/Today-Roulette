/**
 * granite.config.ts
 * Apps in Toss WebView 미니앱 설정 파일
 *
 * 실제 콘솔 배포 전 아래 항목을 확인하세요:
 * - appName: AIT 콘솔에 등록된 appName과 동일해야 합니다
 * - brand.displayName: 앱 노출명 (한국어)
 * - brand.primaryColor: 브랜드 컬러 (hex)
 * - permissions: 필요한 권한 목록 (현재 없음)
 */

interface GraniteWebConfig {
  appName: string;
  brand: {
    displayName: string;
    primaryColor: string;
    iconUrl?: string;
  };
  web: {
    commands: {
      dev: string;
      build: string;
    };
    outdir: string;
  };
  permissions: string[];
}

const config: GraniteWebConfig = {
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
};

export default config;
