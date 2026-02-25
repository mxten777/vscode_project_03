/**
 * 친구 일괄 등록 스크립트
 *
 * 사용법: 앱 로그인 후 브라우저 콘솔에서 실행
 *   import('/src/seedFriends.ts').then(m => m.seedFriends())
 */
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './lib/firebase';

const FRIENDS = [
  { name: '목광규', nickname: '광규' },
  { name: '이원호', nickname: '원호' },
  { name: '송하선', nickname: '하선' },
  { name: '남성우', nickname: '성우' },
  { name: '배종석', nickname: '종석' },
  { name: '심인식', nickname: '인식' },
  { name: '김동식', nickname: '동식' },
  { name: '박용국', nickname: '용국' },
  { name: '박신환', nickname: '신환' },
  { name: '한상성', nickname: '상성' },
  { name: '장연호', nickname: '연호' },
  { name: '김교진', nickname: '교진' },
  { name: '정동열', nickname: '동열' },
  { name: '강대현', nickname: '대현' },
  { name: '김준성', nickname: '준성' },
];

export async function seedFriends() {
  if (!db) {
    console.error('❌ Firestore가 초기화되지 않았습니다.');
    return;
  }

  const user = getAuth().currentUser;
  if (!user) {
    console.error('❌ 로그인이 필요합니다. 앱에서 먼저 로그인하세요.');
    return;
  }

  console.log(`🌱 ${FRIENDS.length}명의 친구를 등록합니다...`);

  let count = 0;
  for (const friend of FRIENDS) {
    await addDoc(collection(db, 'friends'), {
      ownerUid: user.uid,
      name: friend.name,
      nickname: friend.nickname,
      phone: '',
      memo: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    count++;
    console.log(`  ✅ ${count}/${FRIENDS.length} ${friend.name}`);
  }

  console.log(`🎉 완료! ${count}명의 친구가 등록되었습니다.`);
}
