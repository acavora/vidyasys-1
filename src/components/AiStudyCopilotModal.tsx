import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  BookOpen,
  Cpu,
  GraduationCap,
  Copy,
  Check,
  RotateCcw,
  Zap,
  HelpCircle,
  Calculator,
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';
import { SubjectBranch } from '../types';

interface AiStudyCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBranch?: SubjectBranch | 'All';
  onNavigateToNotes?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  subjectTag?: string;
  timestamp: string;
  highYieldPoints?: string[];
  recommendedNotes?: { title: string; author: string; price: number }[];
}

const PRESET_PROMPTS = [
  {
    icon: '📝',
    label: '5 High-Yield Midsem Questions',
    query: 'Generate 5 high-yield midsem exam questions for Operating Systems (Virtual Memory & Paging) with step-by-step solutions and typical grading marks distribution.',
    subject: 'Operating Systems'
  },
  {
    icon: '⚡',
    label: 'Feynman Technique: Paging vs Segmentation',
    query: 'Explain Paging vs Segmentation using the Feynman Technique (plain simple analogy suitable for a 2nd year engineering student).',
    subject: 'Computer Science'
  },
  {
    icon: '📐',
    label: 'Formula & Derivation Cheat Sheet',
    query: 'Give me a formula cheat sheet for Digital Signal Processing (DFT, FFT butterfly stages, and Z-transform ROC properties).',
    subject: 'Electronics & Comm.'
  },
  {
    icon: '⏱️',
    label: '3-Day Emergency Cram Roadmap',
    query: 'I have my endsem in 3 days. Outline a 72-hour high-efficiency revision schedule to cover 80% of the syllabus with minimal burnout.',
    subject: 'General Engineering'
  },
  {
    icon: '🔧',
    label: 'Hardware Kit Debugging Guide',
    query: 'My STM32 microcontroller is not transmitting telemetry over UART to the ESP32. What are the top 4 hardware & baud-rate troubleshooting steps?',
    subject: 'IoT & Hardware'
  }
];

export const AiStudyCopilotModal: React.FC<AiStudyCopilotModalProps> = ({
  isOpen,
  onClose,
  onNavigateToNotes,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Operating Systems');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `### Welcome to Vidyasys AI Study & Exam Copilot! 🎓

I am trained on verified top-grade engineering notes, professor lecture syllabi, and past university question papers across IITs, BITS, and state tech colleges.

**What I can do for you:**
- 📑 **Exam Prediction:** Generate likely 10-mark and 5-mark subjective questions with full model answers.
- 💡 **Feynman Explanations:** Break down dense theoretical derivations into intuitive real-world mental models.
- 📐 **Quick Formula Sheets:** Compact LaTeX cheat sheets for formulas and time complexity.
- 🛠️ **Project Diagnostics:** Debug hardware schematics, BOM parts, and code algorithms.

Pick a quick prompt below or ask any academic question!`,
      timestamp: 'Just now',
      highYieldPoints: [
        'Mapped to University Semester Curriculums',
        'Referenced against Senior Topper Handouts',
        'Instant Step-by-Step Derivations'
      ]
    }
  ]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isGenerating) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsGenerating(true);

    // Generate response
    setTimeout(() => {
      let aiResponseContent = '';
      let highYield: string[] = [];
      let recNotes: { title: string; author: string; price: number }[] = [];

      const lowerQ = query.toLowerCase();

      if (lowerQ.includes('midsem') || lowerQ.includes('question') || lowerQ.includes('paging')) {
        aiResponseContent = `### 🎯 High-Yield Exam Questions: Virtual Memory & Paging

#### Q1 (8 Marks): Multi-Level Paging vs Inverted Page Tables
**Question:** Why do modern 64-bit architectures avoid simple flat page tables? Calculate the size of a single-level page table for a 48-bit virtual address space with 4KB pages and 8-byte PTEs. Explain how Inverted Page Tables (IPT) solve this.
**Model Answer Outline:**
1. Number of pages = $2^{48} / 2^{12} = 2^{36}$ entries.
2. Page table size = $2^{36} \\times 8\\text{ bytes} = 512\\text{ Gigabytes}$ per process — completely unfeasible for RAM!
3. **Inverted Page Table:** Indexes by physical frame number ($f$) rather than virtual page number ($p$). Uses a hash anchor table $H(p, \\text{pid}) \\to f$, bounding memory to physical RAM size ($O(\\text{RAM})$).

#### Q2 (6 Marks): Translation Lookaside Buffer (TLB) Hit Ratio
**Question:** A system has a TLB access time of 2 ns and main memory access time of 100 ns. What is the effective memory access time (EMAT) if the TLB hit ratio is 95%?
**Solution:**
$$\\text{EMAT} = 0.95 \\times (2 + 100) + 0.05 \\times (2 + 100 + 100) = 96.9 + 10.1 = 107\\text{ ns}$$

#### Q3 (6 Marks): Belady's Anomaly
**Question:** Define Belady's Anomaly. Which page replacement algorithms are immune to it, and why?
**Answer:** FIFO replacement can yield *more* page faults when allocated *more* memory frames. Stack algorithms (LRU, Optimal) satisfy the inclusion property $M(m) \\subseteq M(m+1)$ and are provably immune.`;

        highYield: [
          'Frequent Midsem Topic (Appears in 85% of university exams)',
          'Formula: EMAT = Hit% * (t_TLB + t_RAM) + Miss% * (t_TLB + 2*t_RAM)',
          'Key Distinction: FIFO vs LRU Stack Property'
        ];

        recNotes = [
          {
            title: 'Operating Systems & Linux Kernel Internals (Complete Exam Handout)',
            author: 'Aditya Deshmukh (AP Grade, IIT Bombay)',
            price: 49
          }
        ];
      } else if (lowerQ.includes('feynman') || lowerQ.includes('analogy')) {
        aiResponseContent = `### 🧠 Feynman Analogy: Paging vs Segmentation

Imagine your college library has two different ways to store academic knowledge:

#### 1. Paging = Standardized 100-Page Spiral Notebooks
- **The Concept:** Memory is chopped into identically sized, fixed pieces (e.g. 4KB pages).
- **The Analogy:** If your course has 350 pages of content, the library assigns you exactly four 100-page spiral pads. The last pad has 50 empty pages wasted (**Internal Fragmentation**).
- **The Advantage:** Zero headache finding a shelf! Any page fits into any empty shelf slot (**No External Fragmentation**). The student (hardware) doesn't care if chapter 1 and chapter 2 sit on different floors.

#### 2. Segmentation = Custom Tailored Books
- **The Concept:** Memory is divided into logical chunks matching human thinking: one segment for \`main()\`, one for the \`stack\`, one for the \`math_library\`.
- **The Analogy:** Each book is cut to its exact length (e.g., 23 pages, 140 pages, 5 pages).
- **The Advantage:** Protection & Sharing are natural! You can lock the "read-only textbook" segment without touching the "rough notes" segment.
- **The Cost:** After books are returned, you have weird 12-page gaps on the shelves where a 20-page book won't fit (**External Fragmentation**).

#### 💡 University Synthesis:
Modern Operating Systems combine both: **Paged Segmentation**. Segments represent logical code/data divisions, but each segment is stored across fixed 4KB pages!`;

        highYield = [
          'Paging suffers from Internal Fragmentation, NOT External',
          'Segmentation suffers from External Fragmentation',
          'Modern CPUs use Paged Segmentation (x86_64)'
        ];
      } else if (lowerQ.includes('cram') || lowerQ.includes('roadmap') || lowerQ.includes('3-day')) {
        aiResponseContent = `### ⏱️ 72-Hour Exam Cram Strategy (The Pareto 80/20 Protocol)

#### Day 1 (Hours 1–12): High-Weightage Core Theory & Formulas
- **Morning (08:00 - 12:00):** Download senior notes with high ratings. Review only the summary chapter & formula boxes.
- **Afternoon (14:00 - 18:00):** Tackle the two guaranteed units (usually Unit 2 & Unit 3, which carry 45-50% of the marks).
- **Night (20:00 - 23:30):** Handwrite the 10 most recurring mathematical derivations on blank paper without looking.

#### Day 2 (Hours 13–24): Past 3 Years' Question Papers (PYQs)
- **Morning:** Solve the 2024 and 2023 Endsem paper under timed conditions.
- **Afternoon:** Cross-verify against Vidyasys solved answer keys. Note where professors deduct marks for missing diagrams or units.
- **Night:** Identify your 2 weak areas and book a 1-hour fast peer tutor session or review senior diagrams.

#### Day 3 (Hours 25–36): Active Recall & Sleep Protection
- **Morning:** Flashcard run-through of all acronyms, definitions, and boundary condition assumptions.
- **Afternoon:** Re-derive the top 5 proofs once more.
- **Mandatory:** Sleep minimum 7 hours before the exam. Memory consolidation occurs during REM sleep!`;

        highYield = [
          'Never start by reading textbooks cover-to-cover 3 days before',
          '70% of endsem marks come from PYQ recurring variations',
          'Diagrams with clean labels earn 30% partial credit even if math fails'
        ];
      } else {
        aiResponseContent = `### 📚 Vidyasys Academic Response for: "${query}"

Here is a structured breakdown based on campus university curriculum:

#### 1. Core Principles & Theoretical Foundation
- **Fundamental Law:** In academic evaluations, examiners look for precise terminology, state transition invariants, and explicit assumptions.
- **Mathematical Invariant:** Ensure equations specify boundary conditions (e.g. $t \\ge 0$, matrix non-singularity).

#### 2. Exam Derivation / Practical Architecture
- Break down the multi-stage pipeline:
  1. Input sanitization & boundary validation.
  2. Core state transformation / algorithmic loop.
  3. Complexity bounds: Time complexity $O(n \\log n)$, Space complexity $O(n)$.

#### 3. Common Examiner Trap & Pitfall
- Students frequently lose 3 to 4 marks by omitting the worst-case boundary conditions or failing to draw the accompanying circuit / block diagram.

*(Tip: You can rent the full verified lecture handout for this course from our Notes Hub for as low as ₹49).*`;

        highYield = [
          'Examiner favourite: Always write boundary conditions',
          'Include block diagrams for high subjective marks',
          'Check Vidyasys Notes Hub for full module handwritten notes'
        ];
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiResponseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        highYieldPoints: highYield,
        recommendedNotes: recNotes,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsGenerating(false);
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        id="ai-study-copilot-dialog"
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-white via-indigo-50/60 to-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-blue-500 to-teal-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Vidyasys AI Study & Exam Copilot
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  Campus Exam Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Ask anything about courses, midsem proofs, high-yield formulas, or project debugging.
              </p>
            </div>
          </div>

          <button
            id="close-copilot-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Quick Actions Bar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            High-Yield:
          </span>
          {PRESET_PROMPTS.map((preset, idx) => (
            <button
              key={idx}
              id={`preset-prompt-${idx}`}
              onClick={() => handleSend(preset.query)}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 text-xs text-slate-700 hover:text-indigo-700 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>{preset.icon}</span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-500">
                <span>{msg.role === 'user' ? 'You (Student)' : 'Vidyasys Copilot'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-3xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed border ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none shadow-xs'
                    : 'bg-white text-slate-800 border-slate-200 rounded-tl-none shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line text-slate-800">
                  {msg.content}
                </div>

                {/* High Yield Callout Box */}
                {msg.highYieldPoints && msg.highYieldPoints.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-800 font-semibold mb-2">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>Exam High-Yield Takeaways:</span>
                    </div>
                    <ul className="space-y-1 text-slate-700">
                      {msg.highYieldPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Marketplace Notes */}
                {msg.recommendedNotes && msg.recommendedNotes.length > 0 && (
                  <div className="mt-4 p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          Verified Topper Handout Available:
                        </p>
                        <p className="text-[11px] text-slate-600">
                          {msg.recommendedNotes[0].title} • Rent for ₹{msg.recommendedNotes[0].price}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        if (onNavigateToNotes) onNavigateToNotes();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <span>View Note</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Action Bar for Assistant Messages */}
                {msg.role === 'assistant' && (
                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      Verified against College Curriculum
                    </span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center gap-1 hover:text-slate-900 transition cursor-pointer font-medium"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Response</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 max-w-sm shadow-xs">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing curriculum & synthesizing answer...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="ai-copilot-query-input"
              type="text"
              placeholder="Ask an exam question, proof derivation, or concept (e.g. 'Derive Shannon channel capacity')..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition"
            />
            <button
              id="ai-copilot-submit-btn"
              type="submit"
              disabled={!inputQuery.trim() || isGenerating}
              className={`px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-xs ${
                inputQuery.trim() && !isGenerating
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-500 mt-2 text-center">
            Vidyasys Copilot aids exam prep & concept clarity. Verify calculations with professor guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};
