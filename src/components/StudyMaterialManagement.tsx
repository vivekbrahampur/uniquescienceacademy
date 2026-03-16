import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { Plus, Trash2, BookOpen } from 'lucide-react';

export default function StudyMaterialManagement() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [topicTitle, setTopicTitle] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    const snapshot = await getDocs(collection(db, 'study_materials'));
    setMaterials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addMaterial = async () => {
    if (!className || !subject || !topicTitle || !linkTitle || !linkUrl) return;
    
    // In a real app, you'd check if material for this class/subject exists and update it.
    // For simplicity, let's just add a new one.
    await addDoc(collection(db, 'study_materials'), {
      class_name: className,
      subject: subject,
      topics: [{ title: topicTitle, links: [{ title: linkTitle, url: linkUrl }] }],
      createdAt: new Date().toISOString()
    });
    fetchMaterials();
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Study Material Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input placeholder="Class" value={className} onChange={e => setClassName(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Topic Title" value={topicTitle} onChange={e => setTopicTitle(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Link Title" value={linkTitle} onChange={e => setLinkTitle(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Google Drive Link" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="p-2 border rounded md:col-span-2" />
        <button onClick={addMaterial} className="bg-blue-900 text-white p-2 rounded flex items-center justify-center">
          <Plus className="mr-2" /> Add Material
        </button>
      </div>
      <div className="space-y-4">
        {materials.map(m => (
          <div key={m.id} className="p-4 border rounded">
            <h3 className="font-bold">{m.class_name} - {m.subject}</h3>
            {m.topics.map((t: any, i: number) => (
              <div key={i} className="ml-4 mt-2">
                <p className="font-semibold">{t.title}</p>
                {t.links.map((l: any, j: number) => (
                  <a key={j} href={l.url} target="_blank" className="block text-blue-600 underline">{l.title}</a>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
