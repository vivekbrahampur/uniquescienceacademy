import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Lock, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CLASSES = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default function StudentLogin() {
  const { settings: themeSettings } = useTheme();
  const [className, setClassName] = useState(CLASSES[0]);
  const [rollNo, setRollNo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_name: className, roll_no: rollNo })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('studentAuth', JSON.stringify(data.student));
        navigate('/student/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
    >
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <div>
          <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${themeSettings.accentColor}20` }}>
            <User className="h-8 w-8" style={{ color: themeSettings.accentColor }} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
            Student Portal
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Access your results and online tests
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="className" className="sr-only">Class</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  id="className"
                  name="className"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:z-10 sm:text-sm bg-white dark:bg-slate-700"
                  style={{ borderColor: themeSettings.primaryColor }}
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                >
                  {CLASSES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="rollNo" className="sr-only">Roll Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="rollNo"
                  name="rollNo"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:z-10 sm:text-sm bg-white dark:bg-slate-700"
                  style={{ borderColor: themeSettings.primaryColor }}
                  placeholder="Roll Number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white hover:opacity-90 focus:outline-none transition-all shadow-md"
              style={{ backgroundColor: themeSettings.primaryColor }}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
