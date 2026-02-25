import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import Badge from '../ui/Badge';
import type { Book } from '../../types';

interface Props {
  book: Book;
}

export default function BookCard({ book }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/books/${book.id}`)}
      className="group flex gap-4 rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm p-4 shadow-sm
        transition-all duration-300 cursor-pointer
        hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-0.5 hover:border-primary-200/50"
    >
      {book.coverUrl ? (
        <img
          src={book.coverUrl}
          alt={book.title}
          className="h-28 w-20 rounded-xl object-cover flex-shrink-0 shadow-sm ring-1 ring-black/5"
        />
      ) : (
        <div className="flex h-28 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 ring-1 ring-primary-100">
          <BookOpen className="h-7 w-7 text-primary-300" />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5">
        <div>
          <h3 className="font-bold text-gray-900 truncate group-hover:text-primary-700 transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-gray-500 truncate mt-0.5">{book.author}</p>
          {book.publisher && (
            <p className="text-xs text-gray-400 mt-0.5">{book.publisher}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge color={book.status === 'available' ? 'green' : 'red'}>
            {book.status === 'available' ? '보유중' : '대여중'}
          </Badge>
          {book.category && <Badge color="purple">{book.category}</Badge>}
        </div>
      </div>
      <div className="flex items-center flex-shrink-0">
        <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary-400 transition-all duration-200 group-hover:translate-x-0.5" />
      </div>
    </div>
  );
}
