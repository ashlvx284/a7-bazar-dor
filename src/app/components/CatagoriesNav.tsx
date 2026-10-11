
'use client';
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name?: string;
  icon?: string;
  emoji?: string;
}

const categoryBanglaMap: Record<string, string> = {
  chal: 'চাল',
  dal: 'ডাল',
  tel: 'তেল',
  sobji: 'সবজি',
  mach: 'মাছ',
  mangso: 'মাংস',
  mangsho: 'মাংস',
  'dim-dudh': 'ডিম-দুধ',
  'dim-dud': 'ডিম-দুধ',
  'dim-dui': 'ডিম-দুধ',
  dim: 'ডিম-দুধ',
  mosla: 'মসলা',
};

interface CatagoriesNavProps {
  activeCat: string;
  onSelectCategory: (catId: string, name: string, icon: string) => void;
}

export default function CatagoriesNav({ activeCat, onSelectCategory }: CatagoriesNavProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('https://api.abcz.workers.dev/api/bazardor/categories')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.categories || data.data || [];
        setCategories(list);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="w-full bg-gray-50 border-b border-gray-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-4 overflow-x-auto">
        {categories.map((cat, idx) => {
          const rawId = (cat.id || String(idx)).toLowerCase();
          const categoryName = categoryBanglaMap[rawId] || cat.name || rawId;
          const categoryIcon = cat.icon || cat.emoji || '🛒';
          const isSelected = activeCat === rawId;

          return (
            <button
              key={rawId}
              onClick={() => onSelectCategory(rawId, categoryName, categoryIcon)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap border ${
                isSelected
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-400 hover:text-emerald-600'
              }`}
            >
              <span>{categoryIcon}</span>
              <span>{categoryName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}