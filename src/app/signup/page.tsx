'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import CatagoriesNav from '@/app/components/CatagoriesNav';
import PriceTicker from '@/app/components/PriceTicker';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('দয়া করে সব তথ্য পূরণ করুন');
      return;
    }

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);

    toast.success('একাউন্ট সফলভাবে তৈরি হয়েছে!');

    setTimeout(() => {
      router.push('/');
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

        {/* Sign Up Form */}
        <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">নতুন একাউন্ট খুলুন</h1>
          
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">আপনার নাম</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

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
              সাইন আপ
            </button>
          </form>

          <p className="text-xs text-center text-gray-500 mt-6">
            ইতিমধ্যে একাউন্ট আছে?{' '}
            <Link href="/signin" className="text-emerald-600 font-semibold hover:underline">
              সাইন ইন করুন
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}