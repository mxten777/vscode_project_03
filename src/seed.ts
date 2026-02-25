/**
 * 개발용 시드 데이터 생성 스크립트
 *
 * 사용법:
 *   1. 앱에 Google 로그인 후 브라우저 콘솔에서 실행
 *   2. 또는 이 파일을 import하여 seedData(uid)를 호출
 *
 * ⚠️ 프로덕션에서 사용하지 마세요.
 */
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
  writeBatch,
  doc,
} from 'firebase/firestore';
import { db } from './lib/firebase';

export async function seedData(uid: string) {
  if (!db) {
    console.error('❌ Firestore가 초기화되지 않았습니다.');
    return;
  }
  console.log('🌱 Seeding data for uid:', uid);

  // 1. 친구 등록
  const friendsData = [
    { name: '김민수', nickname: '민수', phone: '010-1234-5678', memo: '대학 동기' },
    { name: '이지현', nickname: '지현', phone: '010-9876-5432', memo: '독서 모임' },
    { name: '박준혁', nickname: '준혁', phone: '', memo: '직장 동료' },
  ];

  const friendIds: string[] = [];
  for (const f of friendsData) {
    const ref = await addDoc(collection(db, 'friends'), {
      ownerUid: uid,
      ...f,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    friendIds.push(ref.id);
  }

  // 2. 도서 등록
  const booksData = [
    { title: '사피엔스', author: '유발 하라리', publisher: '김영사', category: '인문', status: 'available' as const },
    { title: '원씽', author: '게리 켈러', publisher: '비즈니스북스', category: '자기계발', status: 'available' as const },
    { title: '데미안', author: '헤르만 헤세', publisher: '민음사', category: '소설', status: 'available' as const },
    { title: '코스모스', author: '칼 세이건', publisher: '사이언스북스', category: '과학', status: 'available' as const },
    { title: '잡식동물의 딜레마', author: '마이클 폴란', publisher: '다른', category: '에세이', status: 'available' as const },
  ];

  const bookIds: string[] = [];
  for (const b of booksData) {
    const ref = await addDoc(collection(db, 'books'), {
      ownerUid: uid,
      ...b,
      currentLoanId: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    bookIds.push(ref.id);
  }

  // 3. 대여 생성 (첫 번째 도서 → 첫 번째 친구)
  const batch = writeBatch(db);

  const loanRef = doc(collection(db, 'loans'));
  batch.set(loanRef, {
    ownerUid: uid,
    bookId: bookIds[0],
    friendId: friendIds[0],
    loanedAt: serverTimestamp(),
    dueAt: Timestamp.fromDate(new Date(Date.now() + 14 * 86400000)), // 2주 후
    returnedAt: null,
    status: 'loaned',
  });

  const bookRef = doc(db, 'books', bookIds[0]);
  batch.update(bookRef, {
    status: 'loaned',
    currentLoanId: loanRef.id,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();

  // 4. 독후감
  await addDoc(collection(db, 'notes'), {
    ownerUid: uid,
    bookId: bookIds[2], // 데미안
    content: '자기 자신을 찾아가는 여정이 인상적. 새가 알을 깨고 나오는 장면이 계속 머릿속에 맴돈다.',
    quote: '새는 알에서 나오려고 투쟁한다. 알은 세계이다.',
    createdAt: serverTimestamp(),
  });

  await addDoc(collection(db, 'notes'), {
    ownerUid: uid,
    bookId: bookIds[0], // 사피엔스
    content: '인류 역사를 전혀 새로운 시각으로 볼 수 있었다. 특히 농업혁명 파트가 충격적.',
    quote: '',
    createdAt: serverTimestamp(),
  });

  console.log('✅ Seed complete!');
  console.log('   Friends:', friendIds.length);
  console.log('   Books:', bookIds.length);
  console.log('   Loans: 1');
  console.log('   Notes: 2');
}
