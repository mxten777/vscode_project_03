import type { Timestamp } from 'firebase/firestore';

// ─── Firestore Document Types ──────────────────────────────────────

export interface UserDoc {
  displayName: string;
  email: string;
  createdAt: Timestamp;
}

export type BookStatus = 'available' | 'loaned';

export interface BookDoc {
  ownerUid: string;
  title: string;
  author: string;
  publisher?: string;
  isbn?: string;
  category?: string;
  coverUrl?: string;
  status: BookStatus;
  currentLoanId?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FriendDoc {
  ownerUid: string;
  name: string;
  nickname: string;
  phone?: string;
  memo?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type LoanStatus = 'loaned' | 'returned';

export interface LoanDoc {
  ownerUid: string;
  bookId: string;
  friendId: string;
  loanedAt: Timestamp;
  dueAt?: Timestamp | null;
  returnedAt?: Timestamp | null;
  status: LoanStatus;
}

export interface NoteDoc {
  ownerUid: string;
  bookId: string;
  content: string;
  quote?: string;
  createdAt: Timestamp;
}

// ─── With ID (client-side) ─────────────────────────────────────────

export type WithId<T> = T & { id: string };

export type Book = WithId<BookDoc>;
export type Friend = WithId<FriendDoc>;
export type Loan = WithId<LoanDoc>;
export type Note = WithId<NoteDoc>;
