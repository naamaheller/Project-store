'use client';
// קומפוננטת Portal לציור תוכן מחוץ לעץ הרגיל של React.
// מאפשרת הצגת Modal / Drawer / Toast מעל כל התוכן.

import { createPortal } from 'react-dom';
import { ReactNode, useEffect, useState } from 'react';

type PortalProps = {
  children: ReactNode;
};

export function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}
