import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import type { Loan } from '../types';

export function useLoans(bookId?: string) {
  const { user } = useAuth();
  const [data, setData] = useState<Loan[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) { setLoading(false); return; }
    const constraints = [where('ownerUid', '==', user.uid)];
    if (bookId) constraints.push(where('bookId', '==', bookId));
    const q = query(collection(db, 'loans'), ...constraints);
    const unsub = onSnapshot(q, (snap) => {
      const loans = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Loan);
      loans.sort((a, b) => (b.loanedAt?.seconds ?? 0) - (a.loanedAt?.seconds ?? 0));
      setData(loans);
      setLoading(false);
    }, (err) => {
      console.error('대여 기록 조회 오류:', err);
      setLoading(false);
    });
    return unsub;
  }, [user, bookId]);

  return { data, isLoading };
}

/** 대여 생성 — batched write로 book.status + currentLoanId 동기화 */
export function useCreateLoan() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookId,
      friendId,
      dueAt,
    }: {
      bookId: string;
      friendId: string;
      dueAt?: string;
    }) => {
      if (!user || !db) throw new Error('Not authenticated');

      const batch = writeBatch(db);

      // 1. loan document
      const loanRef = doc(collection(db, 'loans'));
      batch.set(loanRef, {
        ownerUid: user.uid,
        bookId,
        friendId,
        loanedAt: serverTimestamp(),
        dueAt: dueAt ? Timestamp.fromDate(new Date(dueAt)) : null,
        returnedAt: null,
        status: 'loaned',
      });

      // 2. book status update
      const bookRef = doc(db, 'books', bookId);
      batch.update(bookRef, {
        status: 'loaned',
        currentLoanId: loanRef.id,
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
      return loanRef.id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['books'] });
      qc.invalidateQueries({ queryKey: ['loans'] });
    },
  });
}

/** 반납 처리 — batched write로 loan.returnedAt + book.status 동기화 */
export function useReturnLoan() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ loanId, bookId }: { loanId: string; bookId: string }) => {
      if (!db) throw new Error('Firebase not configured');
      const batch = writeBatch(db);

      const loanRef = doc(db, 'loans', loanId);
      batch.update(loanRef, {
        returnedAt: serverTimestamp(),
        status: 'returned',
      });

      const bookRef = doc(db, 'books', bookId);
      batch.update(bookRef, {
        status: 'available',
        currentLoanId: null,
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['books'] });
      qc.invalidateQueries({ queryKey: ['loans'] });
    },
  });
}
