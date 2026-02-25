import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  ArrowLeft,
  BookOpen,
  Trash2,
  Edit,
  Undo2,
  HandCoins,
  MessageSquareQuote,
  Clock,
  User,
} from 'lucide-react';
import { useBooks, useDeleteBook, useUpdateBook } from '../hooks/useBooks';
import { useLoans, useCreateLoan, useReturnLoan } from '../hooks/useLoans';
import { useFriends } from '../hooks/useFriends';
import { useNotes, useAddNote, useDeleteNote } from '../hooks/useNotes';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { SkeletonPulse } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import LoanForm from '../components/books/LoanForm';
import BookForm from '../components/books/BookForm';
import NoteForm from '../components/notes/NoteForm';
import type { LoanFormValues, BookFormValues, NoteFormValues } from '../lib/validators';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: books, isLoading: booksLoading } = useBooks();
  const { data: loans, isLoading: loansLoading } = useLoans(id);
  const { data: friends } = useFriends();
  const { data: notes, isLoading: notesLoading } = useNotes(id!);
  const createLoan = useCreateLoan();
  const returnLoan = useReturnLoan();
  const deleteBook = useDeleteBook();
  const updateBook = useUpdateBook();
  const addNote = useAddNote();
  const deleteNote = useDeleteNote();
  const toast = useToast();

  const [loanModal, setLoanModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  if (booksLoading || loansLoading || notesLoading) return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <SkeletonPulse className="h-10 w-10" />
        <SkeletonPulse className="h-7 w-48" />
      </div>
      <div className="flex gap-5 rounded-2xl border border-white/60 bg-white/60 backdrop-blur-sm p-5">
        <SkeletonPulse className="h-40 w-28 flex-shrink-0" />
        <div className="flex-1 space-y-3 py-1">
          <SkeletonPulse className="h-6 w-3/4" />
          <SkeletonPulse className="h-4 w-1/2" />
          <SkeletonPulse className="h-4 w-1/3" />
          <div className="flex gap-2 pt-2"><SkeletonPulse className="h-6 w-16 rounded-lg" /><SkeletonPulse className="h-6 w-14 rounded-lg" /></div>
        </div>
      </div>
      <div className="flex gap-2.5"><SkeletonPulse className="h-10 w-24" /><SkeletonPulse className="h-10 w-20" /><SkeletonPulse className="h-10 w-16" /></div>
    </div>
  );

  const book = books.find((b) => b.id === id);
  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
          <BookOpen className="h-8 w-8 text-gray-300" />
        </div>
        <p className="text-gray-500 font-medium">도서를 찾을 수 없습니다</p>
        <Button variant="ghost" onClick={() => navigate('/books')} className="mt-4">
          목록으로
        </Button>
      </div>
    );
  }

  const activeLoan = loans.find((l) => l.status === 'loaned');
  const loanedFriend = activeLoan
    ? friends.find((f) => f.id === activeLoan.friendId)
    : null;

  const handleLoan = async (values: LoanFormValues) => {
    await createLoan.mutateAsync({
      bookId: book.id,
      friendId: values.friendId,
      dueAt: values.dueAt || undefined,
    });
    setLoanModal(false);
    toast.success('대여가 시작되었습니다');
  };

  const handleReturn = async () => {
    if (!activeLoan) return;
    await returnLoan.mutateAsync({ loanId: activeLoan.id, bookId: book.id });
    toast.success('반납이 완료되었습니다');
  };

  const handleEdit = async (values: BookFormValues) => {
    await updateBook.mutateAsync({ id: book.id, ...values });
    setEditModal(false);
    toast.success('도서 정보가 수정되었습니다');
  };

  const handleDelete = async () => {
    if (!confirm('정말 이 도서를 삭제하시겠습니까?')) return;
    await deleteBook.mutateAsync(book.id);
    toast.success('도서가 삭제되었습니다');
    navigate('/books');
  };

  const handleNoteSubmit = async (values: NoteFormValues) => {
    await addNote.mutateAsync({ bookId: book.id, ...values });
    toast.success('독후감이 등록되었습니다');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 border border-white/60 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold truncate text-gray-900">{book.title}</h1>
      </div>

      {/* Book Info Card */}
      <Card className="flex gap-5">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-40 w-28 rounded-xl object-cover flex-shrink-0 shadow-md ring-1 ring-black/5"
          />
        ) : (
          <div className="flex h-40 w-28 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 ring-1 ring-primary-100">
            <BookOpen className="h-8 w-8 text-primary-300" />
          </div>
        )}
        <div className="flex flex-col justify-between min-w-0 py-1">
          <div>
            <h2 className="text-xl font-bold text-gray-900 truncate">{book.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{book.author}</p>
            {book.publisher && <p className="text-xs text-gray-400 mt-0.5">{book.publisher}</p>}
            {book.isbn && <p className="text-xs text-gray-400 mt-0.5 font-mono">ISBN: {book.isbn}</p>}
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <Badge color={book.status === 'available' ? 'green' : 'red'}>
              {book.status === 'available' ? '보유중' : '대여중'}
            </Badge>
            {book.category && <Badge color="purple">{book.category}</Badge>}
          </div>
        </div>
      </Card>

      {/* Active Loan Status */}
      {activeLoan && loanedFriend && (
        <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/20">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-blue-800">
                {loanedFriend.name} ({loanedFriend.nickname})님에게 대여중
              </p>
              <p className="text-xs text-blue-600/70 mt-0.5 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {activeLoan.loanedAt?.toDate
                  ? format(activeLoan.loanedAt.toDate(), 'yyyy.MM.dd', { locale: ko })
                  : '—'}
                {activeLoan.dueAt && (
                  <> · 반납 예정: {format(activeLoan.dueAt.toDate(), 'yyyy.MM.dd', { locale: ko })}</>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2.5">
        {book.status === 'available' ? (
          <Button onClick={() => setLoanModal(true)}>
            <HandCoins className="h-4 w-4" /> 대여하기
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={handleReturn}
            loading={returnLoan.isPending}
          >
            <Undo2 className="h-4 w-4" /> 반납하기
          </Button>
        )}
        <Button variant="ghost" onClick={() => setNoteOpen(!noteOpen)}>
          <MessageSquareQuote className="h-4 w-4" /> 독후감
        </Button>
        <Button variant="ghost" onClick={() => setEditModal(true)}>
          <Edit className="h-4 w-4" /> 수정
        </Button>
        <Button variant="danger" size="sm" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" /> 삭제
        </Button>
      </div>

      {/* Modals */}
      <Modal open={loanModal} onClose={() => setLoanModal(false)} title="대여하기">
        <LoanForm friends={friends} onSubmit={handleLoan} loading={createLoan.isPending} />
      </Modal>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="도서 수정">
        <BookForm
          defaultValues={{
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            isbn: book.isbn,
            category: book.category,
          }}
          onSubmit={handleEdit}
          loading={updateBook.isPending}
          submitLabel="수정 저장"
        />
      </Modal>

      {/* Notes Section */}
      {noteOpen && (
        <section className="space-y-4 animate-slide-up">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-primary-500" />
            독후감
          </h2>
          <Card>
            <NoteForm onSubmit={handleNoteSubmit} loading={addNote.isPending} />
          </Card>

          {notes.length > 0 && (
            <div className="space-y-3">
              {notes.map((note) => (
                <Card key={note.id} className="relative group">
                  {note.quote && (
                    <div className="mb-3 rounded-xl bg-primary-50/50 border border-primary-100/50 p-3">
                      <p className="text-sm italic text-primary-700 leading-relaxed">
                        "{note.quote}"
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                  <p className="mt-3 text-xs text-gray-400 font-medium">
                    {note.createdAt?.toDate
                      ? format(note.createdAt.toDate(), 'yyyy.MM.dd HH:mm', { locale: ko })
                      : '—'}
                  </p>
                  <button
                    onClick={() => deleteNote.mutate(note.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200
                      rounded-xl p-2 hover:bg-red-50 text-gray-300 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Loan History */}
      {loans.length > 0 && (
        <section className="animate-fade-in">
          <h2 className="mb-4 text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary-500" />
            대여 이력
          </h2>
          <div className="space-y-3">
            {loans.map((loan) => {
              const friend = friends.find((f) => f.id === loan.friendId);
              return (
                <Card key={loan.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {friend?.name ?? '—'}
                      <span className="text-gray-400 font-normal"> ({friend?.nickname ?? ''})</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {loan.loanedAt?.toDate
                        ? format(loan.loanedAt.toDate(), 'yyyy.MM.dd', { locale: ko })
                        : '—'}
                      {loan.returnedAt?.toDate && (
                        <>
                          {' → '}
                          {format(loan.returnedAt.toDate(), 'yyyy.MM.dd', { locale: ko })}
                        </>
                      )}
                    </p>
                  </div>
                  <Badge color={loan.status === 'loaned' ? 'red' : 'green'}>
                    {loan.status === 'loaned' ? '대여중' : '반납됨'}
                  </Badge>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
