'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

interface Product {
  id: number | string;
  nameBn?: string;
  name?: string;
  unit?: string;
  today?: number;
  price?: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;
  change?: {
    dir: 'up' | 'down' | 'flat';
    pct: number;
  };
  image?: string;
  categoryIcon?: string;
  categoryNameBn?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // লগইন করা আছে কিনা চেক করতে পারো, না থাকলে সাইন ইন পেজে পাঠাতে পারো
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }

    // সব পণ্য ফেচ করে নির্দিষ্ট id-এর পণ্যটি খুঁজে বের করা
    fetch('https://openapi.programming-hero.com/api/bazardor/products')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.products || data.data || [];
        const found = list.find((item: Product) => String(item.id) === String(id));
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
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="text-center py-20 text-gray-500">লোড হচ্ছে...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="text-center py-20 text-gray-500 font-semibold">
          পণ্যটি পাওয়া যায়নি!
        </div>
      </div>
    );
  }

  const name = product.nameBn || product.name || 'পণ্য';
  const price = product.today !== undefined ? product.today : (product.price || 0);
  const unit = product.unit ? `প্রতি ${product.unit}` : 'প্রতি কেজি';
  const icon = product.image || product.categoryIcon || '🛒';
  const dir = product.change?.dir;
  const pctVal = product.change?.pct !== undefined ? Math.abs(product.change.pct) : 0;

  return (
    <main className="min-h-screen bg-gray-100 pb-16">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="text-xs text-gray-600 hover:text-emerald-700 mb-6 flex items-center gap-1 font-medium"
        >
          ← পেছনে ফিরে যান
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{icon}</span>
            <div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {product.categoryNameBn || 'বাজারদর'}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">{name}</h1>
              <p className="text-sm text-gray-500">{unit}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <span className="text-xs text-gray-500 block">আজকের দাম</span>
              <span className="text-2xl font-bold text-gray-900">{price} টাকা</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 block">বাজার পরিবর্তন</span>
                <span className="text-sm font-semibold text-gray-800 mt-1 block">
                  {dir === 'up' && 'দাম বৃদ্ধি পেয়েছে'}
                  {dir === 'down' && 'দাম কমেছে'}
                  {dir === 'flat' && 'দাম অপরিবর্তিত'}
                </span>
              </div>
              {dir && (
                <div
                  className={`text-sm font-bold px-3 py-1.5 rounded-lg ${
                    dir === 'up'
                      ? 'text-red-600 bg-red-50'
                      : dir === 'down'
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-500 bg-gray-50'
                  }`}
                >
                  {dir === 'up' && `▲ ${pctVal}%`}
                  {dir === 'down' && `▼ ${pctVal}%`}
                  {dir === 'flat' && `— 0.0%`}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold text-gray-800 mb-3">মূল্যের ইতিহাস</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-xs text-gray-500 block">গতকাল</span>
                <span className="text-sm font-bold text-gray-800">{product.yesterday || 'न/A'} টাকা</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-xs text-gray-500 block">গত সপ্তাহ</span>
                <span className="text-sm font-bold text-gray-800">{product.lastWeek || 'ন/A'} টাকা</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-xs text-gray-500 block">গত মাস</span>
                <span className="text-sm font-bold text-gray-800">{product.lastMonth || 'ন/A'} টাকা</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}