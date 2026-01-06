import type { ReactNode } from "react";

type CardProps = {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
};

export function Card({ children, className, onClick }: CardProps) {
    const isClickable = typeof onClick === "function";

    function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (!isClickable) return;

        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
        }
    }

    return (
        <div
            onClick={onClick}
            onKeyDown={onKeyDown}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            className={[
                "bg-surface border-2 border-primary/40 rounded-xl shadow-md",
                isClickable
                    ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    : "",
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
        <div className={["p-6 border-b border-border", className ?? ""].join(" ")}>
            {children}
        </div>
    );
}

export function CardContent({ children, className }: SectionProps) {
    return <div className={["p-6", className ?? ""].join(" ")}>{children}</div>;
}

export function CardFooter({ children, className }: SectionProps) {
    return (
        <div className={["p-6 border-t border-border", className ?? ""].join(" ")}>
            {children}
        </div>
    );
}
