import React, { useState } from 'react';
import { Category } from '../types';
import { Layers, Plus, Trash2, Tag } from 'lucide-react';

interface CategoriesProps {
  categories: Category[];
  onAddCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  onAddCategory,
  onDeleteCategory
}) => {
  const [tab, setTab] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [colorHex, setColorHex] = useState('#16A085');

  const filtered = categories.filter(c => tab === 'EXPENSE' ? c.isExpense : !c.isExpense);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddCategory({
      id: `cat_${Date.now()}`,
      name: name.trim(),
      isExpense: tab === 'EXPENSE',
      iconName: 'Tag',
      colorHex,
      isDefault: false
    });

    setName('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#0C1830] dark:text-white">Financial Categories</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Classify inflows and outflows for reporting & auto-tagging</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-[#172A47] hover:bg-[#0C1830] text-[#E8C66D] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 self-start shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Category</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('EXPENSE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            tab === 'EXPENSE'
              ? 'bg-[#DC5A63] text-white shadow-sm'
              : 'bg-white dark:bg-[#111C30] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Expense Categories ({categories.filter(c => c.isExpense).length})
        </button>
        <button
          onClick={() => setTab('INCOME')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            tab === 'INCOME'
              ? 'bg-[#16A085] text-white shadow-sm'
              : 'bg-white dark:bg-[#111C30] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Income Categories ({categories.filter(c => !c.isExpense).length})
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filtered.map(cat => (
          <div
            key={cat.id}
            className="bg-white dark:bg-[#111C30] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: cat.colorHex || '#172A47' }}
              >
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#0C1830] dark:text-white">{cat.name}</div>
                <div className="text-[10px] text-slate-400">{cat.isDefault ? 'Standard System Category' : 'Custom User Category'}</div>
              </div>
            </div>
            {!cat.isDefault && (
              <button
                onClick={() => onDeleteCategory(cat.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C30] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-[#0C1830] dark:text-white mb-4">Add {tab === 'EXPENSE' ? 'Expense' : 'Income'} Category</h3>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Gym & Fitness"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Accent Color</label>
                <input
                  type="color"
                  value={colorHex}
                  onChange={e => setColorHex(e.target.value)}
                  className="w-full mt-1 h-9 p-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#172A47] text-white rounded-lg hover:bg-[#0C1830]"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
