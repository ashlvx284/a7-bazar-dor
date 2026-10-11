import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo & Date */}
        <div className="flex items-center gap-3">
          <img 
            src="/logo-icon.png" 
            alt="Bazar Dor Logo" 
            className="w-10 h-10 object-contain rounded-xl" 
          />
          <div>
            <Link href="/" className="text-xl font-bold text-gray-900 block leading-tight">
              বাজার দর
            </Link>
            <span className="text-xs text-gray-500">
              শনিবার, ১০ অক্টোবর, ২০২৬
            </span>
          </div>
        </div>

        {/* Right: Sign In / Sign Up */}
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md">
            সাইন ইন
          </button>
          <button className="text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm transition">
            সাইন আপ
          </button>
        </div>
      </div>
    </header>
  );
}