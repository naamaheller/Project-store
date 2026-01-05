"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";
import { Select } from "./Select";

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

function Icon({ title, children }: { title: string; children: ReactNode }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
            role="img"
            width={20}
            height={20}
            style={{
                display: "block",
                width: 20,
                height: 20,
                overflow: "visible",
            }}
        >
            <title>{title}</title>
            {children}
        </svg>
    );
}

const greenStroke = {
    fill: "none",
    stroke: "#6FAE3E",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: { stroke: "#6FAE3E", fill: "none", opacity: 1 } as const,
};

function FirstIcon() {
    return (
        <Icon title="First page">
            <path {...greenStroke} d="M11 19l-7-7 7-7" />
            <path {...greenStroke} d="M20 19l-7-7 7-7" />
        </Icon>
    );
}

function PrevIcon() {
    return (
        <Icon title="Previous page">
            <path {...greenStroke} d="M15 19l-7-7 7-7" />
        </Icon>
    );
}

function NextIcon() {
    return (
        <Icon title="Next page">
            <path {...greenStroke} d="M9 5l7 7-7 7" />
        </Icon>
    );
}

function LastIcon() {
    return (
        <Icon title="Last page">
            <path {...greenStroke} d="M4 5l7 7-7 7" />
            <path {...greenStroke} d="M13 5l7 7-7 7" />
        </Icon>
    );
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

    const iconBtn =
        "h-9 w-9 p-0 shrink-0 border border-primary/40" +
        "hover:bg-primary-soft focus:ring-primary-soft";

    return (
        <div
            className={[
                "w-full",
                // ✅ היה gap-3 -> עכשיו קטן יותר
                "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between",
                "text-sm text-text-muted",
                // ✅ רווח קטן מאוד מעל/מתחת
                "py-1",
                className ?? "",
            ].join(" ")}
            dir="ltr"
        >
            {/* left */}
            <div className="flex items-center gap-3 whitespace-nowrap">
                <span>
                    Showing <span className="text-text">{from}</span>–<span className="text-text">{to}</span> of{" "}
                    <span className="text-text">{total}</span>
                </span>

                {onPageSizeChange ? (
                    <div className="flex items-center gap-2">
                        <span className="text-border">|</span>
                        <label className="text-text-muted whitespace-nowrap">
                            Rows per page:
                        </label>
                        <Select
                            options={pageSizeOptions.map((opt) => ({
                                value: String(opt),
                                label: String(opt),
                            }))}
                            value={String(pageSize)}
                            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                            aria-label="Rows per page"
                            className="w-[64px] min-w-[64px] px-1 py-1 text-sm"
                        />

                    </div>
                ) : null}
            </div>

            {/* right */}
            <div className="flex items-center gap-2 justify-end">
                <Button
                    variant="outline"
                    onClick={() => go(1)}
                    disabled={safePage === 1}
                    className={iconBtn}
                    aria-label="First page"
                    title="First"
                >
                    <FirstIcon />
                </Button>

                <Button
                    variant="outline"
                    onClick={() => go(safePage - 1)}
                    disabled={safePage === 1}
                    className={iconBtn}
                    aria-label="Previous page"
                    title="Previous"
                >
                    <PrevIcon />
                </Button>

                <span className="px-2 text-text whitespace-nowrap">
                    Page <span className="font-medium">{safePage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                </span>

                <Button
                    variant="outline"
                    onClick={() => go(safePage + 1)}
                    disabled={safePage === totalPages}
                    className={iconBtn}
                    aria-label="Next page"
                    title="Next"
                >
                    <NextIcon />
                </Button>

                <Button
                    variant="outline"
                    onClick={() => go(totalPages)}
                    disabled={safePage === totalPages}
                    className={iconBtn}
                    aria-label="Last page"
                    title="Last"
                >
                    <LastIcon />
                </Button>
            </div>
        </div>
    );
}
