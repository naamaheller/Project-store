'use client';
// קומפוננטת Skeleton להצגת "שלד טעינה" בזמן המתנה לנתונים.
// משפרת חוויית משתמש במקום מסך ריק או spinner.

type SkeletonProps = {
    className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={['animate-pulse rounded-md bg-border/60', className ?? ''].join(' ')}
        />
    );
}
