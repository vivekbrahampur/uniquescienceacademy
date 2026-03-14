import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function TeacherResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/teacher/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Password reset successfully. Redirecting to login...');
        setTimeout(() => navigate('/teacher/login'), 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
      >
        <div className="bg-primary p-8 text-white text-center">
          <h2 className="text-2xl font-bold uppercase tracking-wider">Reset Password</h2>
          <p className="text-blue-200 mt-2">Enter your new password</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <p className="text-sm text-green-700 font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center group shadow-lg shadow-primary/20"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
