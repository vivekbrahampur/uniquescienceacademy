import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Building2, 
  GraduationCap, 
  Users, 
  Calendar, 
  Mail, 
  BookOpen, 
  Atom,
  ChevronDown,
  Moon,
  Sun,
  LayoutDashboard
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { settings, isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
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
    { to: '/', label: 'HOME', icon: Home },
    { to: '/about', label: 'ABOUT US', icon: Building2 },
    { to: '/academics', label: 'ACADEMICS', icon: GraduationCap },
    { to: '/admissions', label: 'ADMISSIONS', icon: BookOpen },
    { to: '/life', label: 'LIFE AT ACADEMY', icon: Users },
    { to: '/portal', label: 'PORTAL', icon: LayoutDashboard },
    { to: '/events', label: 'EVENTS', icon: Calendar },
    { to: '/contact', label: 'CONTACT', icon: Mail },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 print:hidden ${
          scrolled 
            ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-xl py-2' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center">
            {/* Stylized Logo */}
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full group-hover:bg-teal-500/40 transition-all" />
                <div className="relative bg-gradient-to-br from-blue-700 to-teal-600 p-2.5 rounded-2xl shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                  <div className="relative">
                    <Atom className="h-7 w-7 text-white absolute inset-0 animate-pulse" />
                    <BookOpen className="h-7 w-7 text-white/80" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-black tracking-tight text-blue-900 dark:text-white leading-none">
                  UNIQUE SCIENCE
                </span>
                <span className="text-[11px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-[0.3em] mt-1">
                  ACADEMY
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden xl:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-[11px] font-black uppercase tracking-[0.15em] transition-all hover:text-teal-600 relative group ${
                    location.pathname === link.to ? 'text-teal-600' : 'text-blue-900/70 dark:text-slate-300'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full ${
                    location.pathname === link.to ? 'w-full' : ''
                  }`} />
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              <button
                onClick={toggleDarkMode}
                className="p-2.5 text-blue-900/50 dark:text-slate-400 hover:text-teal-600 transition-colors bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <Link
                to="/request-demo"
                className="px-8 py-3.5 bg-teal-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                REQUEST A DEMO
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="xl:hidden flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-blue-900/50 dark:text-slate-400"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-blue-900 dark:text-white"
              >
                <Menu className="h-7 w-7" />
              </button>
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
              className="fixed inset-0 bg-blue-900/60 backdrop-blur-sm z-[110] print:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[85%] max-w-sm bg-white dark:bg-slate-950 z-[120] p-8 flex flex-col print:hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="text-[11px] font-black text-teal-600 uppercase tracking-widest">NAVIGATION</div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-blue-900 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col space-y-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center space-x-4 p-4 rounded-2xl transition-all ${
                        location.pathname === link.to 
                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' 
                          : 'text-blue-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <link.icon className="h-5 w-5" />
                      <span className="text-sm font-bold tracking-widest uppercase">{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <Link
                  to="/request-demo"
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full py-5 bg-teal-600 text-white text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center rounded-2xl shadow-xl shadow-teal-600/20"
                >
                  REQUEST A DEMO
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
