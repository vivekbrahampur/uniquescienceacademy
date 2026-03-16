import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileText, Edit3, LogOut, Download, CheckCircle, AlertCircle, FileQuestion, CalendarCheck, IndianRupee, IdCard, Bell, Menu, X, BookOpen } from 'lucide-react';
import ExaminationPortal from '../components/ExaminationPortal';
import FeePaymentTab from './FeePaymentTab';
import StudyMaterialView from '../components/StudyMaterialView';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('results');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const authData = localStorage.getItem('studentAuth');
    if (!authData) {
      navigate('/student/login');
    } else {
      setStudent(JSON.parse(authData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('studentAuth');
    navigate('/student/login');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000);
  };

  if (!student) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row print:bg-white print:block relative">
      {/* Mobile Header */}
      <div className="md:hidden bg-blue-900 text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-50 print:hidden">
        <h2 className="text-lg font-bold uppercase tracking-wider">Student Portal</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg">
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-blue-900 text-white shadow-xl transition-transform duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 md:flex md:flex-col
        print:hidden
      `}>
        <div className="p-6 border-b border-blue-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider">Student Portal</h2>
            <p className="text-sm text-blue-200 mt-2">{student.name}</p>
            <p className="text-xs text-blue-300">Class: {student.class_name} | Roll: {student.roll_no}</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 hover:bg-white/10 rounded-lg">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4 space-y-2 overflow-y-auto flex-1">
          <button
            onClick={() => handleTabChange('results')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'results' ? 'bg-blue-800 text-yellow-400' : 'hover:bg-blue-800'}`}
          >
            <FileText className="h-5 w-5" />
            <span>My Results</span>
          </button>
          <button
            onClick={() => handleTabChange('attendance')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'attendance' ? 'bg-blue-800 text-yellow-400' : 'hover:bg-blue-800'}`}
          >
            <CalendarCheck className="h-5 w-5" />
            <span>My Attendance</span>
          </button>
          <button
            onClick={() => handleTabChange('payment')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'payment' ? 'bg-blue-800 text-yellow-400' : 'hover:bg-blue-800'}`}
          >
            <IndianRupee className="h-5 w-5" />
            <span>Pay Fees</span>
          </button>
          <button
            onClick={() => handleTabChange('fees')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'fees' ? 'bg-blue-800 text-yellow-400' : 'hover:bg-blue-800'}`}
          >
            <IndianRupee className="h-5 w-5" />
            <span>Fee Receipts</span>
          </button>
          <button
            onClick={() => handleTabChange('idcard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'idcard' ? 'bg-blue-800 text-yellow-400' : 'hover:bg-blue-800'}`}
          >
            <IdCard className="h-5 w-5" />
            <span>ID Card</span>
          </button>
          <button
            onClick={() => handleTabChange('exam')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'exam' ? 'bg-blue-800 text-yellow-400' : 'hover:bg-blue-800'}`}
          >
            <FileQuestion className="h-5 w-5" />
            <span>Examination Portal</span>
          </button>
          <button
            onClick={() => handleTabChange('test')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'test' ? 'bg-blue-800 text-yellow-400' : 'hover:bg-blue-800'}`}
          >
            <Edit3 className="h-5 w-5" />
            <span>Online Test</span>
          </button>
          <button
            onClick={() => handleTabChange('notices')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'notices' ? 'bg-blue-800 text-yellow-400' : 'hover:bg-blue-800'}`}
          >
            <Bell className="h-5 w-5" />
            <span>Notices</span>
          </button>
          <button
            onClick={() => handleTabChange('study_materials')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'study_materials' ? 'bg-blue-800 text-yellow-400' : 'hover:bg-blue-800'}`}
          >
            <BookOpen className="h-5 w-5" />
            <span>Study Materials</span>
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
      <main className="flex-1 p-6 md:p-10 overflow-y-auto print:p-0 print:overflow-visible">
        {successMsg && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex flex-col items-center shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <p className="text-sm text-green-700 font-bold mb-2">{successMsg}</p>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
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
          {activeTab === 'results' && <ResultsTab student={student} />}
          {activeTab === 'attendance' && <AttendanceTab student={student} />}
          {activeTab === 'fees' && <FeesTab student={student} />}
          {activeTab === 'payment' && <FeePaymentTab student={student} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'idcard' && <IDCardTab student={student} />}
          {activeTab === 'test' && <TestTab student={student} />}
          {activeTab === 'exam' && <ExaminationPortal student={student} showSuccess={showSuccess} showError={showError} />}
          {activeTab === 'notices' && <NoticesTab />}
          {activeTab === 'study_materials' && <StudyMaterialView studentClass={student.class_name} />}
        </motion.div>
      </main>
    </div>
  );
}

function NoticesTab() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/notices')
      .then(res => res.json())
      .then(data => {
        setNotices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">Loading notices...</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Latest Notices</h3>
      {notices.length === 0 ? (
        <p className="text-slate-500 text-center py-10">No notices available.</p>
      ) : (
        <div className="space-y-4">
          {notices.map(notice => (
            <div key={notice.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-4">
                <FileText className="h-6 w-6 text-blue-800" />
                <div>
                  <h4 className="font-bold text-slate-900">{notice.title}</h4>
                  <p className="text-xs text-slate-500">{new Date(notice.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <a href={notice.pdf_url} target="_blank" rel="noopener noreferrer" className="bg-blue-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-900">View PDF</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getGradeAndRemark(marks: number, total: number) {
  if (total === 0) return { grade: '-', remark: '-' };
  const percentage = (marks / total) * 100;
  if (percentage >= 91) return { grade: 'A1', remark: 'Excellent' };
  if (percentage >= 81) return { grade: 'A2', remark: 'Very Good' };
  if (percentage >= 71) return { grade: 'B1', remark: 'Good' };
  if (percentage >= 61) return { grade: 'B2', remark: 'Above Average' };
  if (percentage >= 51) return { grade: 'C1', remark: 'Average' };
  if (percentage >= 41) return { grade: 'C2', remark: 'Fair' };
  if (percentage >= 33) return { grade: 'D', remark: 'Pass' };
  return { grade: 'E', remark: 'Needs Improvement' };
}

function ResultsTab({ student }: { student: any }) {
  const [results, setResults] = useState<any[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState('');
  const [schoolName, setSchoolName] = useState('Unique Science Academy');
  const [marksheetHeading, setMarksheetHeading] = useState('Report Card (Term-2)');
  const [marksheetSubheading, setMarksheetSubheading] = useState('');
  const [marksheetAffiliationNo, setMarksheetAffiliationNo] = useState('1548G');
  const [marksheetSchoolCode, setMarksheetSchoolCode] = useState('1548');
  const [marksheetAddress, setMarksheetAddress] = useState('Brahampur, Jale, Darbhanga, Bihar 847307');
  const [marksheetPhone, setMarksheetPhone] = useState('(0542)-XXXXXXX');
  const [marksheetWebsite, setMarksheetWebsite] = useState('www.uniquescienceacademy.in');
  const [marksheetEmail, setMarksheetEmail] = useState('info@uniquescienceacademy.in');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.logo_url) setLogoUrl(data.logo_url);
        if (data.school_name) setSchoolName(data.school_name);
        if (data.marksheet_heading) setMarksheetHeading(data.marksheet_heading);
        if (data.marksheet_subheading) setMarksheetSubheading(data.marksheet_subheading);
        if (data.marksheet_affiliation_no) setMarksheetAffiliationNo(data.marksheet_affiliation_no);
        if (data.marksheet_school_code) setMarksheetSchoolCode(data.marksheet_school_code);
        if (data.marksheet_address) setMarksheetAddress(data.marksheet_address);
        if (data.marksheet_phone) setMarksheetPhone(data.marksheet_phone);
        if (data.marksheet_website) setMarksheetWebsite(data.marksheet_website);
        if (data.marksheet_email) setMarksheetEmail(data.marksheet_email);
      })
      .catch(console.error);

    fetch(`/api/student/${student.id}/results`)
      .then(res => res.json())
      .then(data => {
        if (data.published) {
          setIsPublished(true);
          setResults(data.results || []);
        } else {
          setIsPublished(false);
          setResults([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [student.id]);

  const handleDownload = () => {
    window.print();
  };

  if (loading) return <div className="text-center py-10">Loading results...</div>;

  if (!isPublished) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center py-16">
        <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Results Not Published Yet</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          The final exam results for your class have not been published by the administration yet. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-none">
      <div className="flex justify-between items-center mb-6 border-b pb-4 print:hidden">
        <h3 className="text-2xl font-bold text-slate-800">Digital Marksheet</h3>
        <button onClick={handleDownload} className="flex items-center space-x-2 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors">
          <Download className="h-4 w-4" />
          <span>Download / Print</span>
        </button>
      </div>

      {/* Marksheet Content */}
      <div className="relative border-4 border-double border-slate-800 p-8 rounded-none bg-white font-sans mx-auto max-w-4xl print:p-4 print:border-4 print:border-double" style={{ minHeight: '1000px' }}>
        {/* Watermark */}
        {logoUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0">
            <img src={logoUrl} alt="Watermark" className="w-96 h-96 object-contain" />
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start mb-4 border-b-2 border-slate-800 pb-4 relative z-10">
          {logoUrl && <img src={logoUrl} alt="School Logo" className="w-24 h-24 object-contain" />}
          <div className="text-center flex-1 px-4">
            <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-wide">{schoolName}</h1>
            <p className="text-sm text-slate-700 font-semibold">{marksheetAddress}</p>
            <p className="text-sm text-slate-700 font-semibold">{marksheetPhone}</p>
            <p className="text-sm text-slate-700 font-semibold">School Website: https://uniquescienceacademy.onrender.com</p>
          </div>
          {logoUrl && <img src={logoUrl} alt="School Logo" className="w-24 h-24 object-contain" />}
        </div>

        {/* Title */}
        <div className="text-center mb-6 relative z-10">
          <h2 className="text-2xl font-bold text-slate-800 border-2 border-slate-800 inline-block px-8 py-1 uppercase">{marksheetHeading}</h2>
          {marksheetSubheading && <p className="text-sm font-bold text-slate-700 mt-1">{marksheetSubheading}</p>}
          <div className="mt-2 font-bold text-slate-800">
            Class : {student.class_name} &nbsp;&nbsp;&nbsp; Section : A &nbsp;&nbsp;&nbsp; Session : 2026-27
          </div>
        </div>

        {/* Student Details */}
        <div className="border-2 border-slate-800 mb-6 relative z-10 bg-white/90">
          <div className="bg-yellow-400 text-center font-bold text-slate-900 py-1 border-b-2 border-slate-800 uppercase italic">
            Student Details
          </div>
          <div className="grid grid-cols-2 text-sm">
            <div className="p-2 border-r-2 border-slate-800">
              <div className="grid grid-cols-[120px_auto] gap-2 mb-1">
                <span className="font-semibold">Admission No</span>
                <span>: {student.roll_no}</span>
              </div>
              <div className="grid grid-cols-[120px_auto] gap-2 mb-1">
                <span className="font-semibold">Student Name</span>
                <span>: {student.name}</span>
              </div>
              <div className="grid grid-cols-[120px_auto] gap-2 mb-1">
                <span className="font-semibold">Mother's Name</span>
                <span>: {student.mother_name || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-[120px_auto] gap-2 mb-1">
                <span className="font-semibold">Father's Name</span>
                <span>: {student.father_name}</span>
              </div>
              <div className="grid grid-cols-[120px_auto] gap-2">
                <span className="font-semibold">Address</span>
                <span>: {student.address || 'N/A'}</span>
              </div>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-[120px_auto] gap-2 mb-1">
                <span className="font-semibold">Roll No</span>
                <span>: {student.roll_no}</span>
              </div>
              <div className="grid grid-cols-[120px_auto] gap-2 mb-1">
                <span className="font-semibold">DOB</span>
                <span>: {student.dob || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-[120px_auto] gap-2 mb-1">
                <span className="font-semibold">Contact no</span>
                <span>: {student.phone || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-[120px_auto] gap-2 mb-1">
                <span className="font-semibold">Attendance</span>
                <span>: N/A</span>
              </div>
              <div className="text-red-500 text-xs italic mt-2">
                *Total Attendance/Working Days
              </div>
            </div>
          </div>
        </div>

        {/* Academic Performance */}
        <div className="border-2 border-slate-800 mb-6 relative z-10 bg-white/90">
          <div className="bg-green-500 text-center font-bold text-slate-900 py-1 border-b-2 border-slate-800 uppercase">
            Academic Performance : Scholastic Areas (8 Point Scale)
          </div>
          {results.length > 0 ? (
            <table className="w-full text-center text-sm border-collapse">
              <thead>
                <tr className="font-bold border-b-2 border-slate-800">
                  <th className="border-r-2 border-slate-800 p-2">Subject</th>
                  <th className="border-r-2 border-slate-800 p-2">Marks Obtained</th>
                  <th className="border-r-2 border-slate-800 p-2">Total Marks</th>
                  <th className="border-r-2 border-slate-800 p-2">Grade</th>
                  <th className="p-2">Remark</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, idx) => {
                  const marks = Number(r.marks) || 0;
                  const total = Number(r.total_marks) || 0;
                  const { grade, remark } = getGradeAndRemark(marks, total);
                  return (
                    <tr key={idx} className="border-b border-slate-400 last:border-b-2 last:border-slate-800">
                      <td className="border-r-2 border-slate-800 p-2 font-semibold text-left uppercase">{r.subject}</td>
                      <td className="border-r-2 border-slate-800 p-2">{marks}</td>
                      <td className="border-r-2 border-slate-800 p-2">{total}</td>
                      <td className="border-r-2 border-slate-800 p-2 font-bold">{grade}</td>
                      <td className="p-2">{remark}</td>
                    </tr>
                  );
                })}
                {/* Grand Total Row */}
                <tr className="font-bold bg-slate-100 border-b-2 border-slate-800">
                  <td className="border-r-2 border-slate-800 p-2 text-right uppercase">Grand Total</td>
                  <td className="border-r-2 border-slate-800 p-2">{results.reduce((acc, curr) => acc + (Number(curr.marks) || 0), 0)}</td>
                  <td className="border-r-2 border-slate-800 p-2">{results.reduce((acc, curr) => acc + (Number(curr.total_marks) || 0), 0)}</td>
                  <td className="border-r-2 border-slate-800 p-2">
                    {getGradeAndRemark(
                      results.reduce((acc, curr) => acc + (Number(curr.marks) || 0), 0),
                      results.reduce((acc, curr) => acc + (Number(curr.total_marks) || 0), 0)
                    ).grade}
                  </td>
                  <td className="p-2">
                    {results.reduce((acc, curr) => acc + (Number(curr.total_marks) || 0), 0) > 0 
                      ? ((results.reduce((acc, curr) => acc + (Number(curr.marks) || 0), 0) / results.reduce((acc, curr) => acc + (Number(curr.total_marks) || 0), 0)) * 100).toFixed(2) + '%'
                      : '0%'}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-slate-500 flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
              <p>No results have been uploaded yet.</p>
            </div>
          )}
        </div>

        {/* Remarks */}
        <div className="border-2 border-slate-800 p-2 mb-16 relative z-10 font-bold bg-white/90">
          Class Teacher Remarks : 
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end relative z-10 font-bold text-lg px-4 mt-16">
          <div>
            <div className="mb-4">Date :</div>
            <div>Place :</div>
          </div>
          <div className="text-center">
            Class Teacher
          </div>
          <div className="text-center">
            Principal
          </div>
        </div>
      </div>
    </div>
  );
}

function TestTab({ student }: { student: any }) {
  const [testLinks, setTestLinks] = useState<any[]>([]);
  const [testMarks, setTestMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/student/test-links/${encodeURIComponent(student.class_name)}`).then(res => res.json()),
      fetch(`/api/student/${student.id}/online-test-marks`).then(res => res.json())
    ])
    .then(([linksData, marksData]) => {
      setTestLinks(Array.isArray(linksData) ? linksData : []);
      setTestMarks(Array.isArray(marksData) ? marksData : []);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [student.class_name, student.id]);

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading tests...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Available Online Tests</h3>
        {testLinks.length === 0 ? (
          <div className="text-center py-12">
            <FileQuestion className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">There are currently no online tests assigned for {student.class_name}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testLinks.map((test) => (
              <div key={test.id} className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide">
                      {test.subject}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(test.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{test.title}</h4>
                  <p className="text-sm text-slate-600 mb-6">Click the button below to start your test. Make sure you are logged into your Google account if required.</p>
                </div>
                <a 
                  href={test.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full inline-flex justify-center items-center bg-blue-800 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm"
                >
                  Take Test
                  <Edit3 className="ml-2 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {testMarks.length > 0 && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">My Test Results</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Test Title</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Percentage</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {testMarks.map((mark) => {
                  const percentage = ((Number(mark.score) / Number(mark.total)) * 100).toFixed(1);
                  return (
                    <tr key={mark.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(mark.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {mark.test_title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-600">
                        {mark.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-500">
                        {mark.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${Number(percentage) >= 40 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AttendanceTab({ student }: { student: any }) {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/student/${student.id}/attendance`)
      .then(res => res.json())
      .then(data => {
        setAttendance(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching attendance:', err);
        setLoading(false);
      });
  }, [student.id]);

  if (loading) {
    return <div className="text-center py-10">Loading attendance...</div>;
  }

  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const totalDays = attendance.length;
  const percentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Attendance Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
            <div className="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-2">Total Days</div>
            <div className="text-4xl font-bold text-blue-900">{totalDays}</div>
          </div>
          <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center">
            <div className="text-sm text-green-600 font-semibold uppercase tracking-wider mb-2">Present</div>
            <div className="text-4xl font-bold text-green-900">{presentCount}</div>
          </div>
          <div className={`p-6 rounded-xl border text-center ${percentage >= 75 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
            <div className={`text-sm font-semibold uppercase tracking-wider mb-2 ${percentage >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>Percentage</div>
            <div className={`text-4xl font-bold ${percentage >= 75 ? 'text-emerald-900' : 'text-red-900'}`}>{percentage}%</div>
          </div>
        </div>

        {attendance.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-xl">
            No attendance records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {attendance.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${record.status === 'Present' ? 'bg-green-100 text-green-800' : 
                          record.status === 'Absent' ? 'bg-red-100 text-red-800' : 
                          record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-orange-100 text-orange-800'}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function FeesTab({ student }: { student: any }) {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/student/${student.id}/fees`)
      .then(res => res.json())
      .then(data => {
        setFees(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching fees:', err);
        setLoading(false);
      });
  }, [student.id]);

  if (loading) {
    return <div className="text-center py-10">Loading fee records...</div>;
  }

  const totalPaid = fees.reduce((sum, record) => sum + Number(record.amount), 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h3 className="text-2xl font-bold text-slate-800">Fee Payment History</h3>
          <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
            <span className="text-sm text-blue-600 font-semibold mr-2">Total Paid:</span>
            <span className="text-xl font-bold text-blue-900">₹{totalPaid}</span>
          </div>
        </div>

        {fees.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-xl">
            No fee payment records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Month/Term</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {fees.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {record.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                      ₹{record.amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {record.remarks || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function IDCardTab({ student }: { student: any }) {
  const [logoUrl, setLogoUrl] = useState('');
  const [schoolName, setSchoolName] = useState('School Name');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.logo_url) setLogoUrl(data.logo_url);
        if (data.school_name) setSchoolName(data.school_name);
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6 border-b pb-4 print:hidden">
          <h3 className="text-2xl font-bold text-slate-800">Student ID Card</h3>
          <button 
            onClick={() => window.print()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Print ID Card
          </button>
        </div>

        <div className="flex justify-center py-8 print:py-0">
          {/* ID Card Container */}
          <div className="w-[300px] h-[450px] border-2 border-slate-200 rounded-xl overflow-hidden shadow-lg bg-white relative print:shadow-none print:border-black">
            {/* Header */}
            <div className="bg-blue-800 text-white p-4 text-center">
              {logoUrl && (
                <img src={logoUrl} alt="School Logo" className="h-12 w-12 mx-auto mb-2 object-contain bg-white rounded-full p-1" />
              )}
              <h2 className="font-bold text-sm uppercase tracking-wider leading-tight">{schoolName}</h2>
              <p className="text-[10px] text-blue-200 mt-1">STUDENT IDENTITY CARD</p>
            </div>

            {/* Photo Area */}
            <div className="flex justify-center mt-6">
              <div className="w-24 h-24 bg-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center overflow-hidden">
                {student.photo_url ? (
                  <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400 text-xs">Photo</span>
                )}
              </div>
            </div>

            {/* Student Details */}
            <div className="px-6 mt-4 text-center">
              <h3 className="font-bold text-lg text-slate-800">{student.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{student.class_name}</p>
              
              <div className="text-left text-xs space-y-2 text-slate-700">
                <div className="grid grid-cols-[80px_1fr]">
                  <span className="font-semibold text-slate-500">Roll No:</span>
                  <span className="font-medium">{student.roll_no}</span>
                </div>
                <div className="grid grid-cols-[80px_1fr]">
                  <span className="font-semibold text-slate-500">DOB:</span>
                  <span className="font-medium">{student.dob ? new Date(student.dob).toLocaleDateString() : '-'}</span>
                </div>
                <div className="grid grid-cols-[80px_1fr]">
                  <span className="font-semibold text-slate-500">Blood Grp:</span>
                  <span className="font-medium">{student.blood_group || '-'}</span>
                </div>
                <div className="grid grid-cols-[80px_1fr]">
                  <span className="font-semibold text-slate-500">Contact:</span>
                  <span className="font-medium">{student.phone || '-'}</span>
                </div>
              </div>
            </div>

            {/* Footer / Signature */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end border-t border-slate-100 bg-slate-50">
              <div className="text-[10px] text-slate-400 text-center w-full">
                <div className="h-8 border-b border-slate-300 mb-1 w-20 mx-auto"></div>
                Principal Signature
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
