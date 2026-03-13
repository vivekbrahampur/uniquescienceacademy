import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LogOut, CheckCircle, Users, FileSpreadsheet, FileQuestion, 
  CalendarCheck, FileText, IndianRupee, UserCog, AlertCircle 
} from 'lucide-react';
import { 
  ManageStudentsTab, AttendanceTab, FeesTab, ResultsTab, 
  NoticePanelTab, ExamScheduleTab, TestsTab 
} from './AdminDashboard';

export function useTeacherFetch() {
  const navigate = useNavigate();
  return React.useCallback(async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('teacherToken');
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('teacherAuth');
      localStorage.removeItem('teacherToken');
      navigate('/teacher/login');
      throw new Error('Unauthorized');
    }
    return res;
  }, [navigate]);
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const teacherFetch = useTeacherFetch();
  const [activeTab, setActiveTab] = useState('');
  const [teacherInfo, setTeacherInfo] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('teacherAuth');
    if (!auth) {
      navigate('/teacher/login');
      return;
    }
    const info = JSON.parse(auth);
    setTeacherInfo(info);
    
    // Set initial active tab based on first permission
    if (info.permissions && info.permissions.length > 0) {
      const firstTab = getTabFromPermission(info.permissions[0]);
      setActiveTab(firstTab);
    }

    fetchStudents();
  }, [navigate]);

  const fetchStudents = async () => {
    try {
      const res = await teacherFetch('/api/admin/students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getTabFromPermission = (permission: string) => {
    switch (permission) {
      case 'manage_students': return 'manage_students';
      case 'attendance': return 'attendance';
      case 'fees': return 'fees';
      case 'results': return 'results';
      case 'notices': return 'notice_panel';
      case 'tests': return 'tests';
      case 'exam_schedule': return 'exam_schedule';
      default: return '';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('teacherAuth');
    localStorage.removeItem('teacherToken');
    navigate('/teacher/login');
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000);
  };

  if (!teacherInfo) return null;

  const hasPermission = (p: string) => teacherInfo.permissions?.includes(p);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-primary text-white p-6 flex flex-col shadow-xl z-10">
        <div className="flex items-center space-x-3 mb-10 pb-6 border-b border-white/10">
          <div className="bg-white/20 p-2 rounded-lg">
            <UserCog className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Teacher Panel</h2>
            <p className="text-xs text-blue-200 font-medium uppercase tracking-widest">{teacherInfo.name}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {hasPermission('manage_students') && (
            <button
              onClick={() => setActiveTab('manage_students')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'manage_students' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-blue-100'}`}
            >
              <Users className="h-5 w-5" />
              <span>Manage Students</span>
            </button>
          )}
          {hasPermission('attendance') && (
            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'attendance' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-blue-100'}`}
            >
              <CalendarCheck className="h-5 w-5" />
              <span>Attendance</span>
            </button>
          )}
          {hasPermission('fees') && (
            <button
              onClick={() => setActiveTab('fees')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'fees' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-blue-100'}`}
            >
              <IndianRupee className="h-5 w-5" />
              <span>Fees Management</span>
            </button>
          )}
          {hasPermission('results') && (
            <button
              onClick={() => setActiveTab('results')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'results' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-blue-100'}`}
            >
              <FileSpreadsheet className="h-5 w-5" />
              <span>Result Management</span>
            </button>
          )}
          {hasPermission('notices') && (
            <button
              onClick={() => setActiveTab('notice_panel')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'notice_panel' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-blue-100'}`}
            >
              <FileText className="h-5 w-5" />
              <span>Notice Panel</span>
            </button>
          )}
          {hasPermission('tests') && (
            <button
              onClick={() => setActiveTab('tests')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'tests' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-blue-100'}`}
            >
              <FileQuestion className="h-5 w-5" />
              <span>Online Test Panel</span>
            </button>
          )}
          {hasPermission('exam_schedule') && (
            <button
              onClick={() => setActiveTab('exam_schedule')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'exam_schedule' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-blue-100'}`}
            >
              <CalendarCheck className="h-5 w-5" />
              <span>Exam Schedule</span>
            </button>
          )}

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
          {activeTab === 'manage_students' && <ManageStudentsTab students={students} onSuccess={() => { showSuccess('Operation successful'); fetchStudents(); }} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'attendance' && <AttendanceTab students={students} onSuccess={() => { showSuccess('Attendance saved successfully'); fetchStudents(); }} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'fees' && <FeesTab students={students} onSuccess={() => { showSuccess('Fee record added successfully'); fetchStudents(); }} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'results' && <ResultsTab students={students} onSuccess={() => { showSuccess('Result added successfully'); fetchStudents(); }} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'tests' && <TestsTab onSuccess={() => showSuccess('Question added successfully')} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'exam_schedule' && <ExamScheduleTab onSuccess={() => showSuccess('Exam schedule updated')} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'notice_panel' && <NoticePanelTab onSuccess={() => showSuccess('Notice updated successfully')} showSuccess={showSuccess} showError={showError} />}
        </motion.div>
      </main>
    </div>
  );
}
