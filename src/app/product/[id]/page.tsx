'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import CatagoriesNav from '@/app/components/CatagoriesNav';
import PriceTicker from '@/app/components/PriceTicker';
import Footer from '@/app/components/Footer';
import Link from 'next/link';

interface MarketItem {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface Product {
  id: number | string;
  slug?: string;
  nameBn?: string;
  name?: string;
  category?: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  unit?: string;
  image?: string;
  today?: number;
  price?: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;
  change?: {
    dir: 'up' | 'down' | 'flat';
    pct: number;
  };
  markets?: MarketItem[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }

    // API থেকে সব পণ্য ফেচ করা
    fetch('https://openapi.programming-hero.com/api/bazardor/products')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.products || data.data || [];
        // id অথবা slug দিয়ে ম্যাচ করা
        const found = list.find(
          (item: Product) => String(item.id) === String(id) || item.slug === String(id)
        );
        setProduct(found || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching product details:', err);
        setLoading(false);
      });
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-20 text-gray-500 font-medium">তথ্য লোড হচ্ছে...</div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-20 text-gray-500 font-semibold">
          পণ্যটি পাওয়া যায়নি!
        </div>
        <Footer />
      </div>
    );
  }

  const name = product.nameBn || product.name || 'পণ্য';
  const price = product.today !== undefined ? product.today : (product.price || 0);
  const unitText = product.unit === 'kg' ? 'প্রতি কেজি' : product.unit === 'litre' ? 'প্রতি লিটার' : product.unit === 'dozen' ? 'প্রতি হালি' : 'প্রতি পিস';
  const icon = product.image || product.categoryIcon || '🛒';
  const dir = product.change?.dir;
  const pctVal = product.change?.pct !== undefined ? Math.abs(product.change.pct) : 0;
  const catName = product.categoryNameBn || 'বাজারদর';

  // বাজারগুলোর সর্বনিম্ন, সর্বোচ্চ ও গড় হিসাব করা
  const markets = product.markets || [];
  let minOverall = markets.length > 0 ? Math.min(...markets.map(m => m.min)) : price;
  let maxOverall = markets.length > 0 ? Math.max(...markets.map(m => m.max)) : price;

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <div>
        {/* Sticky Header Wrapper */}
        <div className="sticky top-0 z-40 bg-gray-100 shadow-sm">
          <Navbar />
          <CatagoriesNav activeCat={product.category || ''} onSelectCategory={() => {}} />
          <PriceTicker />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Back Button & Breadcrumb */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:text-emerald-700 px-3 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1 cursor-pointer"
            >
              ← হোম পেজে ফিরে যান
            </button>
            
            <div className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
              <Link href="/" className="hover:text-emerald-700">হোম</Link>
              <span>›</span>
              <span className="text-gray-600">{catName}</span>
              <span>›</span>
              <span className="text-gray-900 font-semibold">{name}</span>
            </div>
          </div>

          {/* Product Main Info Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <span className="text-5xl bg-gray-50 p-4 rounded-2xl border border-gray-100">{icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <p className="text-xs text-gray-500 mt-0.5">{unitText} · {catName}</p>
                <p className="text-xs font-medium text-gray-600 mt-2">
                  {dir === 'up' && `গতকালের তুলনায় আজ দাম বেড়েছে ${pctVal}%`}
                  {dir === 'down' && `গতকালের তুলনায় আজ দাম কমেছে ${pctVal}%`}
                  {dir === 'flat' && `গতকালের তুলনায় আজ দাম অপরিবর্তিত রয়েছে`}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 text-center md:text-right w-full md:w-auto">
              <span className="text-xs text-gray-400 block">আজকের দাম</span>
              <div className="flex items-baseline justify-center md:justify-end gap-1.5 mt-0.5">
                <span className="text-2xl font-bold text-gray-900">{price}</span>
                <span className="text-xs font-semibold text-gray-600">টাকা / কেজি</span>
              </div>
              {dir && (
                <div className={`text-xs font-bold mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded ${
                  dir === 'up' ? 'text-red-600 bg-red-50' : dir === 'down' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-500 bg-gray-50'
                }`}>
                  {dir === 'up' && `▲ ${pctVal}%`}
                  {dir === 'down' && `▼ ${pctVal}%`}
                  {dir === 'flat' && `— 0.0%`}
                </div>
              )}
            </div>
          </div>

          {/* দামের সারসংক্ষেপ (Summary Cards) */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">দামের সারসংক্ষেপ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* সর্বনিম্ন দাম */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-500 font-medium block">সর্বনিম্ন দাম</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold text-emerald-600">{minOverall} টাকা</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">সবচেয়ে কম দামের বাজার</p>
              </div>

              {/* সর্বোচ্চ দাম */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-500 font-medium block">সর্বাধিক দাম</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold text-red-600">{maxOverall} টাকা</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">সবচেয়ে বেশি দামের বাজার</p>
              </div>

              {/* গড় দাম */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-500 font-medium block">গড় দাম</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold text-gray-900">{price} টাকা</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">প্রতি কেজি-এর হিসাবে</p>
              </div>
            </div>
          </div>

          {/* বাজারভিত্তিক আজকের দাম (Table) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-12">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">বাজারভিত্তিক আজকের দাম</h2>
              <p className="text-xs text-gray-500 mt-0.5">বিভিন্ন বাজারের সর্বনিম্ন ও সর্বোচ্চ মূল্যের তালিকা</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600">
                    <th className="py-3.5 px-6">বাজার</th>
                    <th className="py-3.5 px-6">বিভাগ</th>
                    <th className="py-3.5 px-6">সর্বনিম্ন</th>
                    <th className="py-3.5 px-6">সর্বাধিক</th>
                    <th className="py-3.5 px-6">গড়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {markets.map((m, idx) => {
                    const avg = Math.round((m.min + m.max) / 2);
                    return (
                      <tr key={idx} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 px-6 font-medium text-gray-800">{m.market}</td>
                        <td className="py-4 px-6 text-gray-500">{m.division}</td>
                        <td className="py-4 px-6 font-semibold text-emerald-600">{m.min} টাকা</td>
                        <td className="py-4 px-6 font-semibold text-red-600">{m.max} টাকা</td>
                        <td className="py-4 px-6 font-medium text-gray-700">{avg} টাকা</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </main>
  );
}