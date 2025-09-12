import Link from 'next/link';

const DataPolicy = () => {
  return (
    <div className="relative h-screen w-2/5 bg-white p-6 flex flex-col">
      {/* --- ส่วนหัว --- */}
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">Data Policy</h1>
        <p className="text-sm text-gray-500 mt-1">Last updated: September 12, 2025</p>
      </div>

      {/* --- ส่วนเนื้อหา (สามารถ scroll ได้) --- */}
      <div className="flex-grow overflow-y-auto my-6 pr-2">
        <p className="mt-2 text-gray-600">
          Welcome to Shiba Solver. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          <br /><br />
          We may collect information about you in a variety of ways. The information we may collect on the Site includes:
          <br /><br />
          <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, that you voluntarily give to us when you register with the Site.
          <br /><br />
          <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times.
        </p>

        
      </div>

      {/* --- ส่วนท้าย (ปุ่ม Back) --- */}
      <div className="flex-shrink-0 flex items-center gap-4 mt-4">
        {/* ปุ่ม Accept สีม่วง */}
        <button className="w-1/4 text-center bg-[#4B0082] text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors">
          Accept
        </button>

        {/* ปุ่ม Cancel สีแดง */}
        <button className="w-1/4 text-center bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DataPolicy;