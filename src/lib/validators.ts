import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요'),
  author: z.string().min(1, '저자를 입력하세요'),
  publisher: z.string().optional(),
  isbn: z.string().optional(),
  category: z.string().optional(),
});

export type BookFormValues = z.infer<typeof bookSchema>;

export const friendSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요'),
  nickname: z.string().min(1, '닉네임을 입력하세요'),
  phone: z.string().optional(),
  memo: z.string().optional(),
});

export type FriendFormValues = z.infer<typeof friendSchema>;

export const loanSchema = z.object({
  friendId: z.string().min(1, '친구를 선택하세요'),
  dueAt: z.string().optional(),
});

export type LoanFormValues = z.infer<typeof loanSchema>;

export const noteSchema = z.object({
  content: z.string().min(1, '내용을 입력하세요'),
  quote: z.string().optional(),
});

export type NoteFormValues = z.infer<typeof noteSchema>;
