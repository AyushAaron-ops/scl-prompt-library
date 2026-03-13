interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200 dark:bg-gray-700 ${className}`}
      aria-hidden="true"
    />
  );
}

export function PromptCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-5 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-gray-700">
        <Skeleton className="h-8 w-28 rounded-lg" />
        <Skeleton className="h-8 w-36 rounded-lg" />
      </div>
    </div>
  );
}
