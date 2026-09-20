import React, { useState } from 'react';
import { School } from '../types';
import { School as SchoolIcon, Plus, Edit2, Check, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface SchoolsManagementViewProps {
  schools: School[];
  currentSchool: School | null;
  onSelectSchool: (school: School) => void;
  onRefreshSchools: () => void;
}

export const SchoolsManagementView: React.FC<SchoolsManagementViewProps> = ({
  schools,
  currentSchool,
  onSelectSchool,
  onRefreshSchools
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<School>>({
    name: '',
    address: '',
    board: 'CBSE',
    defaultInstructions: [
      'All questions are compulsory.',
      'Write your Name, Roll Number, and Date clearly.',
      'Marks for each question are indicated against it.'
    ]
  });

  const handleOpenNew = () => {
    setFormData({
      id: `school-${Date.now()}`,
      name: '',
      address: '',
      board: 'CBSE',
      defaultInstructions: [
        'All questions are compulsory.',
        'Write your Name, Roll Number, and Date clearly on top of the answer sheet.',
        'Marks for each question are indicated against it.'
      ]
    });
    setIsEditing(true);
  };

  const handleEdit = (school: School) => {
    setFormData(JSON.parse(JSON.stringify(school)));
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      alert('School name is required');
      return;
    }
    try {
      await api.saveSchool(formData as School);
      setIsEditing(false);
      onRefreshSchools();
    } catch (e) {
      console.error(e);
      alert('Failed to save school');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <SchoolIcon className="w-3.5 h-3.5" />
            <span>Multi-Tenant School Profiles</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Schools & Branding</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure school headers, official addresses, affiliation boards, and exam instructions.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add School Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {schools.map(s => {
          const isCurrent = currentSchool?.id === s.id;
          return (
            <div
              key={s.id}
              className={`bg-white p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isCurrent
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-base">
                    {s.name.charAt(0)}
                  </div>
                  {isCurrent && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active School
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3">{s.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span>{s.address}</span>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800">Affiliation: {s.board || 'CBSE'}</div>
                  <div className="text-[11px] text-slate-400">
                    {s.defaultInstructions?.length || 0} Default Exam Instructions
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={() => onSelectSchool(s)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  {isCurrent ? 'Current' : 'Select as Active'}
                </button>

                <button
                  onClick={() => handleEdit(s)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">Configure School Profile</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">School Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aura International School"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Address / Header Tagline</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Sector 14, Institutional Area, New Delhi - 110001"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Affiliation Board</label>
                <select
                  value={formData.board}
                  onChange={e => setFormData({ ...formData, board: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                >
                  <option value="CBSE">Central Board of Secondary Education (CBSE)</option>
                  <option value="ICSE">ICSE / ISC</option>
                  <option value="State Board">State Examination Board</option>
                  <option value="Cambridge / IB">Cambridge International / IB</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Default General Instructions (One per line)</label>
                <textarea
                  rows={4}
                  value={(formData.defaultInstructions || []).join('\n')}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      defaultInstructions: e.target.value.split('\n').filter(Boolean)
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer"
              >
                Save School
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
