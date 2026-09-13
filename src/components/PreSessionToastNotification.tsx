import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Clock,
  MapPin,
  Calendar,
  X,
  ChevronRight,
  Ticket,
  Copy,
  Check,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Phone,
  ArrowRight,
  Download
} from 'lucide-react';
import { BookedTutorSession } from '../types';

export interface ToastMessage {
  id: string;
  title: string;
  desc: string;
  type?: 'success' | 'info' | 'alert';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface PreSessionToastNotificationProps {
  sessionAlert: BookedTutorSession | null;
  onDismissSessionAlert: () => void;
  onSnoozeSessionAlert: (minutes: number) => void;
  onViewSessionDetails: (session: BookedTutorSession) => void;
  generalToast: ToastMessage | null;
  onDismissGeneralToast: () => void;
}

/**
 * Generates a soft, pleasant 2-tone synthetic chime using Web Audio API
 */
export const playPreSessionChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // First tone (higher pleasant bell chime)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.18); // A5

    gain1.gain.setValueAtTime(0.09, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Second harmonious tone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, now + 0.08); // A4
    osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.26); // E5

    gain2.gain.setValueAtTime(0.06, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.6);
  } catch {
    // Gracefully handle browsers blocking audio autoplay
  }
};

export const PreSessionToastNotification: React.FC<PreSessionToastNotificationProps> = ({
  sessionAlert,
  onDismissSessionAlert,
  onSnoozeSessionAlert,
  onViewSessionDetails,
  generalToast,
  onDismissGeneralToast,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [countdownMinutes, setCountdownMinutes] = useState(58);

  // Play audio chime when a 1-hour pre-session alert appears
  useEffect(() => {
    if (sessionAlert) {
      playPreSessionChime();
    }
  }, [sessionAlert]);

  // Subtle countdown display
  useEffect(() => {
    if (!sessionAlert) return;
    const timer = setInterval(() => {
      setCountdownMinutes((prev) => (prev > 1 ? prev - 1 : 1));
    }, 60000);
    return () => clearInterval(timer);
  }, [sessionAlert]);

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div 
      id="toast-notification-system-portal"
      className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm sm:max-w-md w-full px-3 sm:px-0 pointer-events-none"
    >
      <AnimatePresence>
        {/* 1-Hour Pre-Session Toast Alert */}
        {sessionAlert && (
          <motion.div
            key={`session-alert-${sessionAlert.id}`}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pointer-events-auto bg-white border-2 border-indigo-500 rounded-2xl shadow-2xl overflow-hidden ring-4 ring-indigo-500/10"
          >
            {/* Top Alert Banner */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 px-4 py-2.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
                </span>
                <span className="text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5" />
                  1-Hour Pre-Session Alert
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
                  <Clock className="w-3 h-3" />
                  Starts in ~{sessionAlert.startsInMinutes || countdownMinutes}m
                </span>
                <button
                  id="dismiss-session-alert-btn"
                  onClick={onDismissSessionAlert}
                  className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition cursor-pointer"
                  title="Dismiss notification"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 bg-gradient-to-b from-indigo-50/40 via-white to-white space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={sessionAlert.tutorAvatar}
                  alt={sessionAlert.tutorName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200 flex-shrink-0 shadow-xs mt-0.5"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {sessionAlert.tutorName}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      {sessionAlert.collegeName || 'VIT Pune'}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-indigo-700 line-clamp-1 mt-0.5">
                    {sessionAlert.subject}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span className="font-medium text-slate-800">{sessionAlert.timeSlot}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">In-Person Meetup</span>
                  </div>
                </div>
              </div>

              {/* Venue & Location Highlight */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Campus Meeting Venue</span>
                    <span className="font-semibold text-slate-900 block leading-tight">
                      {sessionAlert.campusVenue}
                    </span>
                  </div>
                </div>

                {/* Session Passcode Quick Copy */}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/80">
                  <div className="flex items-center gap-1 font-mono text-[11px] text-slate-700">
                    <Ticket className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Pass:</span>
                    <strong className="text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                      {sessionAlert.sessionPassCode}
                    </strong>
                  </div>

                  <button
                    onClick={(e) => handleCopyCode(sessionAlert.sessionPassCode, e)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 transition cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  id="view-session-details-cta"
                  onClick={() => onViewSessionDetails(sessionAlert)}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer"
                >
                  <span>View College Pass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  id="snooze-session-alert-btn"
                  onClick={() => onSnoozeSessionAlert(10)}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer border border-slate-200"
                  title="Remind me again in 10 minutes"
                >
                  Snooze (10m)
                </button>

                <button
                  id="acknowledge-session-alert-btn"
                  onClick={onDismissSessionAlert}
                  className="py-2 px-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-xs font-medium transition cursor-pointer border border-slate-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Standard App Operational Toast */}
        {generalToast && (
          <motion.div
            key={`general-toast-${generalToast.id}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto bg-slate-900 text-white border border-slate-800 rounded-xl p-3.5 shadow-xl flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-white">{generalToast.title}</h5>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{generalToast.desc}</p>
                {generalToast.action && (
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        generalToast.action?.onClick();
                        onDismissGeneralToast();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{generalToast.action.label}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onDismissGeneralToast}
              className="text-slate-400 hover:text-white p-1 rounded transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
