import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import type { Note } from '../types';

export function useNotes(bookId: string) {
  const { user } = useAuth();
  const [data, setData] = useState<Note[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !bookId || !db) { setLoading(false); return; }
    const q = query(
      collection(db, 'notes'),
      where('ownerUid', '==', user.uid),
      where('bookId', '==', bookId),
    );
    const unsub = onSnapshot(q, (snap) => {
      const notes = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Note);
      notes.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setData(notes);
      setLoading(false);
    }, (err) => {
      console.error('독후감 조회 오류:', err);
      setLoading(false);
    });
    return unsub;
  }, [user, bookId]);

  return { data, isLoading };
}

export function useAddNote() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookId,
      content,
      quote,
    }: {
      bookId: string;
      content: string;
      quote?: string;
    }) => {
      if (!user || !db) throw new Error('Not authenticated');
      return addDoc(collection(db, 'notes'), {
        ownerUid: user.uid,
        bookId,
        content,
        quote: quote || undefined,
        createdAt: serverTimestamp(),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!db) throw new Error('Firebase not configured');
      await deleteDoc(doc(db, 'notes', id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });
}
