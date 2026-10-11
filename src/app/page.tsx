'use client';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CatagoriesNav from './components/CatagoriesNav';
import PriceTicker from './components/PriceTicker';

interface ChangeInfo {
  dir: 'up' | 'down' | 'flat';
  pct: number;
}

interface Product {
  id: number | string;
  nameBn?: string;
  name?: string;
  unit?: string;
  today?: number;
  price?: number;
  change?: ChangeInfo;
  image?: string;
  categoryIcon?: string;
}

export default function Home() {
  const [activeCat, setActiveCat] = useState<string>(''); 
  const [catName, setCatName] = useState<string>('');
  const [catIcon, setCatIcon] = useState<string>('');

  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('default');

  // হোম পেজের জন্য সব পণ্য ফেচ করা
  useEffect(() => {
    fetch('https://openapi.programming-hero.com/api/bazardor/products')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.products || data.data || [];
        setAllProducts(list);
      })
      .catch((err) => console.error('Error fetching all products:', err));
  }, []);

  // ক্যাটাগরি সিলেক্ট করলে নির্দিষ্ট প্রোডাক্ট ফেচ করা
  useEffect(() => {
    if (!activeCat) return;

    setLoading(true);
    fetch(`https://openapi.programming-hero.com/api/bazardor/products?category=${activeCat}`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.products || data.data || [];
        setProducts(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching category products:', err);
        setLoading(false);
      });
  }, [activeCat]);

  const handleSelectCategory = (catId: string, name: string, icon: string) => {
    setActiveCat(catId);
    setCatName(name);
    setCatIcon(icon);
  };

  const getSortedProducts = () => {
    const sorted = [...products];
    if (sortOption === 'lowToHigh') {
      return sorted.sort((a, b) => (a.today ?? a.price ?? 0) - (b.today ?? b.price ?? 0));
    } else if (sortOption === 'highToLow') {
      return sorted.sort((a, b) => (b.today ?? b.price ?? 0) - (a.today ?? a.price ?? 0));
    }
    return sorted;
  };

  const sortedProducts = getSortedProducts();

  // টপ ৬ দাম বেড়েছে
  const topIncreased = [...allProducts]
    .filter((item) => item.change?.dir === 'up')
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  // টপ ৬ দাম কমেছে
  const topDecreased = [...allProducts]
    .filter((item) => item.change?.dir === 'down')
    .sort((a, b) => Math.abs(b.change?.pct || 0) - Math.abs(a.change?.pct || 0))
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-gray-100 pb-16">
      <Navbar />
      <CatagoriesNav activeCat={activeCat} onSelectCategory={handleSelectCategory} />
      <PriceTicker />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {!activeCat ? (
          <div className="space-y-10">
            {/* ১. আজ দাম বেড়েছে সেকশন */}
            {topIncreased.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <span className="text-red-600">▲</span> আজ দাম বেড়েছে
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {topIncreased.map((prod, idx) => {
                    const name = prod.nameBn || prod.name || 'পণ্য';
                    const price = prod.today !== undefined ? prod.today : (prod.price || 0);
                    const unit = prod.unit ? `প্রতি ${prod.unit}` : 'প্রতি কেজি';
                    const icon = prod.image || prod.categoryIcon || '🛒';
                    const pctVal = prod.change?.pct !== undefined ? prod.change.pct : 0;

                    return (
                      <div
                        key={prod.id || idx}
                        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center hover:border-red-300 transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{icon}</span>
                            <h3 className="font-bold text-gray-800">{name}</h3>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{unit}</p>
                          <div className="mt-3">
                            <span className="text-xs text-gray-400 block">আজকের দাম</span>
                            <span className="text-lg font-bold text-gray-900">{price} টাকা</span>
                          </div>
                        </div>

                        <div className="text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 text-red-600 bg-red-50">
                          ▲ {pctVal}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ২. আজ দাম কমেছে সেকশন */}
            {topDecreased.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <span className="text-emerald-600">▼</span> আজ দাম কমেছে
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {topDecreased.map((prod, idx) => {
                    const name = prod.nameBn || prod.name || 'পণ্য';
                    const price = prod.today !== undefined ? prod.today : (prod.price || 0);
                    const unit = prod.unit ? `প্রতি ${prod.unit}` : 'প্রতি কেজি';
                    const icon = prod.image || prod.categoryIcon || '🛒';
                    const pctVal = prod.change?.pct !== undefined ? Math.abs(prod.change.pct) : 0;

                    return (
                      <div
                        key={prod.id || idx}
                        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center hover:border-emerald-300 transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{icon}</span>
                            <h3 className="font-bold text-gray-800">{name}</h3>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{unit}</p>
                          <div className="mt-3">
                            <span className="text-xs text-gray-400 block">আজকের দাম</span>
                            <span className="text-lg font-bold text-gray-900">{price} টাকা</span>
                          </div>
                        </div>

                        <div className="text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 text-emerald-600 bg-emerald-50">
                          ▼ {pctVal}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ৩. সব পণ্য সেকশন */}
            {allProducts.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-1">সব পণ্য</h2>
                <p className="text-xs text-gray-500 mb-4">মোট {allProducts.length}টি পণ্য দেখানো হচ্ছে</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {allProducts.map((prod, idx) => {
                    const name = prod.nameBn || prod.name || 'পণ্য';
                    const price = prod.today !== undefined ? prod.today : (prod.price || 0);
                    const unit = prod.unit ? `প্রতি ${prod.unit}` : 'প্রতি কেজি';
                    const icon = prod.image || prod.categoryIcon || '🛒';
                    const dir = prod.change?.dir;
                    const pctVal = prod.change?.pct !== undefined ? prod.change.pct : 0;

                    return (
                      <div
                        key={prod.id || idx}
                        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center hover:border-emerald-300 transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{icon}</span>
                            <h3 className="font-bold text-gray-800">{name}</h3>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{unit}</p>

                          <div className="mt-3">
                            <span className="text-xs text-gray-400 block">আজকের দাম</span>
                            <span className="text-lg font-bold text-gray-900">{price} টাকা</span>
                          </div>
                        </div>

                        {dir && (
                          <div
                            className={`text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 ${
                              dir === 'up'
                                ? 'text-red-600 bg-red-50'
                                : dir === 'down'
                                ? 'text-emerald-600 bg-emerald-50'
                                : 'text-gray-500 bg-gray-50'
                            }`}
                          >
                            {dir === 'up' && `▲ ${pctVal}%`}
                            {dir === 'down' && `▼ ${Math.abs(pctVal)}%`}
                            {dir === 'flat' && `— 0.0%`}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 mb-6">
              <div className="text-4xl">{catIcon}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{catName}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {products.length}টি পণ্যের আজকের দাম ও পরিবর্তন
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">
                মোট {sortedProducts.length}টি পণ্য দেখানো হচ্ছে
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">সাজان</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="default">ডিফল্ট</option>
                  <option value="lowToHigh">দাম: কম থেকে বেশি</option>
                  <option value="highToLow">দাম: বেশি থেকে কম</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500 font-medium">
                পণ্য লোড হচ্ছে...
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {sortedProducts.map((prod, idx) => {
                  const name = prod.nameBn || prod.name || 'পণ্য';
                  const price = prod.today !== undefined ? prod.today : (prod.price || 0);
                  const unit = prod.unit ? `প্রতি ${prod.unit}` : 'প্রতি কেজি';
                  const icon = prod.image || prod.categoryIcon || catIcon;
                  const dir = prod.change?.dir;
                  const pctVal = prod.change?.pct !== undefined ? prod.change.pct : 0;

                  return (
                    <div
                      key={prod.id || idx}
                      className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center hover:border-emerald-300 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{icon}</span>
                          <h3 className="font-bold text-gray-800">{name}</h3>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{unit}</p>

                        <div className="mt-3">
                          <span className="text-xs text-gray-400 block">আজকের দাম</span>
                          <span className="text-lg font-bold text-gray-900">{price} টাকা</span>
                        </div>
                      </div>

                      {dir && (
                        <div
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 ${
                            dir === 'up'
                              ? 'text-red-600 bg-red-50'
                              : dir === 'down'
                              ? 'text-emerald-600 bg-emerald-50'
                              : 'text-gray-500 bg-gray-50'
                          }`}
                        >
                          {dir === 'up' && `▲ ${pctVal}%`}
                          {dir === 'down' && `▼ ${Math.abs(pctVal)}%`}
                          {dir === 'flat' && `— 0.0%`}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}