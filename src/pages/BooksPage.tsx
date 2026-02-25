import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Search, X } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/books/BookCard';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import EmptyState from '../components/ui/EmptyState';

type Tab = 'all' | 'available' | 'loaned';

export default function BooksPage() {
  const { data: books, isLoading } = useBooks();
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');

  if (isLoading) return <Loading />;

  const filtered = books
    .filter((b) => {
      if (tab === 'available') return b.status === 'available';
      if (tab === 'loaned') return b.status === 'loaned';
      return true;
    })
    .filter((b) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.category?.toLowerCase().includes(q) ?? false)
      );
    });

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: '전체', count: books.length },
    { key: 'available', label: '보유중', count: books.filter((b) => b.status === 'available').length },
    { key: 'loaned', label: '대여중', count: books.filter((b) => b.status === 'loaned').length },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">서재</h1>
        <Link to="/books/new">
          <Button size="sm">
            <Plus className="h-4 w-4" /> 도서 등록
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="제목, 저자, 카테고리 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-white/60 py-3 pl-11 pr-10 text-sm
            transition-all duration-200
            focus:bg-white focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10
            hover:border-gray-300 placeholder:text-gray-400"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100 transition"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200
              ${tab === t.key
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                : 'bg-white/60 text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-sm border border-transparent hover:border-gray-200'
              }`}
          >
            {t.label}
            <span className={`text-[11px] rounded-md px-1.5 py-0.5 font-bold ${
              tab === t.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Book list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-10 w-10" />}
          title="도서가 없습니다"
          description={search ? '검색 결과가 없습니다' : '첫 번째 도서를 등록해보세요'}
          action={
            !search && (
              <Link to="/books/new">
                <Button size="sm">도서 등록</Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
