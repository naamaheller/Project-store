"use client";

import { Button } from "./components/ui/Button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">

        {/* בדיקת הכפתור */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => alert("עובד✅")}>בדיקת כפתור</Button>
          <Button variant="outline" onClick={() => console.log("outline click")}>
            Outline
          </Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
        </div>
    </div>
  );
}
