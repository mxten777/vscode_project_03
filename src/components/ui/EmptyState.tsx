import type { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      {icon && (
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-50 via-primary-100/30 to-primary-50 border border-primary-100/30 animate-float">
          <div className="text-primary-300">{icon}</div>
        </div>
      )}
      <h3 className="text-lg font-bold text-gray-700">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-gray-400 max-w-xs leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
