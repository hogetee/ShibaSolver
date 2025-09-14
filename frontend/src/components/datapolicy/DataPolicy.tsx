import Link from 'next/link';

const DataPolicy = () => {
  return (
    <div className="pt-20 relative h-screen w-2/5 bg-white p-6 flex flex-col">
      {/* --- ส่วนหัว --- */}
      <div className="font-display flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">Data Policy</h1>
        <p className="text-sm text-gray-500 mt-1">Last updated: September 12, 2025</p>
      </div>

      {/* --- ส่วนเนื้อหา (สามารถ scroll ได้) --- */}
      <div className="font-display flex-grow overflow-y-auto my-6 pr-2">
        <p className="mt-2 text-gray-600">
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
        </p>

        
      </div>

      {/* --- ส่วนท้าย (ปุ่ม Back) --- */}
      <div className="font-display flex-shrink-0 flex items-center gap-4 mt-4">
        {/* ปุ่ม Accept สีม่วง */}
        <button className="w-1/4 text-center bg-[#4B0082] text-xl text-white font-bold py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors">
          Accept
        </button>

        {/* ปุ่ม Cancel สีแดง */}
        <button className="w-1/4 text-center bg-red-500 text-xl text-white font-bold py-2 px-3 rounded-lg hover:bg-red-700 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DataPolicy;