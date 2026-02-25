import {
  BarChart3,
  BookOpen,
  ArrowLeftRight,
  Users,
  AlertTriangle,
  Crown,
  TrendingUp,
  Calendar,
  PieChart,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Loading from '../components/ui/Loading';
import { useBooks } from '../hooks/useBooks';
import { useLoans } from '../hooks/useLoans';
import { useFriends } from '../hooks/useFriends';
import { useAuth } from '../hooks/useAuth';

/* ─── helpers ─── */
function percent(part: number, total: number) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

const COLORS = [
  { bar: 'from-primary-500 to-primary-600', text: 'text-primary-600', bg: 'bg-primary-50' },
  { bar: 'from-emerald-500 to-emerald-600', text: 'text-emerald-600', bg: 'bg-emerald-50' },
  { bar: 'from-blue-500 to-blue-600', text: 'text-blue-600', bg: 'bg-blue-50' },
  { bar: 'from-amber-500 to-amber-600', text: 'text-amber-600', bg: 'bg-amber-50' },
  { bar: 'from-rose-500 to-rose-600', text: 'text-rose-600', bg: 'bg-rose-50' },
  { bar: 'from-violet-500 to-violet-600', text: 'text-violet-600', bg: 'bg-violet-50' },
  { bar: 'from-cyan-500 to-cyan-600', text: 'text-cyan-600', bg: 'bg-cyan-50' },
  { bar: 'from-orange-500 to-orange-600', text: 'text-orange-600', bg: 'bg-orange-50' },
];

const MONTH_LABELS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

export default function StatsPage() {
  const { user } = useAuth();
  const { data: books, isLoading: booksLoading } = useBooks();
  const { data: loans, isLoading: loansLoading } = useLoans();
  const { data: friends, isLoading: friendsLoading } = useFriends();
  // notes need bookId — grab all books' notes: we'll pass a dummy bookId to get global stats
  // Actually useNotes requires bookId; let's compute from loans/books instead.

  if (booksLoading || loansLoading || friendsLoading) return <Loading />;

  const now = new Date();
  const availableBooks = books.filter((b) => b.status === 'available');
  const loanedBooks = books.filter((b) => b.status === 'loaned');
  const activeLoans = loans.filter((l) => l.status === 'loaned');
  const returnedLoans = loans.filter((l) => l.status === 'returned');
  const overdueLoans = activeLoans.filter((l) => l.dueAt && l.dueAt.toDate() < now);

  /* ── Category Distribution ── */
  const categoryMap = new Map<string, number>();
  books.forEach((b) => {
    const cat = b.category || '미분류';
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  });
  const categories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count], i) => ({
      name,
      count,
      color: COLORS[i % COLORS.length],
      pct: percent(count, books.length),
    }));

  /* ── Monthly Loan Activity (current year) ── */
  const currentYear = now.getFullYear();
  const monthlyLoans = Array(12).fill(0);
  const monthlyReturns = Array(12).fill(0);
  loans.forEach((l) => {
    const loanDate = l.loanedAt?.toDate?.();
    if (loanDate && loanDate.getFullYear() === currentYear) {
      monthlyLoans[loanDate.getMonth()]++;
    }
    const returnDate = l.returnedAt?.toDate?.();
    if (returnDate && returnDate.getFullYear() === currentYear) {
      monthlyReturns[returnDate.getMonth()]++;
    }
  });
  const maxMonthly = Math.max(...monthlyLoans, ...monthlyReturns, 1);

  /* ── Top Borrowers ── */
  const borrowerMap = new Map<string, number>();
  loans.forEach((l) => {
    borrowerMap.set(l.friendId, (borrowerMap.get(l.friendId) || 0) + 1);
  });
  const topBorrowers = Array.from(borrowerMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([friendId, count], rank) => {
      const friend = friends.find((f) => f.id === friendId);
      return { name: friend?.name ?? '—', nickname: friend?.nickname ?? '', count, rank };
    });
  const maxBorrowerCount = topBorrowers[0]?.count ?? 1;

  /* ── Loan Duration Stats ── */
  const durations: number[] = [];
  returnedLoans.forEach((l) => {
    const start = l.loanedAt?.toDate?.();
    const end = l.returnedAt?.toDate?.();
    if (start && end) {
      durations.push(Math.round((end.getTime() - start.getTime()) / 86400000));
    }
  });
  const avgDuration = durations.length > 0
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : 0;
  const maxDuration = Math.max(...durations, 0);
  const minDuration = durations.length > 0 ? Math.min(...durations) : 0;

  /* ── Overview cards ── */
  const overviewCards = [
    { label: '전체 도서', value: books.length, icon: BookOpen, gradient: 'from-primary-500 to-primary-600', shadow: 'shadow-primary-500/20' },
    { label: '보유중', value: availableBooks.length, icon: BookOpen, gradient: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/20' },
    { label: '대여중', value: loanedBooks.length, icon: ArrowLeftRight, gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
    { label: '연체', value: overdueLoans.length, icon: AlertTriangle, gradient: 'from-red-500 to-red-600', shadow: 'shadow-red-500/20' },
    { label: '총 대여 횟수', value: loans.length, icon: TrendingUp, gradient: 'from-amber-500 to-amber-600', shadow: 'shadow-amber-500/20' },
    { label: '등록 친구', value: friends.length, icon: Users, gradient: 'from-violet-500 to-violet-600', shadow: 'shadow-violet-500/20' },
  ];

  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || '사용자';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
          <BarChart3 className="h-6 w-6 text-primary-500" />
          통계 대시보드
        </h1>
        <p className="text-sm text-gray-500 mt-1">{firstName}님의 서재 현황을 한눈에 확인하세요</p>
      </div>

      {/* ─── Overview Grid ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {overviewCards.map((c) => (
          <Card key={c.label} className="relative overflow-hidden">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} shadow-lg ${c.shadow} mb-3`}>
              <c.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{c.value}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{c.label}</p>
          </Card>
        ))}
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Category Distribution */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <PieChart className="h-5 w-5 text-primary-500" />
            <h2 className="text-base font-bold text-gray-900">카테고리 분포</h2>
          </div>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">등록된 도서가 없습니다</p>
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    <span className="text-xs font-semibold text-gray-500">
                      {cat.count}권 <span className="text-gray-400">({cat.pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${cat.color.bar} transition-all duration-700 ease-out`}
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Top Borrowers */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <Crown className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-bold text-gray-900">최다 대출자 TOP 5</h2>
          </div>
          {topBorrowers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">대여 기록이 없습니다</p>
          ) : (
            <div className="space-y-3">
              {topBorrowers.map((b) => (
                <div key={b.name + b.nickname} className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold
                    ${b.rank === 0
                      ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-sm shadow-amber-400/30'
                      : b.rank === 1
                        ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                        : b.rank === 2
                          ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white'
                          : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {b.rank + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {b.name}
                        <span className="text-gray-400 font-normal text-xs ml-1">({b.nickname})</span>
                      </p>
                      <span className="text-xs font-bold text-primary-600">{b.count}회</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-700 ease-out"
                        style={{ width: `${percent(b.count, maxBorrowerCount)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ─── Monthly Activity Chart ─── */}
      <Card>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-5 w-5 text-primary-500" />
          <h2 className="text-base font-bold text-gray-900">{currentYear}년 월별 대여 활동</h2>
        </div>
        <div className="flex items-center gap-4 mb-5 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gradient-to-r from-primary-400 to-primary-600" />
            대여
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gradient-to-r from-emerald-400 to-emerald-600" />
            반납
          </span>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-1.5 sm:gap-3 h-40 sm:h-52">
          {MONTH_LABELS.map((label, i) => {
            const loanH = (monthlyLoans[i] / maxMonthly) * 100;
            const returnH = (monthlyReturns[i] / maxMonthly) * 100;
            const isCurrentMonth = i === now.getMonth();
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-500 font-semibold whitespace-nowrap -mb-0.5">
                  {monthlyLoans[i]}/{monthlyReturns[i]}
                </div>
                <div className="flex gap-[2px] sm:gap-1 items-end flex-1 w-full">
                  {/* Loan bar */}
                  <div className="flex-1 flex flex-col justify-end h-full">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-primary-500 to-primary-400 transition-all duration-500 ease-out min-h-[2px]"
                      style={{ height: `${Math.max(loanH, monthlyLoans[i] > 0 ? 8 : 2)}%` }}
                    />
                  </div>
                  {/* Return bar */}
                  <div className="flex-1 flex flex-col justify-end h-full">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-500 ease-out min-h-[2px]"
                      style={{ height: `${Math.max(returnH, monthlyReturns[i] > 0 ? 8 : 2)}%` }}
                    />
                  </div>
                </div>
                <span className={`text-[10px] sm:text-xs font-medium ${isCurrentMonth ? 'text-primary-600 font-bold' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ─── Loan Duration Stats ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="text-center">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 mb-3">
            <Calendar className="h-6 w-6 text-primary-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgDuration}<span className="text-base font-medium text-gray-400 ml-1">일</span></p>
          <p className="text-xs font-medium text-gray-500 mt-1">평균 대여 기간</p>
        </Card>
        <Card className="text-center">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 mb-3">
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{minDuration}<span className="text-base font-medium text-gray-400 ml-1">일</span></p>
          <p className="text-xs font-medium text-gray-500 mt-1">최단 대여 기간</p>
        </Card>
        <Card className="text-center">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 mb-3">
            <ArrowLeftRight className="h-6 w-6 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{maxDuration}<span className="text-base font-medium text-gray-400 ml-1">일</span></p>
          <p className="text-xs font-medium text-gray-500 mt-1">최장 대여 기간</p>
        </Card>
      </div>

      {/* ─── Book Status Ring Chart ─── */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <PieChart className="h-5 w-5 text-primary-500" />
          <h2 className="text-base font-bold text-gray-900">도서 현황</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Visual ring */}
          <div className="relative flex-shrink-0">
            <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
              <circle cx="80" cy="80" r="65" fill="none" stroke="#f1f5f9" strokeWidth="16" />
              {books.length > 0 && (
                <>
                  <circle
                    cx="80" cy="80" r="65" fill="none"
                    stroke="url(#gradGreen)" strokeWidth="16"
                    strokeDasharray={`${(availableBooks.length / books.length) * 408.4} 408.4`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                  <circle
                    cx="80" cy="80" r="65" fill="none"
                    stroke="url(#gradBlue)" strokeWidth="16"
                    strokeDasharray={`${(loanedBooks.length / books.length) * 408.4} 408.4`}
                    strokeDashoffset={`${-(availableBooks.length / books.length) * 408.4}`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </>
              )}
              <defs>
                <linearGradient id="gradGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-gray-900">{books.length}</p>
              <p className="text-xs text-gray-500 font-medium">전체</p>
            </div>
          </div>
          {/* Legend */}
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-md bg-gradient-to-r from-emerald-500 to-emerald-600 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">보유중</span>
                  <span className="text-sm font-bold text-gray-900">{availableBooks.length}권</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-700" style={{ width: `${percent(availableBooks.length, books.length)}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">대여중</span>
                  <span className="text-sm font-bold text-gray-900">{loanedBooks.length}권</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700" style={{ width: `${percent(loanedBooks.length, books.length)}%` }} />
                </div>
              </div>
            </div>
            {overdueLoans.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-md bg-gradient-to-r from-red-500 to-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-600">연체</span>
                    <span className="text-sm font-bold text-red-600">{overdueLoans.length}권</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
