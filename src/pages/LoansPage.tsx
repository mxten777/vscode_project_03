import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowLeftRight, ArrowRight, AlertTriangle, Clock } from 'lucide-react';
import { useLoans } from '../hooks/useLoans';
import { useBooks } from '../hooks/useBooks';
import { useFriends } from '../hooks/useFriends';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { SkeletonList } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

type Tab = 'all' | 'loaned' | 'returned';

export default function LoansPage() {
  const { data: loans, isLoading: loansLoading } = useLoans();
  const { data: books, isLoading: booksLoading } = useBooks();
  const { data: friends } = useFriends();
  const [tab, setTab] = useState<Tab>('all');

  if (loansLoading || booksLoading) return (
    <div className="space-y-6 animate-fade-in">
      <div><div className="h-8 w-28" /><div className="h-4 w-40 mt-1" /></div>
      <SkeletonList count={5} type="card" />
    </div>
  );

  const filtered = loans.filter((l) => {
    if (tab === 'loaned') return l.status === 'loaned';
    if (tab === 'returned') return l.status === 'returned';
    return true;
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: `전체 (${loans.length})` },
    { key: 'loaned', label: `대여중 (${loans.filter((l) => l.status === 'loaned').length})` },
    { key: 'returned', label: `반납됨 (${loans.filter((l) => l.status === 'returned').length})` },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대여 기록</h1>
        <p className="text-sm text-gray-500 mt-1">도서 대여 및 반납 이력</p>
      </div>

      {/* Pill Tabs */}
      <div className="flex gap-2 bg-white/50 rounded-2xl p-1.5 border border-white/60 shadow-sm w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200
              ${
                tab === t.key
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/80'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ArrowLeftRight className="h-12 w-12" />}
          title="대여 기록이 없습니다"
          description="도서를 대여하면 여기에 기록됩니다"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((loan, i) => {
            const book = books.find((b) => b.id === loan.bookId);
            const friend = friends.find((f) => f.id === loan.friendId);
            const isOverdue =
              loan.status === 'loaned' &&
              loan.dueAt &&
              loan.dueAt.toDate() < new Date();

            return (
              <Link key={loan.id} to={`/books/${loan.bookId}`}>
                <Card
                  hover
                  className="flex items-center gap-4 mb-3"
                  style={{ animationDelay: `${i * 50}ms` } as React.CSSProperties}
                >
                  {/* Status indicator */}
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl shadow-lg ${
                    loan.status === 'loaned'
                      ? isOverdue
                        ? 'bg-red-500 shadow-red-500/20'
                        : 'bg-blue-500 shadow-blue-500/20'
                      : 'bg-emerald-500 shadow-emerald-500/20'
                  }`}>
                    {isOverdue ? (
                      <AlertTriangle className="h-5 w-5 text-white" />
                    ) : loan.status === 'loaned' ? (
                      <Clock className="h-5 w-5 text-white" />
                    ) : (
                      <ArrowLeftRight className="h-5 w-5 text-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">{book?.title ?? '—'}</p>
                    <p className="text-sm text-gray-500">
                      <ArrowRight className="inline h-3 w-3 -mt-0.5" /> {friend?.name ?? '—'}
                      <span className="text-gray-400"> ({friend?.nickname ?? ''})</span>
                    </p>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 flex-wrap">
                      <span>
                        {loan.loanedAt?.toDate
                          ? format(loan.loanedAt.toDate(), 'yyyy.MM.dd', { locale: ko })
                          : '—'}
                      </span>
                      {loan.returnedAt?.toDate && (
                        <span>
                          → {format(loan.returnedAt.toDate(), 'yyyy.MM.dd', { locale: ko })}
                        </span>
                      )}
                      {loan.dueAt && loan.status === 'loaned' && (
                        <span className={`ml-1 ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                          · 반납예정: {format(loan.dueAt.toDate(), 'yyyy.MM.dd', { locale: ko })}
                          {isOverdue && ' (연체)'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Badge */}
                  <Badge color={loan.status === 'loaned' ? (isOverdue ? 'red' : 'blue') : 'green'}>
                    {loan.status === 'loaned' ? (isOverdue ? '연체' : '대여중') : '반납됨'}
                  </Badge>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
