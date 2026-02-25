# 북버디(BookBuddy) 📚

> 친구들과 도서를 공유하고, 대여·반납을 관리하고, 짧은 독후감을 기록하는 웹앱

---

## 목차

1. [프로젝트 소개](#1-프로젝트-소개)
2. [기술 스택](#2-기술-스택)
3. [주요 기능](#3-주요-기능)
4. [사용자 흐름](#4-사용자-흐름)
5. [화면 구성(라우팅)](#5-화면-구성라우팅)
6. [데이터 모델(Firestore 설계)](#6-데이터-모델firestore-설계)
7. [프로젝트 구조](#7-프로젝트-구조)
8. [보안 규칙](#8-보안-규칙)
9. [로컬 실행 가이드](#9-로컬-실행-가이드)
10. [Vercel 배포 가이드](#10-vercel-배포-가이드)
11. [시드 데이터(개발용)](#11-시드-데이터개발용)
12. [구현 상세](#12-구현-상세)
13. [향후 계획](#13-향후-계획)

---

## 1. 프로젝트 소개

**북버디(BookBuddy)** 는 소규모 친구 그룹 내에서 도서를 등록하고, 누구에게 빌려줬는지 추적하며, 간단한 독후감을 남길 수 있는 MVP(최소 기능 제품) 웹 애플리케이션입니다.

### 해결하려는 문제
- "이 책 누구한테 빌려줬더라?" 하는 기억의 한계
- 언제 빌려줬고 언제 돌려받기로 했는지 기록 부재
- 읽었던 책에 대한 짧은 감상을 한곳에 모아두고 싶은 니즈

### 대상 사용자
- 종이책을 좋아하고, 친구들에게 자주 빌려주는 사람
- 5~20명 규모의 소규모 독서 그룹 운영자

---

## 2. 기술 스택

| 영역 | 기술 | 설명 |
|------|------|------|
| 프론트엔드 | Vite + React 19 + TypeScript | 빠른 HMR, 타입 안전성 |
| UI 스타일 | Tailwind CSS v4 | 유틸리티 기반, 모바일 우선 |
| 아이콘 | Lucide React | 경량 SVG 아이콘 라이브러리 |
| 인증 | Firebase Authentication | 구글 소셜 로그인 |
| 데이터베이스 | Cloud Firestore | 실시간 NoSQL 문서 DB |
| 파일 저장소 | Firebase Storage | 도서 표지 이미지 업로드 |
| 서버/쿼리 상태 | TanStack React Query v5 | 캐싱, 무효화, 실시간 동기화 |
| 폼 관리 | React Hook Form + Zod | 선언적 폼 검증 |
| 날짜 처리 | date-fns | 경량 날짜 유틸리티 |
| 라우팅 | React Router v7 | SPA 클라이언트 라우팅 |
| 배포 | Vercel | 무료 정적 호스팅, 자동 CI/CD |

---

## 3. 주요 기능

### 필수 기능 (MVP)

| 기능 | 설명 |
|------|------|
| 도서 등록 | 제목, 저자, 출판사, ISBN(선택), 표지 이미지(선택), 카테고리(선택) 입력 |
| 도서 수정/삭제 | 등록된 도서 정보 수정 및 삭제 |
| 친구 등록 | 이름, 닉네임, 연락처(선택), 메모(선택) 입력 |
| 친구 수정/삭제 | 등록된 친구 정보 수정 및 삭제 |
| 도서 대여 | 친구 선택 → 대여일 자동 기록, 반납 예정일(선택) 설정 |
| 도서 반납 | 반납일 자동 기록, 상태 변경 (대여중 → 보유중) |
| 독후감 기록 | 책별 "기억나는 문구" + "감상/메모" 저장 (타임스탬프 포함) |

### 추가 기능

| 기능 | 설명 |
|------|------|
| 검색 | 제목/저자/카테고리 키워드 검색 |
| 필터 (탭) | 전체 / 보유중 / 대여중 탭 전환 |
| 연체 경고 | 반납 예정일 초과 시 빨간색 표시 |
| 홈 대시보드 | 보유중, 대여중, 연체, 친구 수 요약 카드 |

---

## 4. 사용자 흐름

```
구글 로그인
    │
    ▼
 홈 (대시보드)
 ┌─ 보유중/대여중/연체/친구 수 요약
 └─ 현재 대여중인 도서 목록
    │
    ├──▶ 도서 목록 ──▶ 도서 등록
    │         │
    │         ▼
    │     도서 상세
    │     ├─ 대여하기 (모달: 친구 선택 → 확인)
    │     ├─ 반납하기 (버튼 클릭)
    │     ├─ 독후감 추가 (폼: 문구 + 감상)
    │     └─ 수정 / 삭제
    │
    ├──▶ 친구 관리
    │     ├─ 친구 추가 (모달)
    │     └─ 수정 / 삭제
    │
    └──▶ 대여 기록
          └─ 전체 / 대여중 / 반납됨 탭
```

---

## 5. 화면 구성(라우팅)

| 경로 | 페이지 | 기능 |
|------|--------|------|
| `/` | 홈 | 요약 카드(보유중/대여중/연체/친구 수), 현재 대여 목록 |
| `/books` | 도서 목록 | 보유중/대여중 탭 필터, 키워드 검색, 도서 카드 리스트 |
| `/books/new` | 도서 등록 | 표지 업로드 + 도서 정보 폼 |
| `/books/:id` | 도서 상세 | 도서 정보, 대여/반납 버튼, 독후감 작성, 대여 이력 |
| `/friends` | 친구 관리 | 친구 목록, 추가(모달), 수정(모달), 삭제 |
| `/loans` | 대여 기록 | 전체/대여중/반납됨 탭, 대여 이력 카드 |

### 레이아웃 구성

- **데스크탑**: 상단 헤더(로고 + 사용자 정보) + 왼쪽 사이드바 내비게이션
- **모바일**: 상단 헤더 + 하단 탭 바 내비게이션

---

## 6. 데이터 모델(Firestore 설계)

### 6.1 컬렉션 구조

#### `users/{uid}` — 사용자

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| displayName | string | ○ | 표시 이름 (구글에서 자동 입력) |
| email | string | ○ | 이메일 |
| createdAt | Timestamp | ○ | 가입 시각 |

#### `books/{bookId}` — 도서

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| ownerUid | string | ○ | 소유자 UID |
| title | string | ○ | 도서 제목 |
| author | string | ○ | 저자 |
| publisher | string | | 출판사 |
| isbn | string | | ISBN |
| category | string | | 카테고리 (소설, 과학 등) |
| coverUrl | string | | 표지 이미지 URL (Storage) |
| status | `'available'` \| `'loaned'` | ○ | 현재 상태 |
| currentLoanId | string \| null | | 현재 대여 문서 ID |
| createdAt | Timestamp | ○ | 등록 시각 |
| updatedAt | Timestamp | ○ | 수정 시각 |

#### `friends/{friendId}` — 친구

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| ownerUid | string | ○ | 소유자 UID |
| name | string | ○ | 이름 |
| nickname | string | ○ | 닉네임 |
| phone | string | | 연락처 |
| memo | string | | 메모 |
| createdAt | Timestamp | ○ | 등록 시각 |
| updatedAt | Timestamp | ○ | 수정 시각 |

#### `loans/{loanId}` — 대여 기록

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| ownerUid | string | ○ | 소유자 UID |
| bookId | string | ○ | 대여 도서 ID |
| friendId | string | ○ | 대여 대상 친구 ID |
| loanedAt | Timestamp | ○ | 대여일 |
| dueAt | Timestamp \| null | | 반납 예정일 |
| returnedAt | Timestamp \| null | | 실제 반납일 |
| status | `'loaned'` \| `'returned'` | ○ | 대여 상태 |

#### `notes/{noteId}` — 독후감

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| ownerUid | string | ○ | 소유자 UID |
| bookId | string | ○ | 도서 ID |
| content | string | ○ | 감상/메모 |
| quote | string | | 기억나는 문구 |
| createdAt | Timestamp | ○ | 작성 시각 |

### 6.2 설계 원칙

- **ownerUid 기반 격리**: 모든 문서에 `ownerUid` 필드를 포함하여, 각 사용자는 자기 데이터만 조회/수정 가능
- **상태 동기화**: 대여 생성·반납 시 `writeBatch`를 사용하여 `loans` 문서와 `books.status` + `books.currentLoanId`를 원자적으로 동시 업데이트
- **실시간 동기화**: `onSnapshot`을 사용하여 Firestore 변경사항을 즉시 UI에 반영

### 6.3 필요 복합 인덱스

| 컬렉션 | 인덱스 필드 | 용도 |
|--------|------------|------|
| books | `ownerUid` 오름차순, `createdAt` 내림차순 | 내 도서 최신순 목록 |
| friends | `ownerUid` 오름차순, `createdAt` 내림차순 | 내 친구 최신순 목록 |
| loans | `ownerUid` 오름차순, `loanedAt` 내림차순 | 내 대여 기록 최신순 |
| loans | `ownerUid` 오름차순, `bookId` 오름차순, `loanedAt` 내림차순 | 특정 도서의 대여 이력 |
| notes | `ownerUid` 오름차순, `bookId` 오름차순, `createdAt` 내림차순 | 특정 도서의 독후감 목록 |

> 앱 실행 시 Firestore가 필요한 인덱스를 자동 감지하여 콘솔에 생성 링크를 출력합니다. 해당 링크를 클릭하면 자동으로 인덱스가 생성됩니다.

---

## 7. 프로젝트 구조

```
vscode_project_03/
├── public/                 정적 파일
├── src/
│   ├── components/         UI 컴포넌트
│   │   ├── layout/
│   │   │   └── Layout.tsx          헤더 + 사이드바(데스크탑) + 하단탭(모바일)
│   │   ├── ui/                     범용 UI 컴포넌트
│   │   │   ├── Badge.tsx           상태 뱃지 (보유중/대여중 등)
│   │   │   ├── Button.tsx          버튼 (primary/secondary/danger/ghost)
│   │   │   ├── Card.tsx            카드 컨테이너
│   │   │   ├── EmptyState.tsx      빈 상태 안내
│   │   │   ├── Input.tsx           텍스트 입력
│   │   │   ├── Loading.tsx         로딩 스피너
│   │   │   ├── Modal.tsx           모달(팝업) 창
│   │   │   ├── Select.tsx          드롭다운 선택
│   │   │   └── Textarea.tsx        여러 줄 텍스트 입력
│   │   ├── books/
│   │   │   ├── BookCard.tsx        도서 카드 (목록용)
│   │   │   ├── BookForm.tsx        도서 등록/수정 폼
│   │   │   └── LoanForm.tsx        대여 폼 (친구 선택 + 반납 예정일)
│   │   ├── friends/
│   │   │   └── FriendForm.tsx      친구 등록/수정 폼
│   │   └── notes/
│   │       └── NoteForm.tsx        독후감 작성 폼
│   │
│   ├── hooks/              커스텀 훅 (비즈니스 로직)
│   │   ├── useAuth.tsx     구글 인증 + 인증 컨텍스트 제공
│   │   ├── useBooks.ts     도서 CRUD (onSnapshot 실시간 동기화)
│   │   ├── useFriends.ts   친구 CRUD
│   │   ├── useLoans.ts     대여 생성/반납 (writeBatch 트랜잭션)
│   │   └── useNotes.ts     독후감 CRUD
│   │
│   ├── lib/                외부 라이브러리 설정
│   │   ├── firebase.ts     Firebase 앱 초기화 (환경변수 기반)
│   │   └── validators.ts   Zod 스키마 (폼 검증 규칙)
│   │
│   ├── pages/              페이지 컴포넌트
│   │   ├── HomePage.tsx         홈 대시보드 (/)
│   │   ├── BooksPage.tsx        도서 목록 (/books)
│   │   ├── BookNewPage.tsx      도서 등록 (/books/new)
│   │   ├── BookDetailPage.tsx   도서 상세 (/books/:id)
│   │   ├── FriendsPage.tsx      친구 관리 (/friends)
│   │   └── LoansPage.tsx        대여 기록 (/loans)
│   │
│   ├── types/
│   │   └── index.ts        TypeScript 타입 정의 (Firestore 모델)
│   │
│   ├── seed.ts             개발용 샘플 데이터 생성 스크립트
│   ├── App.tsx             라우팅 설정 + Provider 래핑
│   ├── main.tsx            앱 진입점
│   └── index.css           Tailwind CSS 설정 + 커스텀 색상
│
├── firestore.rules         Firestore 보안 규칙
├── storage.rules           Storage 보안 규칙
├── vercel.json             Vercel SPA 리다이렉트 설정
├── .env.example            환경변수 템플릿
├── package.json            의존성 및 스크립트
├── tsconfig.json           TypeScript 설정
└── vite.config.ts          Vite 빌드 설정 (React + Tailwind 플러그인)
```

---

## 8. 보안 규칙

### 8.1 Firestore 보안 규칙 (`firestore.rules`)

모든 컬렉션에 동일한 패턴을 적용합니다:

| 동작 | 조건 |
|------|------|
| 읽기 | 로그인 필수 + 문서의 `ownerUid`가 현재 사용자 UID와 일치 |
| 생성 | 로그인 필수 + 새로 생성하는 문서의 `ownerUid`가 현재 사용자 UID와 일치 |
| 수정/삭제 | 로그인 필수 + 기존 문서의 `ownerUid`가 현재 사용자 UID와 일치 |

> `users/{uid}` 컬렉션은 별도로/경로의 `{uid}`가 `request.auth.uid`와 일치해야 읽기/쓰기 가능합니다.

### 8.2 Storage 보안 규칙 (`storage.rules`)

| 경로 | 읽기 | 쓰기 | 제한 |
|------|------|------|------|
| `covers/{uid}/**` | 로그인 사용자 전체 | 해당 UID 소유자만 | 5MB 이하, 이미지 파일만 |
| 그 외 경로 | 거부 | 거부 | — |

---

## 9. 로컬 실행 가이드

### 9.1 사전 요구사항

- Node.js 18 이상
- npm 9 이상
- Firebase 프로젝트 (무료 Spark 요금제 가능)

### 9.2 설치

```bash
git clone <저장소-URL>
cd vscode_project_03
npm install
```

### 9.3 Firebase 프로젝트 설정

1. [Firebase 콘솔](https://console.firebase.google.com/)에 접속하여 새 프로젝트를 생성합니다.
2. **Authentication** 메뉴에서 "시작하기"를 클릭하고, **Google** 제공업체를 활성화합니다.
3. **Firestore Database** 메뉴에서 "데이터베이스 만들기"를 클릭합니다.
   - 처음에는 "테스트 모드"로 시작해도 됩니다.
   - 이후 `firestore.rules` 내용을 규칙 탭에 붙여넣고 "게시"합니다.
4. **Storage** 메뉴에서 "시작하기"를 클릭합니다.
   - 규칙 탭에 `storage.rules` 내용을 붙여넣고 "게시"합니다.
5. **프로젝트 설정** > **일반** > 하단의 "웹 앱"을 등록하고, Firebase 설정값을 복사합니다.

### 9.4 환경변수 설정

프로젝트 루트의 `.env.example`을 복사하여 `.env` 파일을 생성합니다:

```bash
cp .env.example .env
```

`.env` 파일을 열고 Firebase 설정값을 입력합니다:

```env
VITE_FIREBASE_API_KEY=여기에-API-키-입력
VITE_FIREBASE_AUTH_DOMAIN=프로젝트ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=프로젝트ID
VITE_FIREBASE_STORAGE_BUCKET=프로젝트ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=발신자ID
VITE_FIREBASE_APP_ID=앱ID
```

### 9.5 Firestore 인덱스 생성

두 가지 방법이 있습니다:

**방법 1 (자동)**: 개발 서버 실행 후, 브라우저 개발자 도구 콘솔에 표시되는 인덱스 생성 링크를 클릭합니다.

**방법 2 (수동)**: Firebase 콘솔 > Firestore > 인덱스 탭에서 직접 생성합니다. (6.3절 참고)

### 9.6 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`에 접속합니다.

### 9.7 빌드

```bash
npm run build     # TypeScript 검사 + Vite 프로덕션 빌드
npm run preview   # 빌드 결과 로컬 미리보기
```

---

## 10. Vercel 배포 가이드

### 10.1 CLI 배포

```bash
# Vercel CLI 설치 (최초 1회)
npm install -g vercel

# 프로젝트 연결 및 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 10.2 대시보드 설정

Vercel 대시보드 → 해당 프로젝트 → **Settings** → **Environment Variables**에 `.env` 파일의 모든 변수를 등록합니다:

| 변수명 | 값 |
|--------|-----|
| `VITE_FIREBASE_API_KEY` | Firebase API 키 |
| `VITE_FIREBASE_AUTH_DOMAIN` | 인증 도메인 |
| `VITE_FIREBASE_PROJECT_ID` | 프로젝트 ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | 스토리지 버킷 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 발신자 ID |
| `VITE_FIREBASE_APP_ID` | 앱 ID |

### 10.3 빌드 설정

| 항목 | 값 |
|------|-----|
| 프레임워크 프리셋 | Vite |
| 빌드 명령어 | `npm run build` |
| 출력 디렉터리 | `dist` |

### 10.4 SPA 라우팅

프로젝트 루트의 `vercel.json`에 SPA 리다이렉트가 이미 설정되어 있습니다:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 10.5 Firebase 인증 도메인 추가

배포 후 Vercel에서 부여받은 도메인을 Firebase 콘솔에 등록해야 합니다:

1. Firebase 콘솔 → **Authentication** → **Settings** → **승인된 도메인**
2. Vercel 배포 도메인(예: `my-app.vercel.app`)을 추가

---

## 11. 시드 데이터(개발용)

개발 및 테스트를 위한 샘플 데이터 생성 기능이 포함되어 있습니다.

### 포함된 샘플 데이터

| 종류 | 내용 |
|------|------|
| 친구 3명 | 김민수, 이지현, 박준혁 |
| 도서 5권 | 사피엔스, 원씽, 데미안, 코스모스, 잡식동물의 딜레마 |
| 대여 1건 | 사피엔스 → 김민수 (반납 예정일: 2주 후) |
| 독후감 2건 | 데미안, 사피엔스에 대한 감상 |

### 사용법

앱에 구글 로그인 후, 브라우저 개발자 도구(F12) 콘솔에서 실행:

```javascript
import('/src/seed.ts').then(m => m.seedData('여기에_UID_입력'))
```

또는 소스 코드에서 직접 호출:

```typescript
import { seedData } from './seed';
// 로그인 성공 후
seedData(user.uid);
```

---

## 12. 구현 상세

### 12.1 인증 구조

`useAuth` 훅이 `AuthProvider` 컨텍스트를 통해 앱 전체에 인증 상태를 제공합니다.

- `onAuthStateChanged` 리스너로 로그인 상태 실시간 감지
- 로그인 시 `users/{uid}` 문서를 자동 생성 (이미 존재하면 병합)
- 미인증 사용자는 로그인 화면만 표시

### 12.2 실시간 데이터 동기화

각 커스텀 훅(`useBooks`, `useFriends`, `useLoans`, `useNotes`)은 Firestore의 `onSnapshot`을 사용하여 데이터 변경을 실시간으로 수신합니다. React Query와 연동하여 캐싱과 무효화를 함께 처리합니다.

### 12.3 대여/반납 트랜잭션

데이터 일관성을 위해 `writeBatch`(일괄 쓰기)를 사용합니다:

**대여 시 (`useCreateLoan`)**:
1. `loans` 컬렉션에 새 대여 문서 생성 (`status: 'loaned'`)
2. `books/{bookId}` 문서의 `status`를 `'loaned'`로, `currentLoanId`를 새 대여 ID로 업데이트
3. 두 작업을 하나의 배치로 원자적 실행

**반납 시 (`useReturnLoan`)**:
1. `loans/{loanId}` 문서의 `status`를 `'returned'`로, `returnedAt`에 현재 시각 기록
2. `books/{bookId}` 문서의 `status`를 `'available'`로, `currentLoanId`를 `null`로 초기화
3. 두 작업을 하나의 배치로 원자적 실행

### 12.4 폼 검증

모든 폼은 Zod 스키마로 검증 규칙을 정의하고, React Hook Form의 `zodResolver`를 통해 연동합니다:

| 스키마 | 필수 필드 | 검증 규칙 |
|--------|-----------|-----------|
| `bookSchema` | 제목, 저자 | 최소 1자 이상 |
| `friendSchema` | 이름, 닉네임 | 최소 1자 이상 |
| `loanSchema` | 친구 ID | 최소 1자 이상 (선택됨) |
| `noteSchema` | 내용 | 최소 1자 이상 |

### 12.5 표지 이미지 업로드

- Firebase Storage 경로: `covers/{uid}/{타임스탬프}_{파일명}`
- 업로드 전 미리보기 표시 (`URL.createObjectURL`)
- 업로드 후 다운로드 URL을 도서 문서의 `coverUrl` 필드에 저장

### 12.6 UI/UX 설계

- **모바일 우선**: 하단 탭 내비게이션 (모바일) / 왼쪽 사이드바 (데스크탑)
- **상태 뱃지**: 보유중(초록), 대여중(빨강), 카테고리(파랑)
- **모달 폼**: 대여하기, 반납하기, 친구 추가/수정 시 모달(팝업) 사용
- **빈 상태**: 데이터가 없을 때 안내 메시지 + 행동 유도 버튼 표시
- **로딩 상태**: 데이터 불러오는 동안 스피너 표시
- **에러 처리**: React Query의 에러 상태 + 폼 검증 에러 메시지

---

## 13. 향후 계획

MVP 이후 추가 검토 예정 기능:

| 우선순위 | 기능 | 설명 |
|----------|------|------|
| 높음 | 푸시 알림 | 반납 예정일 도래 시 알림 |
| 높음 | 책 공유 링크 | 친구에게 특정 책 정보 공유 |
| 중간 | ISBN 바코드 스캔 | 카메라로 ISBN 스캔하여 자동 입력 |
| 중간 | 도서 통계 | 월별 독서량, 대여 현황 차트 |
| 낮음 | 그룹 기능 | 여러 사용자가 같은 서재를 공유 |
| 낮음 | 다크 모드 | 시스템 설정 연동 다크 테마 |

---

## 라이선스

MIT
