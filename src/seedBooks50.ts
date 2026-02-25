/**
 * 도서 50권 시드 데이터 등록 스크립트
 *
 * 사용법: 앱 로그인 후 브라우저 콘솔에서 실행
 *   import('/src/seedBooks50.ts').then(m => m.seedBooks50())
 */
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './lib/firebase';

export const seedBooks = [
  // ─── 한강 (10권) ───
  { title: "채식주의자", author: "한강", category: "소설", status: "available", ownerName: "관리자" },
  { title: "소년이 온다", author: "한강", category: "소설", status: "available", ownerName: "관리자" },
  { title: "흰", author: "한강", category: "소설", status: "available", ownerName: "관리자" },
  { title: "희랍어 시간", author: "한강", category: "소설", status: "available", ownerName: "관리자" },
  { title: "작별하지 않는다", author: "한강", category: "소설", status: "available", ownerName: "관리자" },
  { title: "그대의 차가운 손", author: "한강", category: "소설", status: "available", ownerName: "관리자" },
  { title: "검은 사슴", author: "한강", category: "소설", status: "available", ownerName: "관리자" },
  { title: "노랑무늬영원", author: "한강", category: "소설", status: "available", ownerName: "관리자" },
  { title: "내 여자의 열매", author: "한강", category: "소설", status: "available", ownerName: "관리자" },
  { title: "서랍에 저녁을 넣어 두었다", author: "한강", category: "소설", status: "available", ownerName: "관리자" },

  // ─── 김훈 (12권) ───
  { title: "칼의 노래", author: "김훈", category: "소설", status: "available", ownerName: "관리자" },
  { title: "남한산성", author: "김훈", category: "소설", status: "available", ownerName: "관리자" },
  { title: "현의 노래", author: "김훈", category: "소설", status: "available", ownerName: "관리자" },
  { title: "흑산", author: "김훈", category: "소설", status: "available", ownerName: "관리자" },
  { title: "하얼빈", author: "김훈", category: "소설", status: "available", ownerName: "관리자" },
  { title: "공무도하", author: "김훈", category: "소설", status: "available", ownerName: "관리자" },
  { title: "내 젊은 날의 숲", author: "김훈", category: "에세이", status: "available", ownerName: "관리자" },
  { title: "강산무진", author: "김훈", category: "에세이", status: "available", ownerName: "관리자" },
  { title: "저만치 혼자서", author: "김훈", category: "에세이", status: "available", ownerName: "관리자" },
  { title: "자전거 여행", author: "김훈", category: "에세이", status: "available", ownerName: "관리자" },
  { title: "라면을 끓이며", author: "김훈", category: "에세이", status: "available", ownerName: "관리자" },
  { title: "연필로 쓰기", author: "김훈", category: "에세이", status: "available", ownerName: "관리자" },

  // ─── 한국 소설 ───
  { title: "토지", author: "박경리", category: "소설", status: "available", ownerName: "관리자" },
  { title: "태백산맥", author: "조정래", category: "소설", status: "available", ownerName: "관리자" },
  { title: "아리랑", author: "조정래", category: "소설", status: "available", ownerName: "관리자" },
  { title: "난장이가 쏘아올린 작은 공", author: "조세희", category: "소설", status: "available", ownerName: "관리자" },
  { title: "무진기행", author: "김승옥", category: "소설", status: "available", ownerName: "관리자" },
  { title: "광장", author: "최인훈", category: "소설", status: "available", ownerName: "관리자" },
  { title: "아몬드", author: "손원평", category: "소설", status: "available", ownerName: "관리자" },
  { title: "82년생 김지영", author: "조남주", category: "소설", status: "available", ownerName: "관리자" },
  { title: "불편한 편의점", author: "김호연", category: "소설", status: "available", ownerName: "관리자" },
  { title: "달러구트 꿈 백화점", author: "이미예", category: "소설", status: "available", ownerName: "관리자" },

  // ─── 세계 문학 / 고전 ───
  { title: "인간실격", author: "다자이 오사무", category: "고전", status: "available", ownerName: "관리자" },
  { title: "데미안", author: "헤르만 헤세", category: "고전", status: "available", ownerName: "관리자" },
  { title: "노인과 바다", author: "어니스트 헤밍웨이", category: "고전", status: "available", ownerName: "관리자" },
  { title: "동물농장", author: "조지 오웰", category: "고전", status: "available", ownerName: "관리자" },
  { title: "1984", author: "조지 오웰", category: "고전", status: "available", ownerName: "관리자" },
  { title: "어린 왕자", author: "생텍쥐페리", category: "고전", status: "available", ownerName: "관리자" },
  { title: "죄와 벌", author: "도스토옙스키", category: "고전", status: "available", ownerName: "관리자" },
  { title: "위대한 개츠비", author: "스콧 피츠제럴드", category: "고전", status: "available", ownerName: "관리자" },
  { title: "삼국지", author: "나관중", category: "고전", status: "available", ownerName: "관리자" },
  { title: "연금술사", author: "파울로 코엘료", category: "소설", status: "available", ownerName: "관리자" },

  // ─── 인문 / 과학 / 에세이 ───
  { title: "총, 균, 쇠", author: "재레드 다이아몬드", category: "과학", status: "available", ownerName: "관리자" },
  { title: "사피엔스", author: "유발 하라리", category: "인문", status: "available", ownerName: "관리자" },
  { title: "코스모스", author: "칼 세이건", category: "과학", status: "available", ownerName: "관리자" },
  { title: "정의란 무엇인가", author: "마이클 샌델", category: "인문", status: "available", ownerName: "관리자" },
  { title: "논어", author: "공자", category: "인문", status: "available", ownerName: "관리자" },
  { title: "군주론", author: "니콜로 마키아벨리", category: "인문", status: "available", ownerName: "관리자" },
  { title: "손자병법", author: "손무", category: "인문", status: "available", ownerName: "관리자" },
  { title: "미움받을 용기", author: "기시미 이치로", category: "에세이", status: "available", ownerName: "관리자" },
];

export async function seedBooks50() {
  if (!db) {
    console.error('❌ Firestore가 초기화되지 않았습니다.');
    return;
  }

  const user = getAuth().currentUser;
  if (!user) {
    console.error('❌ 로그인이 필요합니다. 앱에서 먼저 로그인하세요.');
    return;
  }

  console.log(`📚 ${seedBooks.length}권의 도서를 등록합니다...`);

  let count = 0;
  for (const book of seedBooks) {
    await addDoc(collection(db, 'books'), {
      ownerUid: user.uid,
      title: book.title,
      author: book.author,
      publisher: '',
      isbn: '',
      category: book.category,
      coverUrl: '',
      status: book.status,
      currentLoanId: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    count++;
    if (count % 10 === 0 || count === seedBooks.length) {
      console.log(`  📖 ${count}/${seedBooks.length} 등록 완료`);
    }
  }

  console.log(`🎉 완료! ${count}권의 도서가 등록되었습니다.`);
}
