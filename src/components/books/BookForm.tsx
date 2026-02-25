import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookSchema, type BookFormValues } from '../../lib/validators';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface Props {
  defaultValues?: Partial<BookFormValues>;
  onSubmit: (values: BookFormValues) => void;
  loading?: boolean;
  submitLabel?: string;
}

export default function BookForm({
  defaultValues,
  onSubmit,
  loading,
  submitLabel = '저장',
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="제목 *"
        placeholder="도서 제목"
        error={errors.title?.message}
        {...register('title')}
      />
      <Input
        label="저자 *"
        placeholder="저자명"
        error={errors.author?.message}
        {...register('author')}
      />
      <Input
        label="출판사"
        placeholder="출판사 (선택)"
        {...register('publisher')}
      />
      <Input
        label="ISBN"
        placeholder="ISBN (선택)"
        {...register('isbn')}
      />
      <Input
        label="카테고리"
        placeholder="예: 소설, 과학, 자기계발"
        {...register('category')}
      />
      <Button type="submit" loading={loading} className="mt-2">
        {submitLabel}
      </Button>
    </form>
  );
}
