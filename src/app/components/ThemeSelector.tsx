'use client';

import { useState, useEffect } from 'react';

const themes = [
  { value: 'dark', label: 'Dark' },
  { value: 'synthwave', label: 'Synthwave' },
  { value: 'luxury', label: 'Luxury' },
];

export function ThemeSelector() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Get the initial theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <select 
      className="select select-bordered w-full max-w-xs"
      value={theme}
      onChange={handleThemeChange}
    >
      {themes.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
