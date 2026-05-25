import React, { createContext, useContext, useState, ReactNode } from "react";

interface MenuContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <MenuContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within MenuProvider");
  }
  return context;
}
