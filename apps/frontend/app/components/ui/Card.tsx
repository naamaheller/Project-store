import type { ReactNode } from 'react';
// קומפוננטת Card לחלוקת תוכן לאזורים ברורים: Header, Content ו־Footer.
// משמשת כקונטיינר אחיד לעמודים וטפסים.

type CardProps = {
    children: ReactNode;
    className?: string;
};

export function Card({ children, className }: CardProps) {
    return (
        <div
            className={[
                "bg-surface border-2 border-primary/40 rounded-xl shadow-md",
                className ?? "",
            ].join(" ")}
        >
            {children}
        </div>
    );
}

type SectionProps = {
    children: ReactNode;
    className?: string;
};

export function CardHeader({ children, className }: SectionProps) {
    return (
        <div className={['p-6 border-b border-border', className ?? ''].join(' ')}>
            {children}
        </div>
    );
}

export function CardContent({ children, className }: SectionProps) {
    return <div className={['p-6', className ?? ''].join(' ')}>{children}</div>;
}

export function CardFooter({ children, className }: SectionProps) {
    return (
        <div className={['p-6 border-t border-border', className ?? ''].join(' ')}>
            {children}
        </div>
    );
}
