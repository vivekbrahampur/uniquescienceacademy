import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, User, UserCog } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { settings } = useTheme();
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.logo_url) setLogoUrl(data.logo_url);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <header className="bg-primary text-white shadow-md border-b-4 border-accent print:hidden transition-colors duration-300 dark:bg-slate-900 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-12 w-12 rounded-full object-contain bg-white p-1" />
              ) : (
                <div className="bg-white p-2 rounded-full">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold tracking-tight uppercase">{settings?.schoolName || 'School Management System'}</h1>
                <p className="text-xs text-blue-200 dark:text-slate-400 uppercase tracking-widest">Brahampur, Jale, Darbhanga, 847307</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
              <Link to="/student/login" className="flex items-center space-x-1 hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <User className="h-4 w-4" />
                <span>Student Portal</span>
              </Link>
              <Link to="/admin/login" className="flex items-center space-x-1 hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <UserCog className="h-4 w-4" />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-secondary py-2 md:hidden dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex justify-center space-x-4">
          <Link to="/" className="text-sm hover:text-accent">Home</Link>
          <Link to="/student/login" className="text-sm hover:text-accent">Student Portal</Link>
          <Link to="/admin/login" className="text-sm hover:text-accent">Admin Login</Link>
        </div>
      </div>
    </header>
  );
}
