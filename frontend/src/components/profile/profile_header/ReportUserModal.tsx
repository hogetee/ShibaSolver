'use client';

import React, { useState, useEffect } from 'react';
import { useReportUser } from '@/hooks/useReportUser'; 
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ReportUserModalProps {
  userId: string;
  userName: string; 
  onClose: () => void;
}

const reportReasons = [
  "Impersonation or Fake Account",
  "Harassment or Bullying",
  "Hate Speech or Discrimination",
  "Posting Inappropriate Content",
  "Spam",
  "Other",
];

const ReportUserModal = ({ userId, userName, onClose }: ReportUserModalProps) => {
  const { reportUser, isReporting, error, resetReportStatus } = useReportUser(); 
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');

  const handleSubmitReport = async () => {
    const reasonToSend = selectedReason === 'Other' ? otherReason.trim() : selectedReason;
    if (!reasonToSend) {
      alert('Please select or specify a reason for reporting.');
      return;
    }

    try {
      const response = await reportUser(userId, reasonToSend);
      onClose(); 

    } catch (err) {
    }
  };

  useEffect(() => {
    resetReportStatus();
  }, [resetReportStatus]);

  return (
    // ใช้ Backdrop แบบที่เราตกลงกัน
    <div
      className="font-display fixed inset-0 z-50 flex min-h-screen items-center justify-center backdrop-blur-sm backdrop-brightness-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Report User</h2>
        <p className="text-l text-gray-600 mb-4">
          Why are you reporting <span className="font-semibold text-[#4B0082]">{userName}</span>? 
          Your report is anonymous.
        </p>

        {error && (
           <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            Error: {error}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmitReport(); }}>
          <div className="space-y-4 mb-6">
            {reportReasons.map((reason) => (
              <label key={reason} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="reportReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  disabled={isReporting}
                />
                <span className="text-m text-gray-700">{reason}</span>
              </label>
            ))}
            {selectedReason === 'Other' && (
              <div>
                <textarea
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="Please specify the reason..."
                  rows={5}
                  maxLength={500}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2"
                  disabled={isReporting}
                />
                <p className="text-right text-xs text-gray-400 mt-1">{otherReason.length}/500</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={isReporting || !selectedReason || (selectedReason === 'Other' && !otherReason.trim())}
              className="px-6 py-2 rounded-md text-white font-semibold bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isReporting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportUserModal;