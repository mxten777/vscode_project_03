import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import type { Book, BookDoc } from '../types';
import type { BookFormValues } from '../lib/validators';

function useBooksSnapshot(uid: string | undefined) {
  const [data, setData] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid || !db) { setLoading(false); return; }
    const q = query(
      collection(db, 'books'),
      where('ownerUid', '==', uid),
    );
    const unsub = onSnapshot(q, (snap) => {
      const books = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Book);
      books.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setData(books);
      setLoading(false);
    }, (err) => {
      console.error('도서 목록 조회 오류:', err);
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  return { data, loading };
}

export function useBooks() {
  const { user } = useAuth();
  const snapshot = useBooksSnapshot(user?.uid);

  const books = useQuery<Book[]>({
    queryKey: ['books', user?.uid],
    queryFn: () => snapshot.data,
    enabled: !snapshot.loading,
    initialData: snapshot.data,
  });

  // keep react-query in sync with snapshot
  const qc = useQueryClient();
  useEffect(() => {
    qc.setQueryData(['books', user?.uid], snapshot.data);
  }, [snapshot.data, qc, user?.uid]);

  return { ...books, data: snapshot.data, isLoading: snapshot.loading };
}

export function useAddBook() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (values: BookFormValues & { coverUrl?: string }) => {
      if (!user || !db) throw new Error('Not authenticated');
      const docData: Omit<BookDoc, 'createdAt' | 'updatedAt'> & {
        createdAt: ReturnType<typeof serverTimestamp>;
        updatedAt: ReturnType<typeof serverTimestamp>;
      } = {
        ownerUid: user.uid,
        title: values.title,
        author: values.author,
        publisher: values.publisher || undefined,
        isbn: values.isbn || undefined,
        category: values.category || undefined,
        coverUrl: values.coverUrl || undefined,
        status: 'available',
        currentLoanId: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      return addDoc(collection(db, 'books'), docData);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  });
}

export function useUpdateBook() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...values
    }: Partial<BookFormValues> & { id: string; coverUrl?: string }) => {
      if (!db) throw new Error('Firebase not configured');
      await updateDoc(doc(db, 'books', id), {
        ...values,
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  });
}

export function useDeleteBook() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!db) throw new Error('Firebase not configured');
      await deleteDoc(doc(db, 'books', id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  });
}
