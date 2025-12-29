'use client';

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
