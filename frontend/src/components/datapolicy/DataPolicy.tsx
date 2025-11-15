import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

const DataPolicy = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="relative max-h-[80%] h-fit w-[90%] max-w-3xl bg-white rounded-lg p-6 flex flex-col border-2 border-purple-700 shadow-lg">
      {onClose && (
        <button
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 cursor-pointer z-10"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      )}
      {/* --- ส่วนหัว --- */}
      <div className="font-display flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">Data Policy</h1>
        <p className="text-sm text-gray-500 mt-1">Last updated: September 12, 2025</p>
      </div>

      {/* --- ส่วนเนื้อหา (สามารถ scroll ได้) --- */}
      <div className="font-display flex-grow overflow-y-auto my-6 pr-2">
        <div className="mt-2 text-gray-600">
          Welcome to Shiba Solver. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          <br /><br />
          During Account Registration
          <br /><br />
          Personal Data Collection Agreement
          Our system will collect the following information to provide you with full access to our services:
          <ul className="list-disc list-inside pl-5 mt-2">
            <li>Display Name</li>
            <li>Education Level</li>
            <li>User Name</li>
            <li>Interested Subjects</li>
          </ul>
          <br /><br />
          Purposes:
          <ul className="list-disc list-inside pl-5 mt-2">
            <li>To create your user account</li>
            <li>To improve content recommendations based on your interests</li>
          </ul>
          <br /><br />
          Data Privacy:
          <ul className="list-disc list-inside pl-5 mt-2">
            <li>You may edit or delete this information at any time.</li>
            <li>We do not share your personal data with any third parties.</li>
          </ul>
        </div>

        
      </div>

    </div>
  );
};

export default DataPolicy;