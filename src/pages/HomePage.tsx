import { BookOpen, ArrowLeftRight, Users, TrendingUp, AlertCircle, ChevronRight, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Loading from '../components/ui/Loading';
import { useBooks } from '../hooks/useBooks';
import { useLoans } from '../hooks/useLoans';
import { useFriends } from '../hooks/useFriends';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();
  const { data: books, isLoading: booksLoading } = useBooks();
  const { data: loans, isLoading: loansLoading } = useLoans();
  const { data: friends, isLoading: friendsLoading } = useFriends();

  if (booksLoading || loansLoading || friendsLoading) return <Loading />;

  const availableCount = books.filter((b) => b.status === 'available').length;
  const loanedCount = books.filter((b) => b.status === 'loaned').length;
  const activeLoans = loans.filter((l) => l.status === 'loaned');

  const now = new Date();
  const overdueCount = activeLoans.filter((l) => {
    if (!l.dueAt) return false;
    return l.dueAt.toDate() < now;
  }).length;

  const stats = [
    {
      label: '보유중',
      value: availableCount,
      icon: BookOpen,
      gradient: 'from-emerald-500 to-emerald-600',
      shadow: 'shadow-emerald-500/20',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      to: '/books',
    },
    {
      label: '대여중',
      value: loanedCount,
      icon: ArrowLeftRight,
      gradient: 'from-blue-500 to-blue-600',
      shadow: 'shadow-blue-500/20',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      to: '/loans',
    },
    {
      label: '연체',
      value: overdueCount,
      icon: AlertCircle,
      gradient: 'from-red-500 to-red-600',
      shadow: 'shadow-red-500/20',
      bg: 'bg-red-50',
      text: 'text-red-700',
      to: '/loans',
    },
    {
      label: '친구',
      value: friends.length,
      icon: Users,
      gradient: 'from-violet-500 to-violet-600',
      shadow: 'shadow-violet-500/20',
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      to: '/friends',
    },
  ];

  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || '사용자';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 p-6 sm:p-8 text-white shadow-xl shadow-primary-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative">
          <p className="text-primary-200 text-sm font-medium">환영합니다</p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">
            {firstName}님의 서재
          </h1>
          <p className="mt-2 text-primary-100 text-sm">
            총 {books.length}권의 도서를 관리하고 있습니다
          </p>
          <Link
            to="/stats"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-sm font-semibold text-white transition-all duration-200 backdrop-blur-sm"
          >
            <BarChart3 className="h-4 w-4" />
            통계 대시보드
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card hover className="relative overflow-hidden group">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} shadow-lg ${s.shadow} mb-3`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">{s.label}</p>
              <ChevronRight className="absolute top-4 right-4 h-4 w-4 text-gray-300 group-hover:text-primary-400 transition-all duration-200 group-hover:translate-x-0.5" />
            </Card>
          </Link>
        ))}
      </div>

      {/* Active Loans */}
      {activeLoans.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-500" />
              현재 대여중
            </h2>
            <Link to="/loans" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
              전체보기 →
            </Link>
          </div>
          <div className="space-y-3">
            {activeLoans.slice(0, 5).map((loan) => {
              const book = books.find((b) => b.id === loan.bookId);
              const friend = friends.find((f) => f.id === loan.friendId);
              const isOverdue = loan.dueAt && loan.dueAt.toDate() < now;
              return (
                <Link key={loan.id} to={`/books/${loan.bookId}`}>
                  <Card hover className="flex items-center justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate">{book?.title ?? '—'}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        → {friend?.name ?? '—'}
                        {loan.dueAt && (
                          <span className={isOverdue ? ' text-red-500 font-semibold' : ' text-gray-400'}>
                            {' · '}
                            {loan.dueAt.toDate().toLocaleDateString('ko-KR')}
                            {isOverdue && ' (연체)'}
                          </span>
                        )}
                      </p>
                    </div>
                    <Badge color={isOverdue ? 'red' : 'blue'}>
                      {isOverdue ? '연체' : '대여중'}
                    </Badge>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
