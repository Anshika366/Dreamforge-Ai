"use client";

import * as React from "react";

interface TabsContextProps {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextProps | null>(null);

export function Tabs({
  value,
  onValueChange,
  defaultValue,
  children,
  className = ""
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [localValue, setLocalValue] = React.useState(defaultValue || "");
  const activeValue = value !== undefined ? value : localValue;
  
  const handleValueChange = React.useCallback((val: string) => {
    if (onValueChange) {
      onValueChange(val);
    } else {
      setLocalValue(val);
    }
  }, [onValueChange]);

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center rounded-xl bg-slate-950/60 p-1 text-slate-400 border border-white/5 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = "" }: { value: string; children: React.ReactNode; className?: string }) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");
  
  const isActive = context.value === value;
  
  return (
    <button
      type="button"
      onClick={() => context.onValueChange(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 focus-visible:outline-none cursor-pointer ${
        isActive 
          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/10" 
          : "text-slate-400 hover:text-white hover:bg-white/5"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = "" }: { value: string; children: React.ReactNode; className?: string }) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");
  
  const isActive = context.value === value;
  
  if (!isActive) return null;
  
  return (
    <div className={`mt-4 focus-visible:outline-none animate-fadeIn ${className}`}>
      {children}
    </div>
  );
}
