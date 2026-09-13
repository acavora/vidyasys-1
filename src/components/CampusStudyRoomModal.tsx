import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Users,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  MessageSquare,
  Send,
  Building2,
  Award
} from 'lucide-react';
import { Campus, CampusId } from '../types';

interface CampusStudyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCampus: CampusId;
  campuses: Campus[];
}

interface PeerStudent {
  id: string;
  name: string;
  avatar: string;
  college: string;
  currentTask: string;
  focusMinutes: number;
  isOnline: boolean;
}

interface StudyGoal {
  id: string;
  text: string;
  completed: boolean;
}

interface ChatMessage {
  id: string;
  author: string;
  college: string;
  text: string;
  time: string;
}

export const CampusStudyRoomModal: React.FC<CampusStudyRoomModalProps> = ({
  isOpen,
  onClose,
  selectedCampus,
  campuses,
}) => {
  const currentCampus = campuses.find((c) => c.id === selectedCampus) || campuses[0];

  // Pomodoro Timer States
  const [timerMode, setTimerMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [streakDays, setStreakDays] = useState<number>(5);

  // Focus Goals
  const [goals, setGoals] = useState<StudyGoal[]>([
    { id: 'g1', text: 'Revise Unit 3 Virtual Memory & Inverted Page Tables', completed: true },
    { id: 'g2', text: 'Solve 2024 Endsem Question 4 & 5 (XV6 traces)', completed: false },
    { id: 'g3', text: 'Summarize 10 DSP formulas for DFT butterfly stages', completed: false },
  ]);
  const [newGoalInput, setNewGoalInput] = useState('');

  // Live Batchmates
  const [peers] = useState<PeerStudent[]>([
    {
      id: 'p-vit',
      name: 'Tanmay Kulkarni',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      college: 'Vidyalankar Institute of Technology (VIT)',
      currentTask: 'Reviewing Vidyalankar Autonomous OS & Banker proofs',
      focusMinutes: 130,
      isOnline: true,
    },
    {
      id: 'p-vp',
      name: 'Aaditya Parab',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      college: 'Vidyalankar Polytechnic (VP)',
      currentTask: 'MSBTE K-Scheme Data Structures Algorithm Practice',
      focusMinutes: 95,
      isOnline: true,
    },
    {
      id: 'p1',
      name: 'Aditya Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      college: 'IIT Bombay',
      currentTask: 'Drafting OS Kernel Cheat Sheet',
      focusMinutes: 115,
      isOnline: true,
    },
    {
      id: 'p2',
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      college: 'BITS Pilani',
      currentTask: 'FPGA Verilog State Machine Testing',
      focusMinutes: 80,
      isOnline: true,
    },
    {
      id: 'p3',
      name: 'Rohan Mehra',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      college: 'DTU New Delhi',
      currentTask: 'Solving 2023 Endsem PYQs for Algorithms',
      focusMinutes: 45,
      isOnline: true,
    },
    {
      id: 'p4',
      name: 'Ananya Iyer',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      college: 'Anna University',
      currentTask: 'Reading Topper Handwritten Notes on DBMS',
      focusMinutes: 140,
      isOnline: true,
    },
  ]);

  // Live Campus Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-vit',
      author: 'Tanmay K.',
      college: 'Vidyalankar Institute of Technology (VIT)',
      text: 'B-Block 2nd floor library study pod 2 is open if anyone from Vidyalankar wants to go through Autonomous papers together!',
      time: '10:05 AM',
    },
    {
      id: 'm-vp',
      author: 'Aaditya P.',
      college: 'Vidyalankar Polytechnic (VP)',
      text: 'M-Block diploma lounge has the MSBTE K-Scheme model answer papers printed if anyone needs references!',
      time: '10:12 AM',
    },
    {
      id: 'm1',
      author: 'Aditya D.',
      college: 'IIT Bombay',
      text: 'Good luck everyone for the midsems! Paging proofs take 15 mins to master.',
      time: '10:14 AM',
    },
    {
      id: 'm2',
      author: 'Priya S.',
      college: 'BITS Pilani',
      text: 'Starting a 50-minute deep work block for Digital VLSI. Anyone else on this module?',
      time: '10:22 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const switchMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setTimerMode(mode);
    setIsActive(false);
    if (mode === 'focus') setTimeLeft(25 * 60);
    if (mode === 'shortBreak') setTimeLeft(5 * 60);
    if (mode === 'longBreak') setTimeLeft(15 * 60);
  };

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalInput.trim()) return;
    const newG: StudyGoal = {
      id: `goal-${Date.now()}`,
      text: newGoalInput.trim(),
      completed: false,
    };
    setGoals((prev) => [...prev, newG]);
    setNewGoalInput('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newM: ChatMessage = {
      id: `chat-${Date.now()}`,
      author: 'You (Student)',
      college: currentCampus.shortName,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newM]);
    setChatInput('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const maxTime = timerMode === 'focus' ? 25 * 60 : timerMode === 'shortBreak' ? 5 * 60 : 15 * 60;
  const progressPercent = ((maxTime - timeLeft) / maxTime) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        id="campus-study-room-dialog"
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-white via-emerald-50/50 to-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Virtual Campus Study Room
                </h2>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  38 Students Online ({currentCampus.shortName})
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Join peer batchmates for synchronized Pomodoro focus sprints & exam accountability.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50">
          {/* Left Column: Pomodoro Focus Timer & Personal Goals (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Timer Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-center gap-2 mb-4">
                <button
                  onClick={() => switchMode('focus')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    timerMode === 'focus'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  25m Exam Sprint
                </button>
                <button
                  onClick={() => switchMode('shortBreak')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    timerMode === 'shortBreak'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  5m Quick Breath
                </button>
                <button
                  onClick={() => switchMode('longBreak')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    timerMode === 'longBreak'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  15m Deep Rest
                </button>
              </div>

              {/* Digital Countdown Display */}
              <div className="my-5">
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 font-mono">
                  {formatTime(timeLeft)}
                </span>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  {timerMode === 'focus'
                    ? '🎯 Focus State: Reviewing notes & solving derivations'
                    : '☕ Relax your eyes, hydrate, and stretch'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-xs ${
                    isActive
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-4 h-4" /> Pause Sprint
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Start Focus Sprint
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsActive(false);
                    switchMode(timerMode);
                  }}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer border border-slate-200"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer border border-slate-200"
                  title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* Streak Badge */}
              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                  {streakDays} Days Study Streak
                </span>
                <span>Active with {currentCampus.name}</span>
              </div>
            </div>

            {/* Goals Checklist Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Today's Exam Study Goals</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  {goals.filter((g) => g.completed).length} of {goals.length} completed
                </span>
              </div>

              <div className="space-y-2">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs transition cursor-pointer"
                  >
                    <button className="flex-shrink-0 mt-0.5 text-slate-400 hover:text-emerald-600">
                      {goal.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <span
                      className={`leading-relaxed ${
                        goal.completed ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {goal.text}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={addGoal} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add a syllabus topic or problem to finish..."
                  value={newGoalInput}
                  onChange={(e) => setNewGoalInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newGoalInput.trim()}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Live Batchmates & Campus Study Feed (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Active Batchmates */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  Batchmates Studying Now
                </h4>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  Live
                </span>
              </div>

              <div className="space-y-2.5">
                {peers.map((peer) => (
                  <div
                    key={peer.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative flex-shrink-0">
                        <img
                          src={peer.avatar}
                          alt={peer.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-300"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{peer.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{peer.currentTask}</p>
                      </div>
                    </div>

                    <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded font-medium whitespace-nowrap">
                      {peer.focusMinutes}m focused
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Campus Shoutout & Q&A Stream */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col h-64 shadow-xs">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                Campus Study Feed
              </h4>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                      <span className="font-bold text-slate-800">{msg.author} ({msg.college})</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-slate-700 leading-snug">{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-200 mt-2">
                <input
                  type="text"
                  placeholder="Share what you're working on or ask..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-teal-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-indigo-600" />
            Connected to {currentCampus.name} Academic Ecosystem
          </span>
          <span className="text-emerald-700 font-semibold">99.4% Student Completion Rate</span>
        </div>
      </div>
    </div>
  );
};
