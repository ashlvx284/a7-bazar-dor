'use client';
import { useEffect, useState } from 'react';

interface ChangeInfo {
  dir: 'up' | 'down' | 'flat';
  pct: number;
}

interface Product {
  id: number | string;
  nameBn?: string;
  name?: string;
  today?: number;
  price?: number;
  unit?: string;
  change?: ChangeInfo;
  image?: string;
  categoryIcon?: string;
}

export default function PriceTicker() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    fetch('https://openapi.programming-hero.com/api/bazardor/products')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.products || data.data || [];
        setItems(list);
      })
      .catch((err) => console.error('Error fetching ticker products:', err));
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="w-full bg-white border-b border-gray-200 py-2.5 overflow-hidden select-none relative">
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 60s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full overflow-hidden relative">
        <div className="marquee-track flex items-center gap-10 whitespace-nowrap">
          {items.concat(items).map((item, idx) => {
            const name = item.nameBn || item.name || 'পণ্য';
            const price = item.today !== undefined ? item.today : (item.price || 0);
            const unit = item.unit ? `প্রতি ${item.unit}` : 'প্রতি kg';
            const icon = item.image || item.categoryIcon || '🛒';

            const dir = item.change?.dir;
            const pctVal = item.change?.pct !== undefined ? Math.abs(item.change.pct) : 0;

            return (
              <div key={idx} className="inline-flex items-center gap-2 text-xs font-medium text-gray-800 px-2">
                <span className="text-sm">{icon}</span>
                <span className="font-semibold text-gray-900">{name}</span>
                <span className="text-gray-700">{price} টাকা/{unit}</span>
                
                {dir && (
                  <span
                    className={`font-semibold flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                      dir === 'up'
                        ? 'text-red-600 bg-red-50'          // দাম বাড়লে লাল রঙ ও আপ অ্যারো
                        : dir === 'down'
                        ? 'text-emerald-600 bg-emerald-50'  // দাম কমলে সবুজ রঙ ও ডাউন অ্যারো
                        : 'text-gray-500 bg-gray-50'          // ফ্ল্যাট বা পরিবর্তন না হলে
                    }`}
                  >
                    {dir === 'up' && '▲'}
                    {dir === 'down' && '▼'}
                    {dir === 'flat' && '—'}
                    {pctVal}%
                  </span>
                )}
                
                <span className="text-gray-300 ml-3">•</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}