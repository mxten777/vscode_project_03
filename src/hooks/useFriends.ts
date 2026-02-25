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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import type { Friend } from '../types';
import type { FriendFormValues } from '../lib/validators';

export function useFriends() {
  const { user } = useAuth();
  const [data, setData] = useState<Friend[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) { setLoading(false); return; }
    const q = query(
      collection(db, 'friends'),
      where('ownerUid', '==', user.uid),
    );
    const unsub = onSnapshot(q, (snap) => {
      const friends = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Friend);
      friends.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setData(friends);
      setLoading(false);
    }, (err) => {
      console.error('친구 목록 조회 오류:', err);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  return { data, isLoading };
}

export function useAddFriend() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (values: FriendFormValues) => {
      if (!user || !db) throw new Error('Not authenticated');
      return addDoc(collection(db, 'friends'), {
        ownerUid: user.uid,
        ...values,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['friends'] }),
  });
}

export function useUpdateFriend() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...values }: Partial<FriendFormValues> & { id: string }) => {
      if (!db) throw new Error('Firebase not configured');
      await updateDoc(doc(db, 'friends', id), {
        ...values,
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['friends'] }),
  });
}

export function useDeleteFriend() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!db) throw new Error('Firebase not configured');
      await deleteDoc(doc(db, 'friends', id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['friends'] }),
  });
}
