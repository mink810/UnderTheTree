/**
 * 전역 컬러 팔레트 (Design Tokens)
 * 
 * 나중에 메인 테마 색상이 확정되면 primary 값 등을 여기서 변경하면
 * 앱 전체 화면에 즉시 일괄 적용됩니다.
 */
export const COLORS = {
  // 메인 포인트 컬러
  primary: '#E47778',
  primaryDark: '#D87575',
  primaryLight: '#FFF0EF',
  primaryLighter: '#FFF7F5',

  // 배경 및 카드(Surface)
  background: '#FFFDFC',
  surface: '#FFFFFF',
  surfaceMuted: '#F7F4F3',
  surfaceAlt: '#F5F2F1',
  surfaceGray: '#F1ECEB',

  // 텍스트 컬러
  text: '#292323',
  textSecondary: '#555555',
  textMuted: '#888888',
  textSubtle: '#999999',
  textPlaceholder: '#AAAAAA',

  // 테두리 및 구분선
  border: '#F0ECEB',
  borderLight: '#F3EFEF',
  borderDark: '#EAE5E3',

  // 상태 및 포인트
  white: '#FFFFFF',
  black: '#000000',
  success: '#46956B',
  successBg: '#EFF8F2',
  star: '#E6A04D',
  badgeDark: '#777777',
} as const;

export type ColorKey = keyof typeof COLORS;
export default COLORS;
