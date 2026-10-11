'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('ইমেইল এবং পাসওয়ার্ড দিন');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);

      // সাইন ইন হওয়ার টোস্ট (Pic 5 অনুযায়ী)
      toast.success('সফলভাবে সাইন ইন হয়েছে।', {
        style: {
          border: '1px solid #10B981',
          padding: '12px 16px',
          color: '#065F46',
          backgroundColor: '#ECFDF5',
          fontWeight: 'bold',
        },
        iconTheme: {
          primary: '#10B981',
          secondary: '#FFFFFF',
        },
      });

      setTimeout(() => {
        router.push('/');
      }, 1200);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-8">
      <Toaster position="top-center" />
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">সাইন ইন</h1>
        <p className="text-xs text-gray-500 mt-1">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">ইমেইল</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">পাসওয়ার্ড</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-medium py-2.5 rounded-lg text-sm transition mt-2 flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                অপেক্ষা করুন...
              </>
            ) : (
              'সাইন ইন'
            )}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <span className="relative bg-white/70 px-2 text-xs text-gray-400">অথবা</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-1.5 border border-gray-300 bg-white py-2 px-3 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50">
            <span>🌐</span> Google দিয়ে চালিয়ে যান
          </button>
          <button className="flex items-center justify-center gap-1.5 border border-gray-300 bg-white py-2 px-3 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50">
            <span>🐙</span> GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          অ্যাকাউন্ট নেই?{' '}
          <Link href="/signup" className="text-emerald-700 font-bold hover:underline">
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      <Link href="/" className="text-xs text-gray-500 mt-6 hover:underline flex items-center gap-1">
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}