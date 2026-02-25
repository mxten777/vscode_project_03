import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { noteSchema, type NoteFormValues } from '../../lib/validators';
import Textarea from '../ui/Textarea';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface Props {
  onSubmit: (values: NoteFormValues) => void;
  loading?: boolean;
}

export default function NoteForm({ onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
  });

  const handleFormSubmit = (values: NoteFormValues) => {
    onSubmit(values);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-3">
      <Input
        label="기억나는 문구"
        placeholder="인상 깊었던 문구 (선택)"
        {...register('quote')}
      />
      <Textarea
        label="감상/메모 *"
        placeholder="짧은 독후감이나 메모를 남겨보세요"
        error={errors.content?.message}
        {...register('content')}
      />
      <Button type="submit" loading={loading} size="sm">
        독후감 저장
      </Button>
    </form>
  );
}
