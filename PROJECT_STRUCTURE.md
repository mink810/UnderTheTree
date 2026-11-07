# 프로젝트 구조 (PROJECT_STRUCTURE.md)

Expo Router + 피처 기반(`src/features/`). **라우트**는 `src/app/`(얇은 진입점), **화면 UI·로직**은 `src/features/<feature>/screens/`.

---

## 디렉토리 트리

```text
src/
├── app/
│   ├── _layout.tsx                          # 루트 Stack
│   ├── index.tsx                            # → 구매자 홈 리다이렉트
│   └── (buyer)/
│       ├── _layout.tsx                      # Stack + FavoritesProvider
│       ├── (tabs)/
│       │   ├── _layout.tsx                  # 하단 탭
│       │   ├── home.tsx                     # → DiscoveryHomeScreen
│       │   ├── likes.tsx                    # → LikesScreen
│       │   ├── chats.tsx                    # → ChatsScreen
│       │   └── my.tsx                       # → MyScreen
│       ├── seller/[sellerId].tsx            # BUY-003 판매자 프로필
│       ├── booking/[sellerId]/
│       │   ├── product-select.tsx           # BUY-004 상품 선택
│       │   ├── calendar.tsx                 # BUY-005 날짜·시간 선택
│       │   ├── confirm.tsx                  # BUY-006 예약 확인·동의
│       │   ├── payment.tsx                  # BUY-007 결제(Mock)
│       │   └── complete.tsx                 # BUY-008 예약 완료
│       ├── reservations/index.tsx           # BUY-012 예약 내역 목록
│       ├── reservation/[bookingId].tsx      # 예약 상세
│       ├── chat/[bookingId].tsx             # BUY-010 대화방(플레이스홀더)
│       ├── review/[bookingId].tsx           # BUY-013 후기 작성·조회
│       ├── reviews/index.tsx                # BUY-014 내가 쓴 후기
│       └── notifications/
│           ├── index.tsx                    # BUY-015 알림 목록
│           └── [notificationId].tsx         # BUY-015 알림 상세
│
├── features/
│   ├── seller/                              # 판매자 카드·프로필·상품·후기 UI + SellerProfileScreen
│   ├── discovery/                           # 필터·정렬 + DiscoveryHomeScreen
│   ├── favorites/                           # 찜 Context + LikesScreen
│   ├── account/                             # MyScreen
│   ├── chat/                                # ChatsScreen, BookingChatScreen
│   ├── navigation/                          # BuyerTabBar
│   ├── booking/                             # 예약 플로우·목록/상세 screens/
│   ├── review/                              # 후기 screens/
│   └── notifications/                       # 알림 screens/
│
├── components/ui|layout/                    # AppButton, AppHeader, ScreenContainer 등
├── constants/                               # colors, spacing, typography
├── hooks/                                   # useSafeAreaLayout 등
├── services/api/                            # apiClient(향후 API)
├── store/                                   # 전역 스토어 자리
├── types/                                   # common.types
└── utils/                                   # formatPrice, sort
```

---

## 라우트 vs 화면

`src/app/` 파일은 URL·네비게이션만 담당하고, 실제 UI는 `features/<feature>/screens/`에 둡니다.

```tsx
// src/app/(buyer)/(tabs)/home.tsx
import DiscoveryHomeScreen from '@/features/discovery/screens/DiscoveryHomeScreen';

export default function HomeRoute() {
  return <DiscoveryHomeScreen />;
}
```

`_layout.tsx`, `index.tsx`(리다이렉트)는 예외적으로 레이아웃·진입 로직을 유지합니다.

---

## 화면(라우트) 요약

| 경로 | ID | 하는 일 |
| :--- | :--- | :--- |
| `(tabs)/home` | — | 판매자 그리드, 필터, 알림 진입 |
| `(tabs)/likes` | — | 찜한 판매자 |
| `(tabs)/chats` | — | 채팅 목록 UI |
| `(tabs)/my` | — | 예약 내역·내 후기 등 메뉴 |
| `seller/[sellerId]` | BUY-003 | 프로필·상품·후기, 예약 시작 |
| `booking/.../product-select` | BUY-004 | 데이트 상품 선택 |
| `booking/.../calendar` | BUY-005 | 예약일·시간 선택 |
| `booking/.../confirm` | BUY-006 | 예약 정보 확인·약관 동의 |
| `booking/.../payment` | BUY-007 | 결제(Mock, 재시도) |
| `booking/.../complete` | BUY-008 | 완료 안내 → 상세·채팅 |
| `reservations/index` | BUY-012 | 예약 목록·상태 탭 |
| `reservation/[bookingId]` | — | 예약 상세 |
| `chat/[bookingId]` | BUY-010 | 예약별 대화(플레이스홀더) |
| `review/[bookingId]` | BUY-013 | 후기 작성·보기 |
| `reviews/index` | BUY-014 | 작성한 후기 목록 |
| `notifications/index` | BUY-015 | 알림 목록·카테고리·모두 읽음 |
| `notifications/[notificationId]` | BUY-015 | 알림 상세·관련 화면 이동 |

---

## features 요약

| 모듈 | 하는 일 |
| :--- | :--- |
| **seller** | 목록·상세 Mock, 카드/갤러리/상품/후기 컴포넌트 |
| **discovery** | 홈 필터·정렬 상태 |
| **favorites** | 찜 저장·토글 |
| **navigation** | 커스텀 탭바 |
| **booking** | 예약 플로우, 슬롯, 결제 Mock, 예약 CRUD·상태 |
| **review** | 후기 등록(store)·내 후기·정렬·사진 |
| **notifications** | 알림 Mock, 읽음, 카테고리·날짜 그룹 |

---

## 기타 top-level

| 경로 | 하는 일 |
| :--- | :--- |
| **components/** | 도메인 무관 공통 UI |
| **constants/** | 테마 토큰 |
| **services/api/** | HTTP 클라이언트 |
| **store/** | 전역 상태(확장용) |
| **utils/** | 가격·정렬 등 순수 함수 |
