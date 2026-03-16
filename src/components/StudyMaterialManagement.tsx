import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { CLASSES, SUBJECTS } from '../constants';

export default function StudyMaterialManagement() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [className, setClassName] = useState(CLASSES[0]);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [folderName, setFolderName] = useState('');
  const [topicTitle, setTopicTitle] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    console.log("Fetching materials...");
    try {
      const snapshot = await getDocs(collection(db, 'study_materials'));
      setMaterials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      console.log("Materials fetched successfully");
    } catch (error) {
      console.error("Error fetching materials: ", error);
    }
  };

  const addMaterial = async () => {
    console.log("Attempting to add material:", { className, subject, folderName, topicTitle, linkTitle, linkUrl, db });
    if (!db) {
      console.error("Firestore db is not initialized");
      alert("Database not initialized. Please try again later.");
      return;
    }
    if (!className || !subject || !folderName || !topicTitle || !linkTitle || !linkUrl) {
      console.error("Validation failed: missing fields", { className, subject, folderName, topicTitle, linkTitle, linkUrl });
      alert("Please fill in all fields.");
      return;
    }
    
    try {
      await addDoc(collection(db, 'study_materials'), {
        class_name: className,
        subject: subject,
        folder_name: folderName,
        topics: [{ title: topicTitle, links: [{ title: linkTitle, url: linkUrl }] }],
        createdAt: new Date().toISOString()
      });
      fetchMaterials();
      setTopicTitle('');
      setLinkTitle('');
      setLinkUrl('');
      console.log("Material added successfully");
    } catch (error) {
      console.error("Error adding material: ", error);
      alert("Failed to upload study material. Please try again.");
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'study_materials', id));
      fetchMaterials();
    } catch (error) {
      console.error("Error deleting material: ", error);
      alert("Failed to delete study material. Please try again.");
    }
  };

  const groupedMaterials = materials.reduce((acc, m) => {
    const key = `${m.class_name} - ${m.subject} - ${m.folder_name}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Study Material Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select value={className} onChange={e => setClassName(e.target.value)} className="p-2 border rounded">
          {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={subject} onChange={e => setSubject(e.target.value)} className="p-2 border rounded">
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input placeholder="Folder Name" value={folderName} onChange={e => setFolderName(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Topic Title" value={topicTitle} onChange={e => setTopicTitle(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Link Title" value={linkTitle} onChange={e => setLinkTitle(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Google Drive Link" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="p-2 border rounded md:col-span-2" />
        <button onClick={addMaterial} className="bg-blue-900 text-white p-2 rounded flex items-center justify-center">
          <Plus className="mr-2" /> Add Material
        </button>
      </div>
      <div className="space-y-4">
        {Object.entries(groupedMaterials).map(([key, mats]: [string, any[]]) => (
          <div key={key} className="p-4 border rounded">
            <h3 className="font-bold">{key}</h3>
            {mats.map((m: any) => (
              <div key={m.id} className="ml-4 mt-2 flex justify-between items-center">
                <div>
                  {m.topics.map((t: any, i: number) => (
                    <div key={i}>
                      <p className="font-semibold">{t.title}</p>
                      {t.links.map((l: any, j: number) => (
                        <a key={j} href={l.url} target="_blank" className="block text-blue-600 underline">{l.title}</a>
                      ))}
                    </div>
                  ))}
                </div>
                <button onClick={() => deleteMaterial(m.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
