'use client';

import type { ReactNode } from 'react';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export type Column<T> = {
    key: string;
    header: ReactNode;
    cell: (row: T) => ReactNode;
    className?: string;
    headerClassName?: string;
};

type TableProps<T> = {
    columns: Column<T>[];
    rows: T[];
    rowKey: (row: T) => string | number;

    loading?: boolean;
    skeletonRows?: number;
    emptyTitle?: string;
    emptyDescription?: string;
    className?: string;
};

export function Table<T>({
    columns,
    rows,
    rowKey,
    loading = false,
    skeletonRows = 5,
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
        >
            <div className="w-full overflow-auto">
                <table className="w-full text-left">
                    <thead className="bg-background-muted">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={[
                                        'px-4 py-3 text-sm font-semibold text-text border-b border-border ',
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
                            Array.from({ length: skeletonRows }).map((_, i) => (
                                <tr key={`sk-${i}`} className="border-b border-border last:border-b-0">
                                    {columns.map((col) => (
                                        <td key={`${col.key}-${i}`} className="px-4 py-3">
                                            <Skeleton className="h-4 w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-10">
                                    <EmptyState
                                        icon="📭"
                                        title={emptyTitle}
                                        description={emptyDescription}
                                    />
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
                                                'px-4 py-3 text-sm text-text align-middle text-left',
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
