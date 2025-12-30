'use client';

import { Button } from './components/ui/Button';

export default function Home() {


  return (
    <div className="min-h-screen p-6 bg-background" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => { alert('Reset clicked'); }}>
          איפוס
        </Button>
      </div>
    </div>
  );
}
