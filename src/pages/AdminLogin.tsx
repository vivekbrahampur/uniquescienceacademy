import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserCog, Lock, AlertCircle, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AdminLogin() {
  const { settings: themeSettings } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          password, 
          token: requires2FA ? twoFactorToken : undefined 
        })
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.requires2FA) {
          setRequires2FA(true);
          setError('');
        } else {
          localStorage.setItem('adminAuth', 'true');
          localStorage.setItem('adminToken', data.token);
          navigate('/admin/dashboard');
        }
      } else {
        setError(data.error || 'Invalid username or password');
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
          <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${themeSettings.primaryColor}20` }}>
            <UserCog className="h-8 w-8" style={{ color: themeSettings.primaryColor }} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
            {requires2FA ? '2FA Verification' : 'Admin Login'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            {requires2FA ? 'Enter the code from your authenticator app' : 'Secure portal for school administration'}
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
            {!requires2FA ? (
              <>
                <div>
                  <label htmlFor="username" className="sr-only">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCog className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:z-10 sm:text-sm bg-white dark:bg-slate-700"
                      style={{ borderColor: themeSettings.primaryColor }}
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:z-10 sm:text-sm bg-white dark:bg-slate-700"
                      style={{ borderColor: themeSettings.primaryColor }}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="2fa-token" className="sr-only">2FA Token</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="2fa-token"
                    name="token"
                    type="text"
                    required
                    autoFocus
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:z-10 sm:text-sm bg-white dark:bg-slate-700"
                    style={{ borderColor: themeSettings.primaryColor }}
                    placeholder="6-digit code"
                    value={twoFactorToken}
                    onChange={(e) => setTwoFactorToken(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white hover:opacity-90 focus:outline-none transition-all shadow-md"
              style={{ backgroundColor: themeSettings.primaryColor }}
            >
              {requires2FA ? 'Verify & Login' : 'Sign in'}
            </button>
            {requires2FA && (
              <button
                type="button"
                onClick={() => setRequires2FA(false)}
                className="w-full mt-4 text-sm text-slate-600 dark:text-slate-400 hover:opacity-80"
                style={{ color: themeSettings.primaryColor }}
              >
                Back to Login
              </button>
            )}
          </div>
          {!requires2FA && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/forgot-password')}
                className="text-xs text-slate-500 hover:text-primary transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}
        </form>
      </div>
    </motion.div>
  );
}
