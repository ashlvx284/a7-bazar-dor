'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import CatagoriesNav from '@/app/components/CatagoriesNav';
import PriceTicker from '@/app/components/PriceTicker';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('দয়া করে ইমেইল এবং পাসওয়ার্ড দিন');
      return;
    }
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);

    toast.success('সফলভাবে সাইন ইন হয়েছে!');

    setTimeout(() => {
      const redirectId = localStorage.getItem('redirectProductId');
      if (redirectId) {
        localStorage.removeItem('redirectProductId');
        router.push(`/product/${redirectId}`);
      } else {
        router.push('/');
      }
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <div>
        {/* Sticky Header Wrapper */}
        <div className="sticky top-0 z-40 bg-gray-100 shadow-sm">
          <Navbar />
          <CatagoriesNav activeCat="" onSelectCategory={() => {}} />
          <PriceTicker />
        </div>

        {/* Sign In Form */}
        <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">সাইন ইন করুন</h1>
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">ইমেইল ঠিকানা</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">পাসওয়ার্ড</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition text-sm cursor-pointer mt-2"
            >
              লগইন
            </button>
          </form>

          <p className="text-xs text-center text-gray-500 mt-6">
            একাউন্ট নেই?{' '}
            <Link href="/signup" className="text-emerald-600 font-semibold hover:underline">
              সাইন আপ করুন
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}