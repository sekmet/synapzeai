import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);
  return <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80">
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>;
};