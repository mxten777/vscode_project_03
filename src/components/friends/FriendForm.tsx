import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { friendSchema, type FriendFormValues } from '../../lib/validators';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

interface Props {
  defaultValues?: Partial<FriendFormValues>;
  onSubmit: (values: FriendFormValues) => void;
  loading?: boolean;
  submitLabel?: string;
}

export default function FriendForm({
  defaultValues,
  onSubmit,
  loading,
  submitLabel = '저장',
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FriendFormValues>({
    resolver: zodResolver(friendSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="이름 *"
        placeholder="친구 이름"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="닉네임 *"
        placeholder="닉네임"
        error={errors.nickname?.message}
        {...register('nickname')}
      />
      <Input
        label="연락처"
        placeholder="전화번호 (선택)"
        {...register('phone')}
      />
      <Textarea label="메모" placeholder="메모 (선택)" {...register('memo')} />
      <Button type="submit" loading={loading} className="mt-2">
        {submitLabel}
      </Button>
    </form>
  );
}
