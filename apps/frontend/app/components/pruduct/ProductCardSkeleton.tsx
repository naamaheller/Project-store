import { Card, CardContent, CardFooter } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="w-full rounded-lg border border-border bg-surface p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-32 sm:h-40 md:h-44 w-full rounded-md" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-9 w-full mt-2" />
      </div>
    </div>
  );
}

