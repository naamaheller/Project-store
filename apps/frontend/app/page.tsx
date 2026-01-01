"use client";

import { useMemo, useState } from "react";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import { Alert } from "./components/ui/Alert";
import { useToast } from "./components/ui/Toast";
import { Table, type Column } from "./components/ui/Table";
import { Pagination } from "./components/ui/Pagination";
import ProductPage from "./pages/productList/page";

type Row = {
  id: number;
  name: string;
  city: string;
  status: "פעיל" | "ממתין" | "חסום";
};

const ALL_ROWS: Row[] = Array.from({ length: 37 }).map((_, i) => ({
  id: i + 1,
  name: `פריט ${i + 1}`,
  city: ["תל אביב", "ירושלים", "חיפה"][i % 3],
  status: (["פעיל", "ממתין", "חסום"] as const)[i % 3],
}));

export default function Home() {
  const toast = useToast();

  const [showAlert, setShowAlert] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(true);

  // pagination state
  const [page, setPage] = useState(1); // 1-based
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => (hasData ? ALL_ROWS : []), [hasData]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const columns: Column<Row>[] = [
    {
      key: "id",
      header: "ID",
      cell: (r) => r.id,
      className: "w-20 text-text-muted",
    },
    { key: "name", header: "שם", cell: (r) => r.name },
    { key: "city", header: "עיר", cell: (r) => r.city },
    {
      key: "status",
      header: "סטטוס",
      cell: (r) => (
        <span
          className={[
            "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
            r.status === "פעיל"
              ? "bg-success/10 text-success"
              : r.status === "ממתין"
              ? "bg-warning/10 text-warning"
              : "bg-error/10 text-error",
          ].join(" ")}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-left",
      cell: (r) => (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => toast.info(`עריכת ${r.id}`)}>
            עריכה
          </Button>
          <Button
            variant="danger"
            onClick={() => toast.error(`מחיקה ${r.id}`, "שגיאה")}
          >
            מחיקה
          </Button>
        </div>
      ),
    },
  ];

  const runAllTests = () => {
    // סדר פעולות שמדגים הכל בלי ללחוץ
    toast.info("מריץ בדיקה אוטומטית…");

    // 1) toast success
    setTimeout(() => toast.success("Toast עובד ✅", "הצלחה"), 300);

    // 2) loading skeleton
    setTimeout(() => {
      setLoading(true);
      toast.info("Skeleton ON (2 שניות)");
      setTimeout(() => setLoading(false), 2000);
    }, 900);

    // 3) empty state
    setTimeout(() => {
      setHasData(false);
      setPage(1);
      toast.warning("EmptyState אמור להופיע עכשיו", "בדיקה");
    }, 3200);

    // 4) restore data + jump page
    setTimeout(() => {
      setHasData(true);
      setPage(2);
      toast.info("החזרתי נתונים + עברתי לעמוד 2");
    }, 5200);
  };

  const resetAll = () => {
    setShowAlert(true);
    setLoading(false);
    setHasData(true);
    setPage(1);
    setPageSize(10);
    toast.info("איפוס בוצע");
  };

  return (
    // <div className="min-h-screen bg-background p-6" dir="rtl">
    //   <div className="max-w-5xl mx-auto">
    //     <Card>
    //       <CardHeader>
    //         <h1 className="text-xl font-semibold text-text">בדיקת Component Library</h1>
    //         <p className="text-sm text-text-muted">
    //           Toast / Alert / Table / Pagination / Skeleton / EmptyState
    //         </p>
    //       </CardHeader>

    //       <CardContent className="flex flex-col gap-4">
    //         {showAlert ? (
    //           <Alert variant="info" title="שים/י לב" onClose={() => setShowAlert(false)}>
    //             זה Alert בתוך העמוד. נסגר עם ✕ ולא נעלם לבד.
    //           </Alert>
    //         ) : null}

    //         {/* Controls */}
    //         <div className="flex flex-wrap gap-2 justify-end">
    //           <Button onClick={runAllTests}>הרץ בדיקה אוטומטית</Button>

    //           <Button variant="outline" onClick={() => toast.success('נשמר בהצלחה!', 'הצלחה')}>
    //             Success Toast
    //           </Button>
    //           <Button variant="outline" onClick={() => toast.info('זו הודעת מידע')}>
    //             Info Toast
    //           </Button>
    //           <Button variant="outline" onClick={() => toast.warning('בדקי שדות חסרים', 'אזהרה')}>
    //             Warning Toast
    //           </Button>
    //           <Button variant="danger" onClick={() => toast.error('משהו נכשל', 'שגיאה')}>
    //             Error Toast
    //           </Button>

    //           <Button
    //             variant="outline"
    //             onClick={() => {
    //               setLoading(true);
    //               toast.info('Skeleton ON (3 שניות)');
    //               setTimeout(() => setLoading(false), 3000);
    //             }}
    //           >
    //             הדגם Skeleton
    //           </Button>

    //           <Button
    //             variant="outline"
    //             onClick={() => {
    //               setHasData((v) => !v);
    //               setPage(1);
    //               toast.info('Toggle Empty/Data');
    //             }}
    //           >
    //             Toggle Empty/Data
    //           </Button>

    //           <Button variant="outline" onClick={resetAll}>
    //             איפוס הכל
    //           </Button>
    //         </div>

    //         {/* Table */}
    //         <Table<Row>
    //           columns={columns}
    //           rows={pageRows}
    //           rowKey={(r) => r.id}
    //           loading={loading}
    //           skeletonRows={5}
    //           emptyTitle="אין פריטים"
    //           emptyDescription="לחצי על Toggle כדי להחזיר נתונים."
    //         />

    //         {/* Pagination */}
    //         <Pagination
    //           page={page}
    //           pageSize={pageSize}
    //           total={filtered.length}
    //           onPageChange={setPage}
    //           onPageSizeChange={(next) => {
    //             setPageSize(next);
    //             setPage(1);
    //           }}
    //         />
    //       </CardContent>

    //       <CardFooter className="flex justify-end">
    //         <span className="text-sm text-text-muted">
    //           טיפ: אם Toast לא עובד — בדקי שיש ToastProvider ב־layout.tsx
    //         </span>
    //       </CardFooter>
    //     </Card>
    //   </div>
    // </div>
    <div className="min-h-screen bg-background p-6" dir="rtl">
    <ProductPage />
  </div>
  );
}
