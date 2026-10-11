'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const logged = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('userEmail');
    if (logged === 'true') {
      setIsLoggedIn(true);
      setUserEmail(email || 'User');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    router.push('/');
    window.location.reload();
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 py-4 px-6 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo, Green Box Icon & Date */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-md">
            🛒
          </div>
          <div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight block">বাজার দর</span>
            <span className="text-xs text-gray-500 font-medium">
  {new Intl.DateTimeFormat('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
</span>
          </div>
        </Link>

        {/* Auth Buttons or User Info */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                👤 {userEmail}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition border border-red-200 cursor-pointer"
              >
                লগআউট
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-sm font-medium text-gray-700 hover:text-emerald-700 px-3 py-1.5 transition"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg transition"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}