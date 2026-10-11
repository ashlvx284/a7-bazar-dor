'use client';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CatagoriesNav from './components/CatagoriesNav';

interface Product {
  id: number | string;
  nameBn?: string;
  name?: string;
  unit?: string;
  today?: number;
  price?: number;
  pct?: number;
  changeDirection?: string;
  image?: string;
  categoryIcon?: string;
}

export default function Home() {
  // Initially no category selected
  const [activeCat, setActiveCat] = useState<string>(''); 
  const [catName, setCatName] = useState<string>('');
  const [catIcon, setCatIcon] = useState<string>('');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('default');

  // Dynamic Category API Fetching only when activeCat is selected
  useEffect(() => {
    if (!activeCat) return;

    setLoading(true);
    fetch(`https://api.abcz.workers.dev/api/bazardor/products?category=${activeCat}`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.products || data.data || [];
        setProducts(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dynamic category products:', err);
        setLoading(false);
      });
  }, [activeCat]);

  // Category Selection Handler
  const handleSelectCategory = (catId: string, name: string, icon: string) => {
    setActiveCat(catId);
    setCatName(name);
    setCatIcon(icon);
  };

  // Sorting Logic
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

  return (
    <main className="min-h-screen bg-gray-100 pb-16">
      <Navbar />
      <CatagoriesNav activeCat={activeCat} onSelectCategory={handleSelectCategory} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {!activeCat ? (
          // Initial view when no category is clicked yet
          <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center shadow-sm">
            <div className="text-5xl mb-3">🛒</div>
            <h2 className="text-xl font-bold text-gray-800">কোনো ক্যাটাগরি নির্বাচিত হয়নি</h2>
            <p className="text-gray-500 mt-1 text-sm">
              পণ্যের বাজার দর ও পরিবর্তন দেখতে উপরের ক্যাটাগরি বার থেকে যেকোনো একটি ক্যাটাগরি সিলেক্ট করুন।
            </p>
          </div>
        ) : (
          <>
            {/* Active Category Header Banner */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 mb-6">
              <div className="text-4xl">{catIcon}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{catName}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {products.length}টি পণ্যের আজকের দাম ও পরিবর্তন
                </p>
              </div>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">
                মোট {sortedProducts.length}টি পণ্য দেখানো হচ্ছে
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">সাজান</span>
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

            {/* Product Grid */}
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

                      {prod.pct !== undefined && (
                        <div
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 ${
                            prod.changeDirection === 'up'
                              ? 'text-red-600 bg-red-50'
                              : prod.changeDirection === 'down'
                              ? 'text-emerald-600 bg-emerald-50'
                              : 'text-gray-500 bg-gray-50'
                          }`}
                        >
                          {prod.changeDirection === 'up' && '▲'}
                          {prod.changeDirection === 'down' && '▼'}
                          {prod.changeDirection === 'none' && '—'}
                          {prod.pct}%
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