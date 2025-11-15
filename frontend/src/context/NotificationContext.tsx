"use client";

import { createContext, useContext, useState } from "react";

interface NotificationContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NotificationContext.Provider
      value={{
        isOpen,
        toggle: () => setIsOpen(v => !v),
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error("useNotification must be inside NotificationProvider");
    return ctx;
}