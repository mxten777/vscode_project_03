import type { ReactNode } from 'react';

const colors = {
  green:
    'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60',
  red:
    'bg-red-50 text-red-700 ring-1 ring-red-200/60',
  blue:
    'bg-blue-50 text-blue-700 ring-1 ring-blue-200/60',
  yellow:
    'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60',
  gray:
    'bg-gray-50 text-gray-600 ring-1 ring-gray-200/60',
  purple:
    'bg-primary-50 text-primary-700 ring-1 ring-primary-200/60',
} as const;

interface Props {
  color?: keyof typeof colors;
  children: ReactNode;
}

export default function Badge({ color = 'gray', children }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold tracking-wide ${colors[color]}`}
    >
      {children}
    </span>
  );
}
