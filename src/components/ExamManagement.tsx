import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

export default function ExamManagement() {
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [newExam, setNewExam] = useState({ title: '', description: '', duration: 30 });
  const [question, setQuestion] = useState({
    question_en: '', question_hi: '',
    options_en: ['', '', '', ''], options_hi: ['', '', '', ''],
    image_url: '', math_formula: '', correct_option: 0
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    const res = await fetch('/api/exams', { headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` } });
    if (res.ok) setExams(await res.json());
  };

  const createExam = async () => {
    const res = await fetch('/api/admin/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
      body: JSON.stringify(newExam)
    });
    if (res.ok) {
      fetchExams();
      setNewExam({ title: '', description: '', duration: 30 });
    }
  };

  const addQuestion = async () => {
    if (!selectedExam) return;
    const res = await fetch(`/api/admin/exams/${selectedExam}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
      body: JSON.stringify({ questions: [question] })
    });
    if (res.ok) {
      setQuestion({
        question_en: '', question_hi: '',
        options_en: ['', '', '', ''], options_hi: ['', '', '', ''],
        image_url: '', math_formula: '', correct_option: 0
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold mb-4">Create New Exam</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Title" value={newExam.title} onChange={e => setNewExam({...newExam, title: e.target.value})} className="p-2 border rounded" />
          <input type="text" placeholder="Description" value={newExam.description} onChange={e => setNewExam({...newExam, description: e.target.value})} className="p-2 border rounded" />
          <input type="number" placeholder="Duration (min)" value={newExam.duration} onChange={e => setNewExam({...newExam, duration: parseInt(e.target.value)})} className="p-2 border rounded" />
        </div>
        <button onClick={createExam} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Create Exam
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold mb-4">Add Question</h3>
        <select onChange={e => setSelectedExam(e.target.value)} className="w-full p-2 border rounded mb-4">
          <option value="">Select Exam</option>
          {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Question (EN)" value={question.question_en} onChange={e => setQuestion({...question, question_en: e.target.value})} className="p-2 border rounded" />
          <input type="text" placeholder="Question (HI)" value={question.question_hi} onChange={e => setQuestion({...question, question_hi: e.target.value})} className="p-2 border rounded" />
          <input type="text" placeholder="Image URL (Optional)" value={question.image_url} onChange={e => setQuestion({...question, image_url: e.target.value})} className="p-2 border rounded" />
          <input type="text" placeholder="Math Formula (LaTeX)" value={question.math_formula} onChange={e => setQuestion({...question, math_formula: e.target.value})} className="p-2 border rounded" />
        </div>
        <button onClick={addQuestion} className="mt-4 bg-green-600 text-white px-4 py-2 rounded flex items-center">
          <Save className="h-4 w-4 mr-2" /> Add Question
        </button>
      </div>
    </div>
  );
}
