import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserPlus, FileSpreadsheet, Image as ImageIcon, FileQuestion, LogOut, CheckCircle, Shield, Mail, UserCheck, CalendarCheck, IndianRupee, IdCard, Users, Trash2, ArrowUpCircle, Search, FileText, ArrowRight, Plus, X, Palette, QrCode, UserCog, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Html5QrcodeScanner } from 'html5-qrcode';

const compressImage = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export function useAdminFetch() {
  const navigate = useNavigate();
  return React.useCallback(async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('adminToken');
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
      throw new Error('Unauthorized');
    }
    return res;
  }, [navigate]);
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const adminFetch = useAdminFetch();
  const [activeTab, setActiveTab] = useState('registration');
  const [students, setStudents] = useState<any[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { settings: themeSettings, updateSettings } = useTheme();

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
    }
    fetchStudents();
  }, [navigate]);

  const fetchStudents = async () => {
    try {
      const res = await adminFetch('/api/admin/students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-primary text-white shadow-xl transition-colors duration-300 dark:bg-slate-900 dark:border-r dark:border-slate-800">
        <div className="p-6 border-b border-white/10 dark:border-slate-800">
          <h2 className="text-xl font-bold uppercase tracking-wider">Admin Panel</h2>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('registration')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'registration' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <UserPlus className="h-5 w-5" />
            <span>Quick Registration</span>
          </button>
          <button
            onClick={() => setActiveTab('full_registration')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'full_registration' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <UserCheck className="h-5 w-5" />
            <span>Full Registration</span>
          </button>
          <button
            onClick={() => setActiveTab('manage_students')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'manage_students' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <Users className="h-5 w-5" />
            <span>Manage Students</span>
          </button>
          <button
            onClick={() => setActiveTab('manage_teachers')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'manage_teachers' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <UserCog className="h-5 w-5" />
            <span>Manage Teachers</span>
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'attendance' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <CalendarCheck className="h-5 w-5" />
            <span>Attendance</span>
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'fees' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <IndianRupee className="h-5 w-5" />
            <span>Fees Management</span>
          </button>
          <button
            onClick={() => setActiveTab('idcards')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'idcards' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <IdCard className="h-5 w-5" />
            <span>ID Cards</span>
          </button>
          <button
            onClick={() => setActiveTab('marksheet_settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'marksheet_settings' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <FileText className="h-5 w-5" />
            <span>Marksheet Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'results' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <FileSpreadsheet className="h-5 w-5" />
            <span>Result Management</span>
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'content' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <ImageIcon className="h-5 w-5" />
            <span>Content Control</span>
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'tests' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <FileQuestion className="h-5 w-5" />
            <span>Online Test Panel</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'security' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <Shield className="h-5 w-5" />
            <span>Security</span>
          </button>
          <button
            onClick={() => setActiveTab('email_settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'email_settings' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <Mail className="h-5 w-5" />
            <span>Email Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('theme_settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'theme_settings' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <Palette className="h-5 w-5" />
            <span>Theme Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('qr_registration')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'qr_registration' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <QrCode className="h-5 w-5" />
            <span>QR Registration</span>
          </button>
          <button
            onClick={() => setActiveTab('exam_schedule')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'exam_schedule' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <CalendarCheck className="h-5 w-5" />
            <span>Exam Schedule</span>
          </button>
          <button
            onClick={() => setActiveTab('notice_panel')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'notice_panel' ? 'bg-secondary text-accent' : 'hover:bg-secondary'}`}
          >
            <FileText className="h-5 w-5" />
            <span>Notice Panel</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors mt-8 text-red-200 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {successMsg && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-center shadow-sm">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            <p className="text-sm text-green-700 font-medium">{successMsg}</p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center shadow-sm">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <p className="text-sm text-red-700 font-medium">{errorMsg}</p>
          </div>
        )}

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'registration' && <RegistrationTab onSuccess={() => { showSuccess('Student registered successfully'); fetchStudents(); }} showError={showError} />}
          {activeTab === 'full_registration' && <FullRegistrationTab onSuccess={() => { showSuccess('Student full registration successful. Confirmation email sent.'); fetchStudents(); }} showError={showError} />}
          {activeTab === 'manage_students' && <ManageStudentsTab students={students} onSuccess={() => { showSuccess('Operation successful'); fetchStudents(); }} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'manage_teachers' && <ManageTeachersTab onSuccess={() => showSuccess('Teacher operation successful')} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'attendance' && <AttendanceTab students={students} onSuccess={() => { showSuccess('Attendance saved successfully'); fetchStudents(); }} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'fees' && <FeesTab students={students} onSuccess={() => { showSuccess('Fee record added successfully'); fetchStudents(); }} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'idcards' && <IDCardsTab students={students} />}
          {activeTab === 'marksheet_settings' && <MarksheetSettingsTab onSuccess={() => showSuccess('Marksheet settings updated!')} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'results' && <ResultsTab students={students} onSuccess={() => { showSuccess('Result added successfully'); fetchStudents(); }} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'content' && <ContentTab onSuccess={() => showSuccess('Content updated successfully')} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'tests' && <TestsTab onSuccess={() => showSuccess('Question added successfully')} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'security' && <SecurityTab onSuccess={() => showSuccess('Credentials updated successfully')} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'email_settings' && <EmailSettingsTab onSuccess={() => showSuccess('Email settings updated successfully')} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'theme_settings' && <ThemeSettingsTab onSuccess={() => showSuccess('Theme settings updated successfully')} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'qr_registration' && <QRScannerTab onSuccess={() => { showSuccess('Student registered via QR successfully'); fetchStudents(); }} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'exam_schedule' && <ExamScheduleTab onSuccess={() => showSuccess('Exam schedule updated successfully')} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'notice_panel' && <NoticePanelTab onSuccess={() => showSuccess('Notice updated successfully')} showSuccess={showSuccess} showError={showError} />}
        </motion.div>
      </main>
    </div>
  );
}

export const CLASSES = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
export const SUBJECTS = ['Hindi', 'English', 'Math', 'SST', 'Science'];

export function ManageTeachersTab({ onSuccess, showSuccess, showError }: { onSuccess: () => void, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
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
    { id: 'exam_schedule', label: 'Exam Schedule' }
  ];

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await adminFetch('/api/admin/teachers');
      const data = await res.json();
      setTeachers(data);
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
        setFormData({ name: '', username: '', password: '', permissions: [] });
        fetchTeachers();
        onSuccess();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    // Removed confirm() for iframe compatibility
    try {
      const res = await adminFetch(`/api/admin/teachers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (showSuccess) showSuccess('Teacher deleted successfully');
        fetchTeachers();
        onSuccess();
      }
    } catch (err) {
      console.error(err);
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
                          {PERMISSIONS.find(perm => perm.id === p)?.label || p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-5 w-5" />
                    </button>
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

function ThemeSettingsTab({ onSuccess, showSuccess, showError }: { onSuccess: () => void, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const { settings, updateSettings } = useTheme();
  const [formData, setFormData] = useState({
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    accentColor: settings.accentColor,
    schoolName: settings.schoolName
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primary_color: formData.primaryColor,
          secondary_color: formData.secondaryColor,
          accent_color: formData.accentColor,
          school_name: formData.schoolName
        })
      });
      if (res.ok) {
        updateSettings(formData);
        onSuccess();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-4">Website Theme Settings</h3>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">School Name</label>
            <input 
              type="text" 
              value={formData.schoolName} 
              onChange={e => setFormData({...formData, schoolName: e.target.value})} 
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Primary Color</label>
            <div className="flex space-x-2">
              <input 
                type="color" 
                value={formData.primaryColor} 
                onChange={e => setFormData({...formData, primaryColor: e.target.value})} 
                className="h-10 w-20 border border-slate-300 rounded-lg cursor-pointer" 
              />
              <input 
                type="text" 
                value={formData.primaryColor} 
                onChange={e => setFormData({...formData, primaryColor: e.target.value})} 
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Secondary Color</label>
            <div className="flex space-x-2">
              <input 
                type="color" 
                value={formData.secondaryColor} 
                onChange={e => setFormData({...formData, secondaryColor: e.target.value})} 
                className="h-10 w-20 border border-slate-300 rounded-lg cursor-pointer" 
              />
              <input 
                type="text" 
                value={formData.secondaryColor} 
                onChange={e => setFormData({...formData, secondaryColor: e.target.value})} 
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Accent Color</label>
            <div className="flex space-x-2">
              <input 
                type="color" 
                value={formData.accentColor} 
                onChange={e => setFormData({...formData, accentColor: e.target.value})} 
                className="h-10 w-20 border border-slate-300 rounded-lg cursor-pointer" 
              />
              <input 
                type="text" 
                value={formData.accentColor} 
                onChange={e => setFormData({...formData, accentColor: e.target.value})} 
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg" 
              />
            </div>
          </div>
        </div>
        <div className="pt-4">
          <button type="submit" className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm">
            Save Theme Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export function QRScannerTab({ onSuccess, showSuccess, showError }: { onSuccess: () => void, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  const startScanning = () => {
    setScanning(true);
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 }, false);
    scannerRef.current = scanner;
    scanner.render(
      async (decodedText) => {
        setScanning(false);
        scanner.clear().catch(console.error);
        try {
          const studentData = JSON.parse(decodedText);
          const res = await adminFetch('/api/admin/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
          });
          if (res.ok) {
            onSuccess();
          } else {
            if (showError) showError('Failed to register student from QR code.');
          }
        } catch (err) {
          if (showError) showError('Invalid QR code data.');
        }
      },
      (errorMessage) => {
        console.log(errorMessage);
      }
    );
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-4">QR Student Registration</h3>
      {!scanning ? (
        <button 
          onClick={startScanning}
          className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm flex items-center"
        >
          <QrCode className="mr-2 h-5 w-5" />
          Start QR Scanner
        </button>
      ) : (
        <div id="qr-reader" className="w-full max-w-md"></div>
      )}
    </div>
  );
}

export function ExamScheduleTab({ onSuccess, showSuccess, showError }: { onSuccess: () => void, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const [exams, setExams] = useState<any[]>([]);
  const [formData, setFormData] = useState({ class_name: '1', subject: '', date: '', time: '' });

  useEffect(() => {
    adminFetch('/api/admin/exams').then(res => res.json()).then(setExams);
  }, [adminFetch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await adminFetch('/api/admin/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      onSuccess();
      adminFetch('/api/admin/exams').then(res => res.json()).then(setExams);
      setFormData({ class_name: '1', subject: '', date: '', time: '' });
    }
  };

  const deleteExam = async (id: string) => {
    await adminFetch(`/api/admin/exams/${id}`, { method: 'DELETE' });
    adminFetch('/api/admin/exams').then(res => res.json()).then(setExams);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-8">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-4">Manage Exam Schedule</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <select value={formData.class_name} onChange={e => setFormData({...formData, class_name: e.target.value})} className="px-4 py-2 border rounded-lg dark:bg-slate-800 dark:text-white">
          {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input required type="text" placeholder="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="px-4 py-2 border rounded-lg dark:bg-slate-800 dark:text-white" />
        <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="px-4 py-2 border rounded-lg dark:bg-slate-800 dark:text-white" />
        <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="px-4 py-2 border rounded-lg dark:bg-slate-800 dark:text-white" />
        <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900">Add Exam</button>
      </form>
      <div className="space-y-2">
        {exams.map(exam => (
          <div key={exam.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <span>{exam.class_name} - {exam.subject} ({exam.date} {exam.time})</span>
            <button onClick={() => deleteExam(exam.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-5 w-5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NoticePanelTab({ onSuccess, showSuccess, showError }: { onSuccess: () => void, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const [notice, setNotice] = useState({ title: '', pdf_url: '' });
  const [notices, setNotices] = useState<any[]>([]);

  const fetchNotices = async () => {
    const res = await adminFetch('/api/student/notices');
    if (res.ok) {
      const data = await res.json();
      setNotices(data);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [adminFetch]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        if (showError) showError('PDF size is too large. Please upload a file smaller than 500KB.');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNotice({ ...notice, pdf_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notice)
      });
      if (res.ok) {
        onSuccess();
        setNotice({ title: '', pdf_url: '' });
        fetchNotices();
        if (showSuccess) showSuccess('Notice uploaded successfully');
      } else {
        const data = await res.json();
        if (showError) showError(data.error || 'Failed to upload notice.');
      }
    } catch (err) {
      console.error(err);
      if (showError) showError('An error occurred while uploading the notice.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await adminFetch(`/api/admin/notices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchNotices();
        if (showSuccess) showSuccess('Notice deleted successfully');
      } else {
        if (showError) showError('Failed to delete notice.');
      }
    } catch (err) {
      console.error(err);
      if (showError) showError('An error occurred while deleting the notice.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-8">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-4">Manage Notice Panel</h3>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <input required type="text" placeholder="Notice Title" value={notice.title} onChange={e => setNotice({...notice, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:text-white" />
        <input required type="file" accept="application/pdf" onChange={handleFileUpload} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:text-white" />
        <button type="submit" className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors">Upload Notice</button>
      </form>

      <div className="mt-8">
        <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Existing Notices</h4>
        <div className="space-y-4">
          {notices.map(n => (
            <div key={n.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <span className="text-slate-800 dark:text-white font-medium">{n.title}</span>
              <button onClick={() => handleDelete(n.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RegistrationTab({ onSuccess, showError }: { onSuccess: () => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const [formData, setFormData] = useState({ name: '', father_name: '', mother_name: '', class_name: '1', roll_no: '', photo_url: '' });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        if (showError) showError('Photo size is too large. Please upload an image smaller than 500KB.');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onSuccess();
        setFormData({ name: '', father_name: '', mother_name: '', class_name: '1', roll_no: '', photo_url: '' });
      } else {
        if (showError) showError('Failed to register student. Roll number might already exist for this class.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Quick Student Registration</h3>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Student Photo</label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            {formData.photo_url && (
              <div className="mt-2">
                <img src={formData.photo_url} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-slate-300" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Student Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Father's Name</label>
            <input required type="text" value={formData.father_name} onChange={e => setFormData({...formData, father_name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mother's Name</label>
            <input required type="text" value={formData.mother_name} onChange={e => setFormData({...formData, mother_name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Class</label>
            <select required value={formData.class_name} onChange={e => setFormData({...formData, class_name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              {CLASSES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Roll Number</label>
            <input required type="text" value={formData.roll_no} onChange={e => setFormData({...formData, roll_no: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <button type="submit" className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm">Register Student</button>
      </form>
    </div>
  );
}

export function ResultsTab({ students, onSuccess, showSuccess, showError }: { students: any[], onSuccess: () => void, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const [studentId, setStudentId] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [marksData, setMarksData] = useState<Record<string, {marks: string, total: string}>>(
    SUBJECTS.reduce((acc, sub) => ({ ...acc, [sub]: { marks: '', total: '100' } }), {})
  );

  useEffect(() => {
    adminFetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setIsPublished(!!data.results_published);
      })
      .catch(console.error);
  }, [adminFetch]);

  const handlePublishToggle = async () => {
    try {
      const res = await adminFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results_published: !isPublished })
      });
      if (res.ok) {
        setIsPublished(!isPublished);
        if (showSuccess) showSuccess(`Results have been ${!isPublished ? 'published' : 'unpublished'} successfully.`);
      }
    } catch (err) {
      console.error(err);
      if (showError) showError('Failed to update publish status.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;
    
    const results = SUBJECTS.map(sub => ({
      subject: sub,
      marks: marksData[sub].marks,
      total_marks: marksData[sub].total
    }));

    try {
      const res = await adminFetch('/api/admin/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, results })
      });
      if (res.ok) {
        onSuccess();
        setStudentId('');
        setMarksData(SUBJECTS.reduce((acc, sub) => ({ ...acc, [sub]: { marks: '', total: '100' } }), {}));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h3 className="text-2xl font-bold text-slate-800">Publish All Results</h3>
        </div>
        <p className="text-slate-600 mb-6">
          Currently, results are <strong>{isPublished ? 'Published' : 'Hidden'}</strong>. 
          When published, all students from Nursery to 10th grade will be able to view their final exam results in their portal.
        </p>
        <button 
          onClick={handlePublishToggle}
          className={`px-6 py-3 rounded-lg font-medium transition-colors shadow-sm ${isPublished ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
        >
          {isPublished ? 'Unpublish Results' : 'Publish All Results'}
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Upload Marks</h3>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Student</label>
            <select required value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="">-- Select Student --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} (Class: {s.class_name}, Roll: {s.roll_no})</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 font-bold text-slate-700 border-b pb-2">
              <div>Subject</div>
              <div>Marks Obtained</div>
              <div>Total Marks</div>
            </div>
            {SUBJECTS.map(sub => (
              <div key={sub} className="grid grid-cols-3 gap-4 items-center">
                <div className="font-medium text-slate-800">{sub}</div>
                <input required type="number" min="0" max={marksData[sub].total} value={marksData[sub].marks} onChange={e => setMarksData({...marksData, [sub]: { ...marksData[sub], marks: e.target.value }})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                <input required type="number" min="1" value={marksData[sub].total} onChange={e => setMarksData({...marksData, [sub]: { ...marksData[sub], total: e.target.value }})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
            ))}
          </div>
          
          <button type="submit" className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm">Upload Result</button>
        </form>
      </div>
    </div>
  );
}

function ContentTab({ onSuccess, showSuccess, showError }: { onSuccess: () => void, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const [logoUrl, setLogoUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [contactAddress, setContactAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [newsTicker, setNewsTicker] = useState('');
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [aboutImage, setAboutImage] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [principalMessage, setPrincipalMessage] = useState('');
  const [principalImage, setPrincipalImage] = useState('');

  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', text: '', image: '' });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setLogoUrl(data.logo_url || '');
        setGalleryImages(data.gallery_images || []);
        setTestimonials(data.testimonials || []);
        setContactAddress(data.contact_address || '');
        setContactEmail(data.contact_email || '');
        setContactPhone(data.contact_phone || '');
        setSchoolName(data.school_name || '');
        setHeroTitle(data.hero_title || '');
        setHeroSubtitle(data.hero_subtitle || '');
        setNewsTicker(data.news_ticker || '');
        setAboutTitle(data.about_title || '');
        setAboutText(data.about_text || '');
        setAboutImage(data.about_image || '');
        setPrincipalName(data.principal_name || '');
        setPrincipalMessage(data.principal_message || '');
        setPrincipalImage(data.principal_image || '');
      });
  }, []);

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    let processed = 0;

    Array.from(files).forEach(async (file: File) => {
      try {
        const compressedImage = await compressImage(file);
        newImages.push(compressedImage);
        processed++;
        if (processed === files.length) {
          setGalleryImages(prev => [...prev, ...newImages]);
        }
      } catch (error) {
        console.error("Error compressing image:", error);
        processed++;
        if (processed === files.length) {
          setGalleryImages(prev => [...prev, ...newImages]);
        }
      }
    });
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTestimonial = () => {
    if (newTestimonial.name && newTestimonial.text) {
      setTestimonials(prev => [...prev, { ...newTestimonial, id: Date.now() }]);
      setNewTestimonial({ name: '', role: '', text: '', image: '' });
    }
  };

  const removeTestimonial = (id: number) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          logo_url: logoUrl, 
          gallery_images: galleryImages,
          testimonials,
          contact_address: contactAddress,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          school_name: schoolName,
          hero_title: heroTitle,
          hero_subtitle: heroSubtitle,
          news_ticker: newsTicker,
          about_title: aboutTitle,
          about_text: aboutText,
          about_image: aboutImage,
          principal_name: principalName,
          principal_message: principalMessage,
          principal_image: principalImage
        })
      });
      if (res.ok) onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Website Content Control</h3>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-slate-800 border-b pb-2">General Settings</h4>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">School Name</label>
            <input type="text" value={schoolName} onChange={e => setSchoolName(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">School Logo (Upload Image)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const compressedImage = await compressImage(file, 400, 400);
                    setLogoUrl(compressedImage);
                  } catch (error) {
                    console.error("Error compressing logo:", error);
                  }
                }
              }} 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-slate-50" 
            />
            {logoUrl && <img src={logoUrl} alt="Logo Preview" className="mt-4 h-24 object-contain border p-2 rounded bg-slate-50" />}
          </div>
        </div>

        <div className="space-y-4 border-t pt-6">
          <h4 className="text-lg font-bold text-slate-800 border-b pb-2">Hero Section (Top Banner)</h4>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Hero Title</label>
            <input type="text" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Hero Subtitle</label>
            <input type="text" value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">News Ticker (Scrolling Text)</label>
            <input type="text" value={newsTicker} onChange={e => setNewsTicker(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Hero Background Images (Upload Multiple)</label>
            <input 
              type="file" 
              accept="image/*" 
              multiple
              onChange={handleGalleryUpload}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-slate-50" 
            />
            {galleryImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt={`Gallery ${idx}`} className="h-24 w-full object-cover border rounded-lg" />
                    <button 
                      type="button" 
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 border-t pt-6">
          <h4 className="text-lg font-bold text-slate-800 border-b pb-2">About / Welcome Section</h4>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">About Title</label>
            <input type="text" value={aboutTitle} onChange={e => setAboutTitle(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">About Text</label>
            <textarea rows={4} value={aboutText} onChange={e => setAboutText(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">About Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const compressedImage = await compressImage(file, 800, 600);
                    setAboutImage(compressedImage);
                  } catch (error) {
                    console.error("Error compressing about image:", error);
                  }
                }
              }} 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-slate-50" 
            />
            {aboutImage && <img src={aboutImage} alt="About Preview" className="mt-4 h-32 object-cover border p-2 rounded bg-slate-50" />}
          </div>
        </div>

        <div className="space-y-4 border-t pt-6">
          <h4 className="text-lg font-bold text-slate-800 border-b pb-2">Principal's Message</h4>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Principal's Name</label>
            <input type="text" value={principalName} onChange={e => setPrincipalName(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
            <textarea rows={4} value={principalMessage} onChange={e => setPrincipalMessage(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Principal's Photo</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const compressedImage = await compressImage(file, 400, 400);
                    setPrincipalImage(compressedImage);
                  } catch (error) {
                    console.error("Error compressing principal image:", error);
                  }
                }
              }} 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-slate-50" 
            />
            {principalImage && <img src={principalImage} alt="Principal Preview" className="mt-4 h-32 object-cover border p-2 rounded bg-slate-50" />}
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <h4 className="text-lg font-bold text-slate-800 mb-4">Testimonials</h4>
          
          {/* Existing Testimonials */}
          {testimonials.length > 0 && (
            <div className="space-y-4 mb-6">
              {testimonials.map(t => (
                <div key={t.id} className="flex items-start justify-between bg-slate-50 p-4 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    {t.image && <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />}
                    <div>
                      <p className="font-bold text-slate-800">{t.name} <span className="text-sm font-normal text-slate-500">({t.role})</span></p>
                      <p className="text-sm text-slate-600 italic">"{t.text}"</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeTestimonial(t.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Testimonial */}
          <div className="bg-slate-50 p-4 rounded-lg border space-y-4">
            <h5 className="font-medium text-slate-700">Add New Testimonial</h5>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Name" value={newTestimonial.name} onChange={e => setNewTestimonial({...newTestimonial, name: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
              <input type="text" placeholder="Role (e.g. Parent, Student)" value={newTestimonial.role} onChange={e => setNewTestimonial({...newTestimonial, role: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <textarea placeholder="Testimonial text..." value={newTestimonial.text} onChange={e => setNewTestimonial({...newTestimonial, text: e.target.value})} className="w-full px-3 py-2 border rounded-md" rows={3}></textarea>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Profile Image (Optional)</label>
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const compressedImage = await compressImage(file, 200, 200);
                    setNewTestimonial({...newTestimonial, image: compressedImage});
                  } catch (error) {
                    console.error("Error compressing testimonial image:", error);
                  }
                }
              }} className="text-sm" />
            </div>
            <button type="button" onClick={addTestimonial} className="bg-slate-800 text-white px-4 py-2 rounded-md text-sm hover:bg-slate-900">Add Testimonial</button>
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <h4 className="text-lg font-bold text-slate-800 mb-4">Contact Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
              <textarea rows={3} value={contactAddress} onChange={e => setContactAddress(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Brahampur, Jale..."></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="info@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="+91 98765 43210" />
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm">Update Content</button>
      </form>
    </div>
  );
}

function SecurityTab({ onSuccess, showSuccess, showError }: { onSuccess: () => void, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [setupData, setSetupData] = useState<{ secret: string; qrCode: string } | null>(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setTwoFactorEnabled(data.two_factor_enabled || false);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        onSuccess();
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetup2FA = async () => {
    try {
      const res = await adminFetch('/api/admin/2fa/setup', { method: 'POST' });
      const data = await res.json();
      setSetupData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify2FA = async () => {
    try {
      const res = await adminFetch('/api/admin/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: setupData?.secret, token })
      });
      if (res.ok) {
        setTwoFactorEnabled(true);
        setSetupData(null);
        setToken('');
        onSuccess();
      } else {
        if (showError) showError('Invalid token');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisable2FA = async () => {
    try {
      const res = await adminFetch('/api/admin/2fa/disable', { method: 'POST' });
      if (res.ok) {
        setTwoFactorEnabled(false);
        onSuccess();
      } else {
        console.error('Failed to disable 2FA.');
      }
    } catch (err) {
      console.error('An error occurred while disabling 2FA.', err);
    }
  };

  if (loading) return <div className="p-8">Loading security settings...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Update Admin Credentials</h3>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">New Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Leave blank to keep current" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Leave blank to keep current" />
          </div>
          <button type="submit" className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm">Update Credentials</button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center">
          <Shield className="mr-2 h-6 w-6 text-blue-600" />
          Two-Factor Authentication (2FA)
        </h3>
        
        {twoFactorEnabled ? (
          <div className="space-y-4">
            <div className="flex items-center text-green-600 font-medium">
              <CheckCircle className="mr-2 h-5 w-5" />
              2FA is currently enabled
            </div>
            <p className="text-sm text-slate-600">Your account is protected with an additional layer of security.</p>
            <button 
              onClick={handleDisable2FA}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Disable 2FA
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-slate-600">Enhance your account security by requiring a 6-digit code from an authenticator app (like Google Authenticator or Authy) when logging in.</p>
            
            {!setupData ? (
              <button 
                onClick={handleSetup2FA}
                className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm"
              >
                Setup 2FA
              </button>
            ) : (
              <div className="space-y-6 p-6 bg-slate-50 rounded-xl border border-slate-200 max-w-md">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700 mb-4">1. Scan this QR code with your authenticator app:</p>
                  <img src={setupData.qrCode} alt="2FA QR Code" className="mx-auto border-4 border-white shadow-sm rounded-lg" />
                  <p className="mt-4 text-xs text-slate-500">Or enter manually: <code className="bg-white px-2 py-1 rounded border">{setupData.secret}</code></p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">2. Enter the 6-digit code to verify:</p>
                  <div className="flex space-x-3">
                    <input 
                      type="text" 
                      maxLength={6}
                      value={token}
                      onChange={e => setToken(e.target.value)}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-center font-mono text-xl tracking-widest"
                      placeholder="000000"
                    />
                    <button 
                      onClick={handleVerify2FA}
                      className="bg-blue-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors"
                    >
                      Verify
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSetupData(null)}
                  className="text-slate-500 hover:text-slate-700 text-xs w-full text-center"
                >
                  Cancel Setup
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export function TestsTab({ onSuccess, showSuccess, showError }: { onSuccess: () => void, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const [formData, setFormData] = useState({ class_name: '1', subject: '', title: '', link: '' });
  const [testLinks, setTestLinks] = useState<any[]>([]);
  const [marksData, setMarksData] = useState({ class_name: '1', roll_no: '', test_title: '', score: '', total: '' });

  const fetchTestLinks = async () => {
    try {
      const res = await adminFetch('/api/admin/test-links');
      const data = await res.json();
      setTestLinks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTestLinks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/test-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onSuccess();
        setFormData({ ...formData, subject: '', title: '', link: '' });
        fetchTestLinks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm && !window.confirm('Are you sure you want to delete this test link?')) return;
    try {
      const res = await adminFetch(`/api/admin/test-links/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (showSuccess) showSuccess('Test link deleted successfully');
        fetchTestLinks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarksSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/online-test-marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(marksData)
      });
      if (res.ok) {
        if (showSuccess) showSuccess('Marks added successfully!');
        setMarksData({ ...marksData, roll_no: '', score: '' });
      } else {
        const data = await res.json();
        if (showError) showError(data.error || 'Failed to add marks');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Add Online Test Link</h3>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Class</label>
              <select required value={formData.class_name} onChange={e => setFormData({...formData, class_name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                {CLASSES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
              <input required type="text" placeholder="e.g. Mathematics" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Test Title</label>
            <input required type="text" placeholder="e.g. Mid-Term Exam" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Google Form / Script Link</label>
            <input required type="url" placeholder="https://docs.google.com/forms/..." value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <button type="submit" className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm">Add Test Link</button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">Manage Test Links</h3>
        {testLinks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Link</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {testLinks.map((test) => (
                  <tr key={test.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{test.class_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{test.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{test.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <a href={test.link} target="_blank" rel="noopener noreferrer" className="hover:underline">View Link</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleDelete(test.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 text-center py-4">No test links added yet.</p>
        )}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Add Student Test Result</h3>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h4 className="font-bold text-blue-900 mb-2">Automate with Google Forms</h4>
          <p className="text-sm text-blue-800 mb-2">
            You can automatically receive scores from Google Forms by adding this Apps Script to your form:
          </p>
          <div className="bg-slate-900 text-slate-300 p-4 rounded-md text-xs overflow-x-auto font-mono">
<pre>{`function onSubmit(e) {
  var formResponse = e.response;
  var itemResponses = formResponse.getItemResponses();
  
  // Adjust these indices based on your form's question order
  var className = itemResponses[0].getResponse(); 
  var rollNo = itemResponses[1].getResponse();
  
  var score = 0;
  var total = 0;
  
  // Calculate score (assuming quiz mode is enabled)
  var items = formResponse.getGradableItemResponses();
  for (var i = 0; i < items.length; i++) {
    score += items[i].getScore() || 0;
    total += 1; // Or get max score per item
  }

  var payload = {
    "class_name": className,
    "roll_no": rollNo,
    "test_title": FormApp.getActiveForm().getTitle(),
    "score": score.toString(),
    "total": total.toString()
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  // Replace YOUR_APP_URL with your actual website URL
  UrlFetchApp.fetch("YOUR_APP_URL/api/webhook/test-result", options);
}`}</pre>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-6 font-bold border-b pb-2">Or Add Manually:</p>
        <form onSubmit={handleMarksSubmit} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Class</label>
              <select required value={marksData.class_name} onChange={e => setMarksData({...marksData, class_name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                {CLASSES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Roll Number</label>
              <input required type="text" placeholder="e.g. 101" value={marksData.roll_no} onChange={e => setMarksData({...marksData, roll_no: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Test Title</label>
            <input required type="text" placeholder="e.g. Maths Mid Term" value={marksData.test_title} onChange={e => setMarksData({...marksData, test_title: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Marks Obtained</label>
              <input required type="text" placeholder="e.g. 18" value={marksData.score} onChange={e => setMarksData({...marksData, score: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Total Marks</label>
              <input required type="text" placeholder="e.g. 20" value={marksData.total} onChange={e => setMarksData({...marksData, total: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm">Add Result</button>
        </form>
      </div>
    </div>
  );
}

function EmailSettingsTab({ onSuccess, showSuccess, showError }: { onSuccess: () => void, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const [settings, setSettings] = useState({
    smtp_host: '',
    smtp_port: '',
    smtp_user: '',
    smtp_pass: ''
  });

  useEffect(() => {
    adminFetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings({
          smtp_host: data.smtp_host || '',
          smtp_port: data.smtp_port || '',
          smtp_user: data.smtp_user || '',
          smtp_pass: data.smtp_pass || ''
        });
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Email Settings (SMTP)</h3>
      <p className="text-sm text-slate-500 mb-6">Configure your email server to send automatic confirmation emails to students.</p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-bold text-blue-900 mb-2">Using Gmail?</h4>
        <p className="text-sm text-blue-800">
          If you are using Gmail, you must use an <strong>App Password</strong> instead of your regular password. 
          Go to your Google Account Settings {'>'} Security {'>'} 2-Step Verification {'>'} App Passwords to generate one.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">SMTP Host</label>
            <input type="text" placeholder="smtp.gmail.com" value={settings.smtp_host} onChange={e => setSettings({...settings, smtp_host: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">SMTP Port</label>
            <input type="text" placeholder="587" value={settings.smtp_port} onChange={e => setSettings({...settings, smtp_port: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address (SMTP User)</label>
            <input type="email" placeholder="admin@school.com" value={settings.smtp_user} onChange={e => setSettings({...settings, smtp_user: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">App Password (SMTP Pass)</label>
            <input type="password" placeholder="••••••••" value={settings.smtp_pass} onChange={e => setSettings({...settings, smtp_pass: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <button type="submit" className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm">
          Save Email Settings
        </button>
      </form>
    </div>
  );
}

function FullRegistrationTab({ onSuccess, showError }: { onSuccess: () => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const [formData, setFormData] = useState({ 
    name: '', father_name: '', mother_name: '', class_name: '1', roll_no: '', 
    email: '', phone: '', dob: '', gender: 'Male', address: '', photo_url: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        if (showError) showError('Photo size is too large. Please upload an image smaller than 500KB.');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/students/full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        if (data.emailError) {
          if (showError) showError(`Student registered successfully, but email failed: ${data.emailError}`);
        } else {
          onSuccess();
        }
        setFormData({ 
          name: '', father_name: '', mother_name: '', class_name: '1', roll_no: '', 
          email: '', phone: '', dob: '', gender: 'Male', address: '', photo_url: ''
        });
      } else {
        if (showError) showError(data.error || 'Failed to register student. Roll number might already exist for this class.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Full Student Registration</h3>
      <p className="text-sm text-slate-500 mb-6">Register a student with full details. An automatic confirmation email will be sent to the student's email address.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Student Photo</label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            {formData.photo_url && (
              <div className="mt-2">
                <img src={formData.photo_url} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-slate-300" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Student Name *</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Father's Name *</label>
            <input required type="text" value={formData.father_name} onChange={e => setFormData({...formData, father_name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mother's Name *</label>
            <input required type="text" value={formData.mother_name} onChange={e => setFormData({...formData, mother_name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Class *</label>
            <select required value={formData.class_name} onChange={e => setFormData({...formData, class_name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              {CLASSES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Roll Number *</label>
            <input required type="text" value={formData.roll_no} onChange={e => setFormData({...formData, roll_no: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Student Email Address *</label>
            <input required type="email" placeholder="student@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
            <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
            <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Full Address</label>
          <textarea rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <button disabled={loading} type="submit" className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm disabled:opacity-50">
          {loading ? 'Registering & Sending Email...' : 'Register Student & Send Email'}
        </button>
      </form>
    </div>
  );
}

export function AttendanceTab({ students, onSuccess, showSuccess, showError }: { students: any[], onSuccess: () => void, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const [className, setClassName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});

  useEffect(() => {
    if (className && date) {
      adminFetch(`/api/admin/attendance/${className}/${date}`)
        .then(res => res.json())
        .then(data => setAttendance(data))
        .catch(console.error);
    }
  }, [className, date, adminFetch]);

  const handleSave = async () => {
    try {
      const res = await adminFetch('/api/admin/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: attendance, date, class_name: className })
      });
      if (res.ok) onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStudents = students.filter(s => s.class_name === className);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Mark Attendance</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Class</label>
          <select value={className} onChange={e => setClassName(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
            <option value="">-- Select Class --</option>
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
        </div>
      </div>

      {className && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 font-bold text-slate-700 border-b pb-2">
            <div>Roll No</div>
            <div>Student Name</div>
            <div>Status</div>
          </div>
          {filteredStudents.length === 0 ? (
            <p className="text-slate-500 py-4">No students found in this class.</p>
          ) : (
            filteredStudents.map(s => (
              <div key={s.id} className="grid grid-cols-3 gap-4 items-center py-2 border-b border-slate-100">
                <div className="text-slate-600">{s.roll_no}</div>
                <div className="font-medium text-slate-800">{s.name}</div>
                <div className="flex space-x-2">
                  {['Present', 'Absent', 'Late', 'Half-day'].map(status => (
                    <button
                      key={status}
                      onClick={() => setAttendance({ ...attendance, [s.id]: status })}
                      className={`px-3 py-1 text-sm rounded-full border ${attendance[s.id] === status ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
          {filteredStudents.length > 0 && (
            <button onClick={handleSave} className="mt-6 bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm">
              Save Attendance
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function FeesTab({ students, onSuccess, showSuccess, showError }: { students: any[], onSuccess: () => void, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (studentId) {
      adminFetch(`/api/admin/fees/${studentId}`)
        .then(res => res.json())
        .then(data => setHistory(data))
        .catch(console.error);
    } else {
      setHistory([]);
    }
  }, [studentId, adminFetch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, amount, month, date, remarks })
      });
      if (res.ok) {
        onSuccess();
        setAmount('');
        setRemarks('');
        // Refresh history
        const updatedRes = await adminFetch(`/api/admin/fees/${studentId}`);
        setHistory(await updatedRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Add Fee Payment</h3>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Student</label>
            <select required value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
              <option value="">-- Select Student --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} (Class: {s.class_name}, Roll: {s.roll_no})</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Amount (₹)</label>
              <input required type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">For Month</label>
              <select required value={month} onChange={e => setMonth(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                <option value="">-- Select Month --</option>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Payment Date</label>
              <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Remarks (Optional)</label>
            <input type="text" value={remarks} onChange={e => setRemarks(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="e.g. Paid in cash, Late fee included" />
          </div>

          <button type="submit" className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm">Add Payment Record</button>
        </form>
      </div>

      {studentId && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Payment History</h3>
          {history.length === 0 ? (
            <p className="text-slate-500">No previous payment records found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-3 border-b">Receipt No</th>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Month</th>
                  <th className="p-3 border-b">Amount</th>
                  <th className="p-3 border-b">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id} className="hover:bg-slate-50">
                    <td className="p-3 border-b font-mono text-sm">{h.receiptNo}</td>
                    <td className="p-3 border-b">{h.date}</td>
                    <td className="p-3 border-b">{h.month}</td>
                    <td className="p-3 border-b font-medium text-green-600">₹{h.amount}</td>
                    <td className="p-3 border-b text-slate-600">{h.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function IDCardsTab({ students }: { students: any[] }) {
  const [className, setClassName] = useState('');
  const [schoolName, setSchoolName] = useState('Unique Science Academy');
  const [logoUrl, setLogoUrl] = useState('');
  const adminFetch = useAdminFetch();

  useEffect(() => {
    adminFetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.school_name) setSchoolName(data.school_name);
        if (data.logo_url) setLogoUrl(data.logo_url);
      })
      .catch(console.error);
  }, [adminFetch]);

  const filteredStudents = className ? students.filter(s => s.class_name === className) : [];

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 print:hidden">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h3 className="text-2xl font-bold text-slate-800">Generate ID Cards</h3>
          <button onClick={() => window.print()} className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors">
            Print ID Cards
          </button>
        </div>
        <div className="max-w-md">
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Class to Print</label>
          <select value={className} onChange={e => setClassName(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
            <option value="">-- Select Class --</option>
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {className && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4 print:m-0">
          {filteredStudents.map(student => (
            <div key={student.id} className="border-2 border-blue-900 rounded-xl overflow-hidden bg-white shadow-md print:shadow-none print:break-inside-avoid w-full max-w-sm mx-auto">
              {/* Header */}
              <div className="bg-blue-900 text-white p-4 text-center">
                {logoUrl && <img src={logoUrl} alt="Logo" className="h-12 w-12 mx-auto mb-2 object-contain bg-white rounded-full p-1" />}
                <h4 className="font-bold text-lg uppercase tracking-wider leading-tight">{schoolName}</h4>
                <p className="text-xs text-blue-200 mt-1 uppercase tracking-widest">Student Identity Card</p>
              </div>
              
              {/* Body */}
              <div className="p-5 flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-200 rounded-lg border-2 border-slate-300 mb-4 flex items-center justify-center text-slate-400 overflow-hidden">
                  {student.photo_url ? (
                    <img src={student.photo_url} alt="Student" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-center">Photo</span>
                  )}
                </div>
                
                <h5 className="text-xl font-bold text-slate-800 mb-1 text-center">{student.name}</h5>
                <p className="text-sm font-medium text-blue-600 mb-4">Class: {student.class_name} | Roll: {student.roll_no}</p>
                
                <div className="w-full space-y-2 text-sm text-slate-700">
                  <div className="grid grid-cols-[80px_1fr]">
                    <span className="font-semibold text-slate-500">F. Name:</span>
                    <span className="truncate">{student.father_name}</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr]">
                    <span className="font-semibold text-slate-500">DOB:</span>
                    <span>{student.dob || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr]">
                    <span className="font-semibold text-slate-500">Phone:</span>
                    <span>{student.phone || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr]">
                    <span className="font-semibold text-slate-500">Address:</span>
                    <span className="truncate">{student.address || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-slate-100 p-3 border-t border-slate-200 flex justify-between items-end">
                <div className="text-[10px] text-slate-500">Valid for current academic year</div>
                <div className="text-center">
                  <div className="w-16 h-6 border-b border-slate-400 mb-1"></div>
                  <div className="text-[10px] font-semibold text-slate-600">Principal</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MarksheetSettingsTab({ onSuccess, showSuccess, showError }: { onSuccess: () => void, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const [settings, setSettings] = useState({
    marksheet_heading: '',
    marksheet_subheading: '',
    marksheet_affiliation_no: '',
    marksheet_school_code: '',
    marksheet_address: '',
    marksheet_phone: '',
    marksheet_website: '',
    marksheet_email: '',
    school_name: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings({
          marksheet_heading: data.marksheet_heading || '',
          marksheet_subheading: data.marksheet_subheading || '',
          marksheet_affiliation_no: data.marksheet_affiliation_no || '',
          marksheet_school_code: data.marksheet_school_code || '',
          marksheet_address: data.marksheet_address || '',
          marksheet_phone: data.marksheet_phone || '',
          marksheet_website: data.marksheet_website || '',
          marksheet_email: data.marksheet_email || '',
          school_name: data.school_name || ''
        });
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Marksheet Text Control</h3>
      <p className="text-sm text-slate-500 mb-6">Control all the text that appears on the student marksheet/report card.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">School Name (Main Heading)</label>
            <input type="text" value={settings.school_name} onChange={e => setSettings({...settings, school_name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Report Card Heading</label>
            <input type="text" value={settings.marksheet_heading} onChange={e => setSettings({...settings, marksheet_heading: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="e.g. ANNUAL EXAMINATION RESULT" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Report Card Subheading</label>
            <input type="text" value={settings.marksheet_subheading} onChange={e => setSettings({...settings, marksheet_subheading: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="e.g. Session: 2025-2026" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Affiliation No.</label>
            <input type="text" value={settings.marksheet_affiliation_no} onChange={e => setSettings({...settings, marksheet_affiliation_no: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">School Code</label>
            <input type="text" value={settings.marksheet_school_code} onChange={e => setSettings({...settings, marksheet_school_code: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">School Address</label>
            <input type="text" value={settings.marksheet_address} onChange={e => setSettings({...settings, marksheet_address: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <input type="text" value={settings.marksheet_phone} onChange={e => setSettings({...settings, marksheet_phone: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
            <input type="text" value={settings.marksheet_website} onChange={e => setSettings({...settings, marksheet_website: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input type="text" value={settings.marksheet_email} onChange={e => setSettings({...settings, marksheet_email: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
          </div>
        </div>

        <button type="submit" className="bg-blue-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors shadow-lg">
          Update Marksheet Settings
        </button>
      </form>
    </div>
  );
}

export function ManageStudentsTab({ students, onSuccess, showSuccess, showError }: { students: any[], onSuccess: () => void, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const adminFetch = useAdminFetch();
  const [selectedClass, setSelectedClass] = useState('1');
  const [targetClass, setTargetClass] = useState('2');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isPromoting, setIsPromoting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const classCounts = CLASSES.reduce((acc, className) => {
    acc[className] = students.filter(s => s.class_name === className).length;
    return acc;
  }, {} as Record<string, number>);

  const filteredStudents = students.filter(s => 
    s.class_name === selectedClass && 
    (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll_no.includes(searchQuery))
  );

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const res = await adminFetch(`/api/admin/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onSuccess();
        if (showSuccess) showSuccess(`Student "${name}" deleted successfully`);
      } else {
        if (showError) showError('Failed to delete student');
      }
    } catch (err) {
      console.error(err);
      if (showError) showError('An error occurred while deleting the student');
    }
  };

  const handlePromote = async () => {
    if (selectedStudents.length === 0) {
      if (showError) showError('Please select at least one student to promote');
      return;
    }
    if (selectedClass === targetClass) {
      if (showError) showError('Target class must be different from current class');
      return;
    }

    setIsPromoting(true);
    try {
      const res = await adminFetch('/api/admin/students/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentIds: selectedStudents,
          targetClass
        })
      });
      if (res.ok) {
        setSelectedStudents([]);
        onSuccess();
        if (showSuccess) showSuccess(`Promoted ${selectedStudents.length} students successfully`);
      } else {
        const data = await res.json();
        if (showError) showError(data.error || 'Failed to promote students');
      }
    } catch (err) {
      console.error(err);
      if (showError) showError('An error occurred while promoting students');
    } finally {
      setIsPromoting(false);
    }
  };

  const toggleStudentSelection = (id: string) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      {/* Class-wise Stats */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <Users className="mr-2 h-5 w-5 text-blue-600" />
          Student Statistics (Class-wise)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CLASSES.map(c => (
            <div key={c} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Class {c}</div>
              <div className="text-2xl font-bold text-blue-800">{classCounts[c] || 0}</div>
            </div>
          ))}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Total</div>
            <div className="text-2xl font-bold text-blue-900">{students.length}</div>
          </div>
        </div>
      </div>

      {/* Student Management */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h3 className="text-xl font-bold text-slate-800">Manage Students</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-slate-600">Filter by Class:</label>
              <select 
                value={selectedClass} 
                onChange={e => { setSelectedClass(e.target.value); setSelectedStudents([]); }}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search name or roll..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Promotion Controls */}
        {selectedStudents.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="text-blue-800 font-medium">
              {selectedStudents.length} students selected for promotion
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-slate-600">Promote to:</span>
              <select 
                value={targetClass} 
                onChange={e => setTargetClass(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
              >
                {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
              <button 
                onClick={handlePromote}
                disabled={isPromoting}
                className="bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors flex items-center disabled:opacity-50"
              >
                <ArrowUpCircle className="mr-2 h-4 w-4" />
                {isPromoting ? 'Promoting...' : 'Promote Selected'}
              </button>
            </div>
          </motion.div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="p-3 border-b w-10">
                  <input 
                    type="checkbox" 
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={() => {
                      if (selectedStudents.length === filteredStudents.length) {
                        setSelectedStudents([]);
                      } else {
                        setSelectedStudents(filteredStudents.map(s => s.id));
                      }
                    }}
                    className="rounded text-blue-600"
                  />
                </th>
                <th className="p-3 border-b">Roll</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Father's Name</th>
                <th className="p-3 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 italic">No students found in Class {selectedClass}</td>
                </tr>
              ) : (
                filteredStudents.map(s => (
                  <tr key={s.id} className={`hover:bg-slate-50 transition-colors ${selectedStudents.includes(s.id) ? 'bg-blue-50/50' : ''}`}>
                    <td className="p-3 border-b">
                      <input 
                        type="checkbox" 
                        checked={selectedStudents.includes(s.id)}
                        onChange={() => toggleStudentSelection(s.id)}
                        className="rounded text-blue-600"
                      />
                    </td>
                    <td className="p-3 border-b font-mono text-sm">{s.roll_no}</td>
                    <td className="p-3 border-b font-medium text-slate-800">{s.name}</td>
                    <td className="p-3 border-b text-slate-600">{s.father_name}</td>
                    <td className="p-3 border-b text-right">
                      <button 
                        onClick={() => handleDelete(s.id, s.name)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


