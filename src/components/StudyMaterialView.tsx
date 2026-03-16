import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Download, BookOpen } from 'lucide-react';

export default function StudyMaterialView({ studentClass }: { studentClass: string }) {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, [studentClass]);

  const fetchMaterials = async () => {
    setLoading(true);
    const q = query(collection(db, 'study_materials'), where('class_name', '==', studentClass));
    const snapshot = await getDocs(q);
    setMaterials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Study Materials</h2>
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-4">Loading study materials...</div>
        ) : materials.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No study materials found for this class.</div>
        ) : (
          materials.map(m => (
            <div key={m.id} className="p-4 border rounded-lg">
              <h3 className="text-xl font-bold text-blue-900 mb-2">{m.subject}</h3>
              {m.topics.map((t: any, i: number) => (
                <div key={i} className="ml-4 mt-3">
                  <p className="font-semibold text-slate-700">{t.title}</p>
                  <div className="space-y-2 mt-2">
                    {t.links.map((l: any, j: number) => (
                      <a key={j} href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800">
                        <Download className="h-4 w-4 mr-2" />
                        {l.title}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
