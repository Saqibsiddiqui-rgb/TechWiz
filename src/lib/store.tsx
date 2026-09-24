import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  defaultCategories, demoProfile, monthlyHistory, seedBudgets, seedInsights, seedNotifications, seedTips, seedTransactions,
} from '../data/mock';
import type { AppNotification, Budget, Category, Insight, NotificationKind, Profile, Tip, Transaction } from './types';
import { CURRENT_MONTH, rs, uid } from './format';
import { correctionKey } from './ai';

export type FontSize = 'sm' | 'md' | 'lg';
export type Role = 'student' | 'admin' | null;

export interface Settings {
  dark: boolean;
  fontSize: FontSize;
  notify: { budget: boolean; tips: boolean; insights: boolean; imports: boolean };
}

interface Data {
  role: Role;
  profile: Profile;
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  insights: Insight[];
  tips: Tip[];
  notifications: AppNotification[];
  bookmarks: { tips: string[]; insights: string[] };
  corrections: Record<string, string>;
  settings: Settings;
}

export interface Toast { id: string; tone: 'success' | 'error' | 'info' | 'warn'; message: string }

const initial = (): Data => ({
  role: null,
  profile: demoProfile,
  categories: defaultCategories,
  transactions: seedTransactions,
  budgets: seedBudgets,
  insights: seedInsights,
  tips: seedTips,
  notifications: seedNotifications,
  bookmarks: { tips: ['tip1'], insights: ['i-2026-08'] },
  corrections: {},
  settings: { dark: false, fontSize: 'md', notify: { budget: true, tips: true, insights: true, imports: true } },
});

const KEY = 'campuscoin:v1';
const load = (): Data => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...initial(), ...JSON.parse(raw) };
  } catch { /* storage unavailable: fall back to demo data */ }
  return initial();
};

/** Spent per category for a month */
export const spentByCategory = (txs: Transaction[], month = CURRENT_MONTH) => {
  const out: Record<string, number> = {};
  for (const t of txs) if (t.type === 'expense' && t.date.startsWith(month)) out[t.categoryId] = (out[t.categoryId] || 0) + t.amount;
  return out;
};

export const monthTotals = (txs: Transaction[], month = CURRENT_MONTH) => {
  let income = 0, expense = 0;
  for (const t of txs) if (t.date.startsWith(month)) t.type === 'income' ? (income += t.amount) : (expense += t.amount);
  return { income, expense, balance: income - expense };
};

function useStoreValue() {
  const [data, setData] = useState<Data>(load);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ } }, [data]);

  // Apply theme + font size to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', data.settings.dark);
    root.style.setProperty('--base-size', { sm: '14px', md: '16px', lg: '18px' }[data.settings.fontSize]);
  }, [data.settings.dark, data.settings.fontSize]);

  const toast = useCallback((message: string, tone: Toast['tone'] = 'success') => {
    const id = uid();
    setToasts((t) => [...t, { id, tone, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);
  const dismissToast = (id: string) => setToasts((t) => t.filter((x) => x.id !== id));

  const set = setData;
  const cat = (id: string) => data.categories.find((c) => c.id === id);

  const notify = (kind: NotificationKind, title: string, body: string, link?: string) => {
    const pref = { 'budget-near': 'budget', 'budget-over': 'budget', tip: 'tips', insight: 'insights', import: 'imports' } as const;
    if (!data.settings.notify[pref[kind]]) return;
    set((d) => ({ ...d, notifications: [{ id: uid(), kind, title, body, link, time: Date.now(), read: false }, ...d.notifications] }));
  };

  /** Checks whether a new expense pushes a budget past 80% or 100% and raises an alert. */
  const checkBudget = (txs: Transaction[], categoryId: string, month: string) => {
    const b = data.budgets.find((x) => x.categoryId === categoryId && x.month === month);
    if (!b) return;
    const before = spentByCategory(data.transactions, month)[categoryId] || 0;
    const after = spentByCategory(txs, month)[categoryId] || 0;
    const name = cat(categoryId)?.name ?? 'this';
    if (before <= b.limit && after > b.limit) {
      notify('budget-over', `You\u2019ve crossed your ${name.toLowerCase()} budget this month`, `You\u2019ve spent ${rs(after)} of ${rs(b.limit)}.`, '/app/budgets');
      toast(`Heads up: you\u2019ve crossed your ${name.toLowerCase()} budget.`, 'warn');
    } else if (before < b.limit * 0.8 && after >= b.limit * 0.8 && after <= b.limit) {
      notify('budget-near', `${name} is getting close to its limit`, `You\u2019ve used ${Math.round((after / b.limit) * 100)}% of your ${rs(b.limit)} budget.`, '/app/budgets');
      toast(`${name} is at ${Math.round((after / b.limit) * 100)}% of its budget.`, 'info');
    }
  };

  const actions = {
    login: (role: Exclude<Role, null>) => set((d) => ({ ...d, role })),
    logout: () => set((d) => ({ ...d, role: null })),
    register: (p: Profile) => set((d) => ({ ...d, role: 'student', profile: p })),
    updateProfile: (p: Profile) => set((d) => ({ ...d, profile: p })),
    updateSettings: (s: Partial<Settings>) => set((d) => ({ ...d, settings: { ...d.settings, ...s } })),
    resetDemo: () => { setData({ ...initial(), role: data.role }); },

    addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => {
      const tx: Transaction = { ...t, id: uid(), createdAt: Date.now() };
      const txs = [tx, ...data.transactions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
      // Learn from the student's correction of an AI suggestion
      if (t.aiSuggestedCategoryId && t.aiSuggestedCategoryId !== t.categoryId) {
        set((d) => ({ ...d, corrections: { ...d.corrections, [correctionKey(t.description)]: t.categoryId } }));
      }
      set((d) => ({ ...d, transactions: txs }));
      if (t.type === 'expense') checkBudget(txs, t.categoryId, t.date.slice(0, 7));
      return tx;
    },
    updateTransaction: (tx: Transaction) => {
      const txs = data.transactions.map((x) => (x.id === tx.id ? tx : x));
      set((d) => ({ ...d, transactions: txs }));
      if (tx.type === 'expense') checkBudget(txs, tx.categoryId, tx.date.slice(0, 7));
    },
    deleteTransaction: (id: string) => set((d) => ({ ...d, transactions: d.transactions.filter((x) => x.id !== id) })),
    importTransactions: (rows: Omit<Transaction, 'id' | 'createdAt'>[]) => {
      const now = Date.now();
      set((d) => ({
        ...d,
        transactions: [...rows.map((r, i) => ({ ...r, id: uid(), createdAt: now + i })), ...d.transactions]
          .sort((a, b) => b.date.localeCompare(a.date)),
      }));
      notify('import', 'CSV import finished', `${rows.length} transactions were added and categorized.`, '/app/transactions');
    },

    saveCategory: (c: Category) => set((d) => ({
      ...d, categories: d.categories.some((x) => x.id === c.id) ? d.categories.map((x) => (x.id === c.id ? c : x)) : [...d.categories, c],
    })),
    deleteCategory: (id: string) => set((d) => ({ ...d, categories: d.categories.filter((x) => x.id !== id), budgets: d.budgets.filter((b) => b.categoryId !== id) })),

    saveBudget: (b: Budget) => set((d) => ({
      ...d, budgets: d.budgets.some((x) => x.id === b.id) ? d.budgets.map((x) => (x.id === b.id ? b : x)) : [...d.budgets, b],
    })),
    deleteBudget: (id: string) => set((d) => ({ ...d, budgets: d.budgets.filter((b) => b.id !== id) })),

    pinTip: (id: string) => set((d) => ({ ...d, tips: d.tips.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t)) })),
    dismissTip: (id: string) => set((d) => ({ ...d, tips: d.tips.map((t) => (t.id === id ? { ...t, dismissed: true, pinned: false } : t)) })),
    restoreTips: () => set((d) => ({ ...d, tips: d.tips.map((t) => ({ ...t, dismissed: false })) })),
    toggleBookmark: (kind: 'tips' | 'insights', id: string) => set((d) => {
      const list = d.bookmarks[kind];
      return { ...d, bookmarks: { ...d.bookmarks, [kind]: list.includes(id) ? list.filter((x) => x !== id) : [id, ...list] } };
    }),

    markRead: (id: string) => set((d) => ({ ...d, notifications: d.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
    markAllRead: () => set((d) => ({ ...d, notifications: d.notifications.map((n) => ({ ...n, read: true })) })),
    clearNotification: (id: string) => set((d) => ({ ...d, notifications: d.notifications.filter((n) => n.id !== id) })),
  };

  const derived = useMemo(() => {
    const totals = monthTotals(data.transactions);
    const h = monthlyHistory[monthlyHistory.length - 1]; // August summary
    const last = { income: h.income, expense: h.expense, balance: h.income - h.expense };
    return { totals, last, spent: spentByCategory(data.transactions) };
  }, [data.transactions]);

  return { ...data, ...derived, cat, toast, toasts, dismissToast, ...actions };
}

type Store = ReturnType<typeof useStoreValue>;
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const value = useStoreValue();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside <StoreProvider>');
  return s;
}
