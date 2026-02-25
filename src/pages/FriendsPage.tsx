import { useState } from 'react';
import { Plus, Users, Trash2, Edit, Phone, StickyNote } from 'lucide-react';
import { useFriends, useAddFriend, useUpdateFriend, useDeleteFriend } from '../hooks/useFriends';
import FriendForm from '../components/friends/FriendForm';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Loading from '../components/ui/Loading';
import EmptyState from '../components/ui/EmptyState';
import type { FriendFormValues } from '../lib/validators';
import type { Friend } from '../types';

export default function FriendsPage() {
  const { data: friends, isLoading } = useFriends();
  const addFriend = useAddFriend();
  const updateFriend = useUpdateFriend();
  const deleteFriend = useDeleteFriend();

  const [addModal, setAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Friend | null>(null);

  if (isLoading) return <Loading />;

  const handleAdd = async (values: FriendFormValues) => {
    await addFriend.mutateAsync(values);
    setAddModal(false);
  };

  const handleEdit = async (values: FriendFormValues) => {
    if (!editTarget) return;
    await updateFriend.mutateAsync({ id: editTarget.id, ...values });
    setEditTarget(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 친구를 삭제하시겠습니까?')) return;
    await deleteFriend.mutateAsync(id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">친구 관리</h1>
          <p className="text-sm text-gray-500 mt-1">{friends.length}명의 친구</p>
        </div>
        <Button size="sm" onClick={() => setAddModal(true)}>
          <Plus className="h-4 w-4" /> 친구 추가
        </Button>
      </div>

      {friends.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="등록된 친구가 없습니다"
          description="친구를 추가해보세요"
          action={
            <Button size="sm" onClick={() => setAddModal(true)}>
              친구 추가
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {friends.map((f, i) => (
            <Card
              key={f.id}
              className="flex items-center gap-4"
              style={{ animationDelay: `${i * 50}ms` } as React.CSSProperties}
            >
              {/* Avatar */}
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-500/20">
                {f.name.charAt(0)}
              </div>
              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900">
                  {f.name}
                  <span className="ml-1.5 text-sm font-normal text-gray-400">({f.nickname})</span>
                </p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                  {f.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {f.phone}
                    </span>
                  )}
                  {f.memo && (
                    <span className="flex items-center gap-1 truncate">
                      <StickyNote className="h-3 w-3" />
                      {f.memo}
                    </span>
                  )}
                </div>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setEditTarget(f)}
                  className="rounded-xl p-2 text-gray-400 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="rounded-xl p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="친구 추가">
        <FriendForm onSubmit={handleAdd} loading={addFriend.isPending} submitLabel="추가" />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="친구 수정"
      >
        {editTarget && (
          <FriendForm
            defaultValues={{
              name: editTarget.name,
              nickname: editTarget.nickname,
              phone: editTarget.phone,
              memo: editTarget.memo,
            }}
            onSubmit={handleEdit}
            loading={updateFriend.isPending}
            submitLabel="수정 저장"
          />
        )}
      </Modal>
    </div>
  );
}
