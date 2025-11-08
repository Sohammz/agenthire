'use client';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme'); // string | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Validate stored value — only accept 'light' or 'dark'
    const initial: Theme = stored === 'dark' ? 'dark' : stored === 'light' ? 'light' : (prefersDark ? 'dark' : 'light');

    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
