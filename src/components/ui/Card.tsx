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
      className={`rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm p-5 shadow-sm
        transition-all duration-300
        ${interactive ? 'cursor-pointer hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-0.5 hover:border-primary-200/50' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
}
