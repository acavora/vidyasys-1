import React, { useState } from 'react';
import { 
  Share2, 
  Download, 
  ThumbsUp, 
  CheckCircle, 
  FileText, 
  FileCheck, 
  Sparkles, 
  Filter, 
  Search, 
  PlusCircle,
  HelpCircle,
  BookMarked
} from 'lucide-react';
import { CampusResourceItem, ResourceType, CampusId, SubjectBranch } from '../types';

interface CampusResourcesHubProps {
  resources: CampusResourceItem[];
  selectedCampus: CampusId;
  selectedBranch: SubjectBranch | 'All';
  searchQuery: string;
  onUpvoteResource: (resourceId: string) => void;
  onDownloadResource: (resource: CampusResourceItem) => void;
  onOpenUploadModal: () => void;
}

export const CampusResourcesHub: React.FC<CampusResourcesHubProps> = ({
  resources,
  selectedCampus,
  selectedBranch,
  searchQuery,
  onUpvoteResource,
  onDownloadResource,
  onOpenUploadModal,
}) => {
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');

  const filteredResources = resources.filter((res) => {
    // Campus filter
    if (selectedCampus !== 'all' && res.collegeId !== selectedCampus) {
      return false;
    }
    // Branch filter
    if (selectedBranch !== 'All' && res.branch !== selectedBranch) {
      return false;
    }
    // Type filter
    if (selectedType !== 'all' && res.type !== selectedType) {
      return false;
    }
    // Semester filter
    if (selectedSemester !== 'all' && res.semester !== selectedSemester) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchSubj = res.subject.toLowerCase().includes(q);
      const matchUploader = res.uploadedBy.toLowerCase().includes(q);
      if (!matchTitle && !matchSubj && !matchUploader) return false;
    }
    return true;
  });

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Share2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Campus Academic Community Commons (Free)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Free academic repository powered by student solidarity: download solved PYQs, lab manuals, viva question banks, and exam cheatsheets.
          </p>
        </div>

        <button
          id="upload-resource-cta"
          onClick={onOpenUploadModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs transition cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Academic Resource</span>
        </button>
      </div>

      {/* Filter Tabs & Semesters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Type pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'pyq', label: '📝 Past Exam Papers (PYQs)' },
            { id: 'lab_manual', label: '🧪 Lab Manuals & Codes' },
            { id: 'formula_sheet', label: '📐 Formula Cheatsheets' },
            { id: 'viva_prep', label: '🎙️ Viva Voce Question Banks' },
            { id: 'cheatsheet', label: '⚡ Revision Quick Notes' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedType(item.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                selectedType === item.id
                  ? 'bg-amber-50 text-amber-900 border border-amber-300 font-semibold shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Semester Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
          <span className="text-slate-500">Semester:</span>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-transparent text-slate-800 font-medium outline-none cursor-pointer"
          >
            <option value="all" className="bg-white text-slate-900">All</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s} className="bg-white text-slate-900">
                Sem {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources List */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
          <Share2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No community resources found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Be the first to upload past year question papers or lab manuals for your batch!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              id={`resource-card-${res.id}`}
              className="p-5 rounded-2xl bg-white hover:border-slate-300 border border-slate-200 transition flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                      {res.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-500">
                      Sem {res.semester} • {res.collegeName}
                    </span>
                  </div>

                  {res.verifiedByFaculty && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      <CheckCircle className="w-3 h-3 text-teal-600" />
                      Faculty Solution Key
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 hover:text-amber-700 transition-colors leading-snug">
                  {res.title}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <span className="text-slate-700 font-medium">{res.subject}</span>
                  <span>•</span>
                  <span>{res.fileFormat}</span>
                  <span>•</span>
                  <span>{res.fileSize}</span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <img
                    src={res.authorAvatar}
                    alt={res.uploadedBy}
                    className="w-5 h-5 rounded-full object-cover border border-slate-200"
                  />
                  <span>Shared by <strong className="text-slate-800">{res.uploadedBy}</strong></span>
                  <span>•</span>
                  <span>{res.dateAdded}</span>
                </div>
              </div>

              {/* Action buttons: Upvote & Download */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  id={`upvote-res-${res.id}`}
                  onClick={() => onUpvoteResource(res.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-amber-700 text-xs font-medium border border-slate-200 transition cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>Upvote ({res.upvotes})</span>
                </button>

                <button
                  id={`download-res-${res.id}`}
                  onClick={() => onDownloadResource(res)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Free Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
