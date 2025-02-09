//import React, { useState, useEffect } from 'react';
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  /*const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };*/

  return (
    <header className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="inline-flex items-center">
        <img src="/logo-synapze.png" alt="synapze logo" className="w-10 h-10 mr-2" />
        <span className="font-bold text-xl">Synapze</span>
        </div>
        {/*<button onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>*/}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
