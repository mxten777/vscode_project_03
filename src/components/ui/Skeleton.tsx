/**
 * Skeleton placeholder components for loading states
 */

export function SkeletonPulse({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-gradient-to-r from-gray-100 via-gray-200/70 to-gray-100 bg-[length:200%_100%] animate-shimmer ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/60 bg-white/60 backdrop-blur-sm p-4 shadow-sm">
      <SkeletonPulse className="h-28 w-20 flex-shrink-0" />
      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="space-y-2.5">
          <SkeletonPulse className="h-4 w-3/4" />
          <SkeletonPulse className="h-3 w-1/2" />
          <SkeletonPulse className="h-3 w-1/3" />
        </div>
        <div className="flex gap-2">
          <SkeletonPulse className="h-5 w-14 rounded-lg" />
          <SkeletonPulse className="h-5 w-12 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-sm p-5 shadow-sm">
      <SkeletonPulse className="h-10 w-10 mb-3" />
      <SkeletonPulse className="h-8 w-16 mb-1" />
      <SkeletonPulse className="h-3 w-12" />
    </div>
  );
}

export function SkeletonFriendCard() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/60 bg-white/60 backdrop-blur-sm p-5 shadow-sm">
      <SkeletonPulse className="h-11 w-11 flex-shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <SkeletonPulse className="h-4 w-32" />
        <SkeletonPulse className="h-3 w-24" />
      </div>
      <div className="flex gap-1">
        <SkeletonPulse className="h-8 w-8 rounded-xl" />
        <SkeletonPulse className="h-8 w-8 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 4, type = 'card' }: { count?: number; type?: 'card' | 'stat' | 'friend' }) {
  const Component = type === 'stat' ? SkeletonStatCard : type === 'friend' ? SkeletonFriendCard : SkeletonCard;
  return (
    <div className={type === 'stat' ? 'grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4' : 'space-y-3'}>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}
