import React, { useState } from 'react';
import { 
  Cpu, 
  Package, 
  Code, 
  ShieldCheck, 
  Star, 
  Tag, 
  ExternalLink, 
  Clock, 
  ShoppingCart, 
  Sparkles, 
  CheckCircle2, 
  Boxes,
  Truck,
  FileCheck2,
  Bookmark,
  Shield,
  Zap
} from 'lucide-react';
import { ProjectItem, ProjectCategory, CampusId, SubjectBranch } from '../types';

interface ProjectsMarketplaceProps {
  projects: ProjectItem[];
  selectedCampus: CampusId;
  selectedBranch: SubjectBranch | 'All';
  searchQuery: string;
  onSelectProject: (project: ProjectItem) => void;
  bookmarkedIds?: string[];
  onToggleBookmark?: (id: string) => void;
}

export const ProjectsMarketplace: React.FC<ProjectsMarketplaceProps> = ({
  projects,
  selectedCampus,
  selectedBranch,
  searchQuery,
  onSelectProject,
  bookmarkedIds = [],
  onToggleBookmark,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');
  const [hardwareOnly, setHardwareOnly] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'all' | 'rent' | 'sale'>('all');

  const filteredProjects = projects.filter((project) => {
    // Campus filter
    if (selectedCampus !== 'all' && project.collegeId !== selectedCampus) {
      return false;
    }
    // Branch filter
    if (selectedBranch !== 'All' && project.branch !== selectedBranch) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'all' && project.category !== selectedCategory) {
      return false;
    }
    // Hardware kit filter
    if (hardwareOnly && !project.hasHardwareKit) {
      return false;
    }
    // Mode filter
    if (filterMode === 'rent' && !project.forRent) return false;
    if (filterMode === 'sale' && !project.forSale) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = project.title.toLowerCase().includes(q);
      const matchDesc = project.description.toLowerCase().includes(q);
      const matchStack = project.techStack.some((t) => t.toLowerCase().includes(q));
      const matchAuthor = project.author.name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchStack && !matchAuthor) {
        return false;
      }
    }
    return true;
  });

  return (
    <section className="space-y-6">
      {/* Header & Categories */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
              <Cpu className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Academic & Hardware Projects Marketplace
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Buy, sell, or rent senior capstone projects, verified source code, schematics, and physical hardware prototype kits for reference and learning.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              id="filter-proj-mode-all"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                filterMode === 'all' ? 'bg-cyan-700 text-white font-medium shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Modes
            </button>
            <button
              id="filter-proj-mode-rent"
              onClick={() => setFilterMode('rent')}
              className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                filterMode === 'rent' ? 'bg-cyan-700 text-white font-medium shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔄 For Rent
            </button>
            <button
              id="filter-proj-mode-sale"
              onClick={() => setFilterMode('sale')}
              className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                filterMode === 'sale' ? 'bg-cyan-700 text-white font-medium shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💼 Buy Source
            </button>
          </div>

          <button
            id="toggle-hardware-kit-btn"
            onClick={() => setHardwareOnly(!hardwareOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition cursor-pointer ${
              hardwareOnly
                ? 'bg-cyan-50 text-cyan-800 border-cyan-300 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-cyan-600" />
            <span>Hardware Kits Available</span>
          </button>
        </div>
      </div>

      {/* Escrow Handover & Lab Viva Security Notice */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-50/70 via-white to-slate-50 border border-cyan-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-cyan-700 flex-shrink-0" />
          <span className="text-slate-700">
            <strong className="text-slate-900">Campus Escrow Protection:</strong> Hardware kit rentals include physical handover verification and refundable security deposits.
          </span>
        </div>
        <span className="text-cyan-800 font-semibold text-[11px] whitespace-nowrap">
          ✓ Verified Working in Lab Evaluations
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'All Projects' },
          { id: 'hardware', label: '🤖 Hardware & Robotics' },
          { id: 'iot', label: '📡 IoT & Embedded Systems' },
          { id: 'ai_ml', label: '🧠 AI, Vision & ML Models' },
          { id: 'fullstack', label: '💻 Distributed & Systems' },
          { id: 'cad_mechanical', label: '⚙️ CAD & Aerodynamics' },
        ].map((cat) => (
          <button
            key={cat.id}
            id={`proj-cat-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-cyan-700 text-white font-semibold shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-xs'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
          <Cpu className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No projects match the current filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try switching categories or clear your filters to explore more student projects and hardware prototypes.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-semibold border border-cyan-200 transition cursor-pointer"
              >
                Show All Categories
              </button>
            )}
            {hardwareOnly && (
              <button
                onClick={() => setHardwareOnly(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition cursor-pointer"
              >
                Include Software & ML
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredProjects.map((project) => {
            const isBookmarked = bookmarkedIds.includes(project.id);

            return (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                className="group flex flex-col justify-between bg-white hover:border-slate-300 border border-slate-200 rounded-2xl p-5 sm:p-6 transition-all shadow-xs hover:shadow-md"
              >
                <div>
                  {/* Header info & Bookmark */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200 uppercase tracking-wider">
                        {project.category.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-500">
                        {project.collegeName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {project.hasHardwareKit && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Truck className="w-3 h-3" />
                          Kit Avail.
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        {project.rating.toFixed(2)}
                      </span>

                      {onToggleBookmark && (
                        <button
                          onClick={() => onToggleBookmark(project.id)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            isBookmarked
                              ? 'bg-amber-50 border-amber-300 text-amber-600'
                              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                          }`}
                          title={isBookmarked ? 'Remove bookmark' : 'Bookmark project'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors leading-snug">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* Key Project Highlights */}
                  <div className="mt-3.5 space-y-1.5">
                    {project.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Author Credentials */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <img
                        src={project.author.avatar}
                        alt={project.author.name}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                      />
                      <span className="text-slate-800 font-medium truncate max-w-[200px]">
                        {project.author.name}
                      </span>
                    </div>

                    <span className="flex items-center gap-1 text-slate-500">
                      <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
                      Report Grade: <strong className="text-emerald-700">{project.documentationGrade}</strong>
                    </span>
                  </div>
                </div>

                {/* Action Footer: Rent vs Buy */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    {project.forRent && (
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-medium">Rent Code/Kit</span>
                        <p className="text-base font-bold text-cyan-700">
                          ₹{project.rentPricePerWeek}
                          <span className="text-xs text-slate-500 font-normal"> / week</span>
                        </p>
                      </div>
                    )}

                    {project.forSale && (
                      <div className="border-l border-slate-200 pl-4">
                        <span className="text-[10px] text-slate-500 uppercase font-medium">Buy Full Source</span>
                        <p className="text-base font-bold text-slate-900">
                          ₹{project.buyPrice}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    id={`inspect-project-${project.id}`}
                    onClick={() => onSelectProject(project)}
                    className="py-2.5 px-5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <Boxes className="w-4 h-4" />
                    <span>Inspect & Rent / Buy</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
