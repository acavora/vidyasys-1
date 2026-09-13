import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Star, 
  Percent, 
  MapPin, 
  Building2, 
  Sparkles, 
  MessageSquare,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { TutorItem } from '../types';

interface TutorBookingModalProps {
  tutor: TutorItem | null;
  onClose: () => void;
  onConfirmBooking: (
    tutor: TutorItem,
    subject: string,
    day: string,
    timeSlot: string,
    topicNote: string,
    campusVenue: string
  ) => void;
}

export const TutorBookingModal: React.FC<TutorBookingModalProps> = ({
  tutor,
  onClose,
  onConfirmBooking,
}) => {
  if (!tutor) return null;

  const defaultVenues = [
    `${tutor.collegeName} Central Library (2nd Floor Discussion Pods)`,
    `${tutor.major} Department Reading Hall`,
    `Student Activity Center (SAC) Peer Study Lounge`,
    `Campus Canteen / Central Plaza Discussion Tables`,
  ];

  const [selectedSubject, setSelectedSubject] = useState<string>(tutor.subjects[0] || '');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const currentDaySlots = tutor.availableSlots[selectedDayIndex] || tutor.availableSlots[0];
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(
    currentDaySlots?.times[0] || ''
  );
  const [selectedVenue, setSelectedVenue] = useState<string>(defaultVenues[0]);
  const [customVenue, setCustomVenue] = useState<string>('');
  const [useCustomVenue, setUseCustomVenue] = useState<boolean>(false);
  const [topicNote, setTopicNote] = useState<string>('');

  const tutorShare = Math.round(tutor.hourlyRate * 0.9);
  const platformFee = tutor.hourlyRate - tutorShare;

  const handleConfirm = () => {
    const finalVenue = useCustomVenue && customVenue.trim() ? customVenue.trim() : selectedVenue;
    onConfirmBooking(
      tutor,
      selectedSubject,
      currentDaySlots.day,
      selectedTimeSlot,
      topicNote,
      finalVenue
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="tutor-booking-modal-dialog"
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={tutor.avatar}
              alt={tutor.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Book 1-on-1 with {tutor.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  CGPA {tutor.cgpa}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {tutor.major} • {tutor.collegeName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-white">
          {/* Step 1: Select Subject */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              1. Select Course or Subject
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tutor.subjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`p-2.5 rounded-xl border text-xs text-left transition cursor-pointer flex items-center justify-between ${
                    selectedSubject === subj
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{subj}</span>
                  {selectedSubject === subj && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Choose Day & Time Slot */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              2. Choose Available Day & Time Slot
            </label>

            {/* Day Selector */}
            <div className="flex gap-2 mb-3">
              {tutor.availableSlots.map((slotGroup, idx) => (
                <button
                  key={slotGroup.day}
                  onClick={() => {
                    setSelectedDayIndex(idx);
                    setSelectedTimeSlot(slotGroup.times[0] || '');
                  }}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-medium transition cursor-pointer ${
                    selectedDayIndex === idx
                      ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {slotGroup.day}
                </button>
              ))}
            </div>

            {/* Time Slot Chips */}
            <div className="flex flex-wrap gap-2">
              {currentDaySlots.times.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    selectedTimeSlot === slot
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{slot}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: College Campus Meeting Venue */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                3. In-Person Meeting Spot in College ({tutor.collegeName})
              </label>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Campus In-Person
              </span>
            </div>

            <div className="space-y-2">
              {defaultVenues.map((venue) => (
                <button
                  key={venue}
                  type="button"
                  onClick={() => {
                    setSelectedVenue(venue);
                    setUseCustomVenue(false);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-xs text-left transition cursor-pointer flex items-center justify-between ${
                    !useCustomVenue && selectedVenue === venue
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{venue}</span>
                  </span>
                  {!useCustomVenue && selectedVenue === venue && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  )}
                </button>
              ))}

              {/* Custom Venue toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setUseCustomVenue(true)}
                  className={`text-xs font-medium cursor-pointer transition flex items-center gap-1 ${
                    useCustomVenue ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>+ Suggest a different spot on campus</span>
                </button>

                {useCustomVenue && (
                  <input
                    type="text"
                    placeholder="e.g. Mechanical Workshop discussion lawn, Block C..."
                    value={customVenue}
                    onChange={(e) => setCustomVenue(e.target.value)}
                    className="mt-2 w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Step 4: Specific Doubts / Topic notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              4. Doubts, Topics, or Questions to cover (Optional)
            </label>
            <textarea
              id="tutor-topic-notes-input"
              rows={2}
              placeholder="e.g. Please help me review question 4 of 2024 midsem and explain Banker's Algorithm deadlock avoidance..."
              value={topicNote}
              onChange={(e) => setTopicNote(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-emerald-500 transition"
            />
          </div>

          {/* In-Person College Meetup Info & Guarantee */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center justify-between text-emerald-950 font-medium">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-700" />
                In-Person College Campus Session (No video call • In College Meetup)
              </span>
              <span className="text-emerald-800 font-semibold">1-Hour Session</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-snug">
              Meet directly on campus at the designated study spot. A digital College Meetup Pass with OTP verification and tutor contact will be generated in your Hub.
            </p>

            <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-emerald-600" />
                Tutor receives 90% (₹{tutorShare}) • Vidyasys Escrow 10% (₹{platformFee})
              </span>
              <span className="text-slate-700 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Safe College Escrow
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500">Session Fee:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900">₹{tutor.hourlyRate}</span>
              <span className="text-xs text-slate-500">/ 60 mins</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-tutor-booking-btn"
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Confirm & Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
