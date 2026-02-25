import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loanSchema, type LoanFormValues } from '../../lib/validators';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { Friend } from '../../types';

interface Props {
  friends: Friend[];
  onSubmit: (values: LoanFormValues) => void;
  loading?: boolean;
}

export default function LoanForm({ friends, onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanFormValues>({
    resolver: zodResolver(loanSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Select
        label="빌려줄 친구 *"
        placeholder="친구를 선택하세요"
        error={errors.friendId?.message}
        options={friends.map((f) => ({
          value: f.id,
          label: `${f.name} (${f.nickname})`,
        }))}
        {...register('friendId')}
      />
      <Input
        label="반납 예정일"
        type="date"
        {...register('dueAt')}
      />
      <Button type="submit" loading={loading} className="mt-2">
        대여하기
      </Button>
    </form>
  );
}
