'use client';

import { Button } from './Button';

type PaginationProps = {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (nextPage: number) => void;
    onPageSizeChange?: (nextPageSize: number) => void;
    pageSizeOptions?: number[];
    className?: string;
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export function Pagination({
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20, 50],
    className,
}: PaginationProps) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = clamp(page, 1, totalPages);

    const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const to = Math.min(total, safePage * pageSize);

    const go = (p: number) => onPageChange(clamp(p, 1, totalPages));

    return (
        <div
            className={[
                'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
                'text-sm text-text-muted',
                className ?? '',
            ].join(' ')}
            dir="rtl"
        >
            <div className="flex items-center gap-2">
                <span>
                    מציג {from}-{to} מתוך {total}
                </span>

                {onPageSizeChange ? (
                    <div className="flex items-center gap-2">
                        <span className="text-text-muted">|</span>
                        <label className="text-text-muted">שורות בעמוד:</label>
                        <select
                            className={[
                                'rounded-md px-2 py-1',
                                'bg-background text-text border border-border',
                                'focus:outline-none focus:ring-2 focus:ring-primary-soft focus:border-primary',
                            ].join(' ')}
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        >
                            {pageSizeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : null}
            </div>

            <div className="flex items-center gap-2 justify-end">
                <Button variant="primary" onClick={() => go(1)} disabled={safePage === 1}>
                    ראשון
                </Button>

                <Button
                    variant="primary"
                    onClick={() => go(safePage - 1)}
                    disabled={safePage === 1}
                >
                    הקודם
                </Button>

                <span className="px-2 text-text">
                    עמוד {safePage} / {totalPages}
                </span>

                <Button
                    variant="primary"
                    onClick={() => go(safePage + 1)}
                    disabled={safePage === totalPages}
                >
                    הבא
                </Button>

                <Button
                    variant="primary"
                    onClick={() => go(totalPages)}
                    disabled={safePage === totalPages}
                >
                    אחרון
                </Button>
            </div>
        </div>
    );
}
