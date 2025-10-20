import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

type HeaderContextValue = {
  headerNode: ReactNode | null;
  setHeaderNode: (node: ReactNode | null) => void;
};

const HeaderContext = createContext<HeaderContextValue | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [headerNode, setHeaderNode] = useState<ReactNode | null>(null);
  const value = useMemo(() => ({ headerNode, setHeaderNode }), [headerNode]);
  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
}

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) return { headerNode: null, setHeaderNode: (_: ReactNode | null) => {} };
  return ctx;
}
