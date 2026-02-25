import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  style?: React.CSSProperties;
}

export default function Card({ children, className = '', onClick, hover, style }: Props) {
  const interactive = onClick || hover;
  return (
    <div
      onClick={onClick}
      style={style}
      className={`rounded-2xl border border-white/50 bg-white/80 backdrop-blur-sm p-5 shadow-sm
        transition-all duration-300
        ${interactive ? 'cursor-pointer hover:shadow-xl hover:shadow-primary-500/8 hover:-translate-y-1 hover:border-primary-200/60 active:scale-[0.98]' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
}
