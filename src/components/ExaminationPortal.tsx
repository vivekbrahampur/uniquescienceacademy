import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

declare const katex: any;

export default function ExaminationPortal({ student, showSuccess, showError }: { student: any, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [answers, setAnswers] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const mathRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) fetchQuestions(selectedExam.id);
  }, [selectedExam]);

  useEffect(() => {
    questions.forEach((q, i) => {
      if (q.math_formula && mathRefs.current[i]) {
        try {
          katex.render(q.math_formula, mathRefs.current[i]);
        } catch (e) {
          console.error('KaTeX error:', e);
        }
      }
    });
  }, [questions, language]);

  const fetchExams = async () => {
    const res = await fetch('/api/exams', { headers: { 'Authorization': `Bearer ${localStorage.getItem('studentToken')}` } });
    if (res.ok) setExams(await res.json());
  };

  const fetchQuestions = async (examId: string) => {
    const res = await fetch(`/api/exams/${examId}/questions`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('studentToken')}` } });
    if (res.ok) setQuestions(await res.json());
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev: any) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedExam) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/student/exams/${selectedExam.id}/submit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('studentToken')}`
        },
        body: JSON.stringify({
          studentId: student.id,
          student_name: student.name,
          score: 0, // Score calculation would happen on server or here
          answers: answers
        })
      });

      if (res.ok) {
        if (showSuccess) showSuccess('Exam submitted successfully!');
        setSelectedExam(null);
        setAnswers({});
      } else {
        if (showError) showError('Failed to submit exam');
      }
    } catch (err) {
      console.error(err);
      if (showError) showError('An error occurred during submission');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Examination Portal</h3>
        <select value={language} onChange={e => setLanguage(e.target.value as 'en' | 'hi')} className="p-2 border rounded">
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
      </div>
      {!selectedExam ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.map(exam => (
            <div key={exam.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h4 className="text-lg font-bold">{exam.title}</h4>
              <p className="text-slate-600 mb-4">{exam.description}</p>
              <button onClick={() => setSelectedExam(exam)} className="bg-blue-900 text-white px-4 py-2 rounded flex items-center">
                <Play className="h-4 w-4 mr-2" /> Start Exam
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-bold">{selectedExam.title}</h4>
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Exam'}
            </button>
          </div>
          {questions.map((q, i) => (
            <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <p className="font-bold mb-4">{language === 'en' ? q.question_en : q.question_hi}</p>
              {q.math_formula && <div ref={el => mathRefs.current[i] = el} className="mb-4" />}
              {q.image_url && <img src={q.image_url} alt="Question" className="max-w-full mb-4 rounded-lg" referrerPolicy="no-referrer" />}
              
              <div className="space-y-2">
                <textarea 
                  placeholder="Write your answer here..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
              </div>
            </div>
          ))}
          <div className="flex justify-center pt-4">
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="bg-green-600 text-white px-10 py-3 rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Final Submit Exam'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
