import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, User, UserCog, Menu, X, Home, Shield, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { settings } = useTheme();
  const [logoUrl, setLogoUrl] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.logo_url) setLogoUrl(data.logo_url);
      })
      .catch(err => console.error(err));
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/student/login', label: 'Student Portal', icon: User },
    { to: '/teacher/login', label: 'Teacher Portal', icon: Users },
    { to: '/admin/login', label: 'Admin Login', icon: Shield },
  ];

  return (
    <>
      <header className="bg-primary text-white shadow-md border-b-4 border-accent print:hidden transition-colors duration-300 dark:bg-slate-900 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Open Menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <Link to="/" className="flex items-center space-x-3">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-full object-contain bg-white p-1" />
                ) : (
                  <div className="bg-white p-1.5 rounded-full">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold tracking-tight uppercase leading-tight">{settings?.schoolName || 'School Management System'}</h1>
                  <p className="text-[10px] text-blue-200 dark:text-slate-400 uppercase tracking-widest">Brahampur, Jale, Darbhanga</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Optional: Add theme toggle or user profile here if needed */}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] print:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 shadow-2xl z-[70] flex flex-col print:hidden"
            >
              <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between bg-primary text-white">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-6 w-6" />
                  <span className="font-bold uppercase tracking-wider">Menu</span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all group ${
                      location.pathname === link.to 
                        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <link.icon className={`h-5 w-5 ${location.pathname === link.to ? 'text-primary dark:text-blue-400' : 'text-slate-400 group-hover:text-primary'}`} />
                    <span className="font-bold uppercase tracking-wide text-sm">{link.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="p-6 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest text-center">
                  © 2026 {settings?.schoolName || 'School Management'}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
