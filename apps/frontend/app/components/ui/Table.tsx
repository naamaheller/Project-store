'use client';

import type { ReactNode } from 'react';

export type Column<T> = {
    key: string;
    header: ReactNode;
    cell: (row: T) => ReactNode; // רנדר מותאם לכל תא
    className?: string; // עיצוב לתא (td)
    headerClassName?: string; // עיצוב לכותרת (th)
};

type TableProps<T> = {
    columns: Column<T>[];
    rows: T[];
    rowKey: (row: T) => string | number;

    loading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    className?: string;
};

export function Table<T>({
    columns,
    rows,
    rowKey,
    loading = false,
    emptyTitle = 'אין נתונים להצגה',
    emptyDescription = 'נסי לשנות פילטרים או להוסיף פריטים חדשים.',
    className,
}: TableProps<T>) {
    return (
        <div
            className={[
                'w-full overflow-hidden rounded-lg border border-border bg-surface',
                className ?? '',
            ].join(' ')}
            dir="rtl"
        >
            <div className="w-full overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-background-muted">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={[
                                        'px-4 py-3 text-sm font-semibold text-text border-b border-border',
                                        col.headerClassName ?? '',
                                    ].join(' ')}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            // Loading rows (Skeleton-like פשוט)
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={`sk-${i}`} className="border-b border-border last:border-b-0">
                                    {columns.map((col) => (
                                        <td key={`${col.key}-${i}`} className="px-4 py-3">
                                            <div className="h-4 w-full rounded bg-border/60 animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-10 text-center"
                                >
                                    <div className="text-text font-medium">{emptyTitle}</div>
                                    <div className="text-sm text-text-muted mt-1">
                                        {emptyDescription}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr
                                    key={rowKey(row)}
                                    className="border-b border-border last:border-b-0 hover:bg-background-muted/60 transition"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={[
                                                'px-4 py-3 text-sm text-text align-middle',
                                                col.className ?? '',
                                            ].join(' ')}
                                        >
                                            {col.cell(row)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
