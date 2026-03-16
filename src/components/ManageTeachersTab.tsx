import React, { useState, useEffect } from 'react';
import { useAdminFetch } from '../adminUtils';

export function ManageTeachersTab({ onSuccess, showSuccess, showError }: { onSuccess: () => void, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    permissions: [] as string[]
  });

  const PERMISSIONS = [
    { id: 'manage_students', label: 'Manage Students' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'fees', label: 'Fees Management' },
    { id: 'results', label: 'Result Management' },
    { id: 'notices', label: 'Notice Panel' },
    { id: 'tests', label: 'Online Test Panel' },
    { id: 'exam_schedule', label: 'Exam Schedule' },
    { id: 'study_material', label: 'Study Material' }
  ];

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await adminFetch('/api/admin/teachers');
      const data = await res.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePermissionChange = (id: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter(p => p !== id)
        : [...prev.permissions, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ name: '', username: '', email: '', password: '', permissions: [] });
        fetchTeachers();
        onSuccess();
        if (showSuccess) showSuccess('Teacher added successfully');
      } else {
        const data = await res.json();
        if (showError) showError(data.error || 'Failed to add teacher');
      }
    } catch (err) {
      console.error(err);
      if (showError) showError('An error occurred while adding the teacher');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await adminFetch(`/api/admin/teachers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (showSuccess) showSuccess('Teacher deleted successfully');
        fetchTeachers();
        onSuccess();
      } else {
        if (showError) showError('Failed to delete teacher');
      }
    } catch (err) {
      console.error(err);
      if (showError) showError('An error occurred while deleting the teacher');
    }
  };

  const handleResetPassword = async (id: string) => {
    try {
      const res = await adminFetch(`/api/admin/teachers/${id}/reset-password`, { method: 'POST' });
      if (res.ok) {
        if (showSuccess) showSuccess('Password reset link sent to teacher email');
      } else {
        const data = await res.json();
        if (showError) showError(data.error || 'Failed to send reset link');
      }
    } catch (err) {
      console.error(err);
      if (showError) showError('An error occurred while sending reset link');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-4">Add New Teacher</h3>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required type="text" placeholder="Teacher Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:text-white" />
            <input required type="text" placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:text-white" />
            <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:text-white" />
            <input required type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:text-white" />
          </div>
          
          <div>
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-3">Assign Permissions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {PERMISSIONS.map(p => (
                <label key={p.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
                  <input 
                    type="checkbox" 
                    checked={formData.permissions.includes(p.id)}
                    onChange={() => handlePermissionChange(p.id)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm">
            Add Teacher
          </button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-4">Teacher List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b dark:border-slate-700">
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Name</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Username</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Permissions</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4 text-slate-600 dark:text-slate-400">{t.name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{t.username}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {t.permissions?.map((p: string) => (
                        <span key={p} className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button onClick={() => handleResetPassword(t.id)} className="text-blue-600 hover:text-blue-800">Reset Password</button>
                      <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
