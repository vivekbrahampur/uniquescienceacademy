import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, User, UserCog, Menu, X, Home, Shield, Users, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { settings } = useTheme();
  const [logoUrl, setLogoUrl] = useState('https://picsum.photos/seed/schoollogo/200/200');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.logo_url) setLogoUrl(data.logo_url);
      })
      .catch(err => console.error(err));

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 print:hidden ${
          scrolled 
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg py-2' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className={`p-2 rounded-xl transition-all ${
                  scrolled 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                aria-label="Open Menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <Link to="/" className="flex items-center space-x-4 group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-amber-500 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity" />
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="relative h-10 w-10 rounded-full object-contain bg-white p-1 shadow-md" />
                  ) : (
                    <div className="relative bg-white p-2 rounded-full shadow-md">
                      <Building2 className="h-6 w-6 text-slate-900" />
                    </div>
                  )}
                </div>
                <div className="hidden md:block">
                  <h1 className={`text-xl font-serif font-bold tracking-tight transition-colors ${
                    scrolled ? 'text-slate-900 dark:text-white' : 'text-white'
                  }`}>
                    {settings?.schoolName || 'Unique Science Academy'}
                  </h1>
                  <p className={`text-[10px] uppercase tracking-[0.2em] font-bold opacity-70 ${
                    scrolled ? 'text-slate-500' : 'text-slate-300'
                  }`}>
                    Excellence in Education
                  </p>
                </div>
              </Link>
            </div>
            
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    location.pathname === link.to
                      ? 'bg-amber-500 text-slate-900'
                      : scrolled 
                        ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
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
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[110] print:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-slate-950 shadow-2xl z-[120] flex flex-col print:hidden"
            >
              <div className="p-8 border-b dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-500 p-2 rounded-lg">
                    <Building2 className="h-5 w-5 text-slate-900" />
                  </div>
                  <span className="font-serif font-bold text-xl tracking-tight">Navigation</span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${
                      location.pathname === link.to 
                        ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <link.icon className={`h-5 w-5 ${location.pathname === link.to ? 'text-slate-900' : 'text-slate-400 group-hover:text-amber-500'}`} />
                      <span className="font-bold uppercase tracking-widest text-xs">{link.label}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-all ${location.pathname === link.to ? 'opacity-100' : ''}`} />
                  </Link>
                ))}
              </nav>

              <div className="p-8 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center space-x-4 mb-6">
                  <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-full bg-white p-1 shadow-sm" />
                  <div>
                    <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-white leading-tight">
                      {settings?.schoolName || 'Unique Science Academy'}
                    </h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Bihar, India</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest text-center">
                  © 2026 Academy Management
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
