import React from 'react';
import {
  Shirt,
  ShoppingBag,
  Laptop,
  Smartphone,
  Armchair,
  Tv,
  BookOpen,
  Watch,
  Package,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/seedData';
import { ProductCategory } from '../types';

export const CategoryNav: React.FC = () => {
  const { selectedCategory, setSelectedCategory, navigateTo } = useStore();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Shirt':
        return <Shirt className="w-4 h-4" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4" />;
      case 'Laptop':
        return <Laptop className="w-4 h-4" />;
      case 'Smartphone':
        return <Smartphone className="w-4 h-4" />;
      case 'Armchair':
        return <Armchair className="w-4 h-4" />;
      case 'Tv':
        return <Tv className="w-4 h-4" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4" />;
      case 'Watch':
        return <Watch className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleSelect = (catId: ProductCategory | 'all') => {
    setSelectedCategory(catId);
    navigateTo('home');
  };

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none text-xs font-semibold whitespace-nowrap">
          {/* All Categories Pill */}
          <button
            type="button"
            onClick={() => handleSelect('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>جميع الأقسام</span>
          </button>

          {/* Specific Categories */}
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelect(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
                }`}
              >
                {getIcon(cat.iconName)}
                <span>{cat.nameAr}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
