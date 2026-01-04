import type { ReactNode } from 'react';
// קומפוננטת Card לחלוקת תוכן לאזורים ברורים: Header, Content ו־Footer.
// משמשת כקונטיינר אחיד לעמודים וטפסים.

type CardProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export function Card({ children, className, onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={[
                'bg-surface border border-border rounded-lg shadow-sm',
                className ?? '',
            ].join(' ')}
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
