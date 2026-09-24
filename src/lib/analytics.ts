import type { Category, Transaction } from './types';
import { CURRENT_MONTH, monthLabel, shortDate, TODAY } from './format';
import { monthlyHistory } from '../data/mock';
import { monthTotals } from './store';

const addDays = (d: string, n: number) => new Date(Date.parse(d) + n * 86400000).toISOString().slice(0, 10);

export function lastNDays(txs: Transaction[], n = 7, end = TODAY) {
  return Array.from({ length: n }, (_, i) => {
    const day = addDays(end, i - n + 1);
    const list = txs.filter((t) => t.date === day);
    const wd = new Date(Date.parse(day)).toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' });
    return {
      label: wd,
      income: list.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expense: list.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    };
  });
}

export function weeksOfMonth(txs: Transaction[], month = CURRENT_MONTH) {
  const ranges = [[1, 7], [8, 14], [15, 21], [22, 31]];
  return ranges.map(([a, b], i) => {
    const list = txs.filter((t) => t.date.startsWith(month) && +t.date.slice(8) >= a && +t.date.slice(8) <= b);
    return {
      label: `Week ${i + 1}`,
      income: list.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expense: list.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    };
  });
}

export function sixMonths(txs: Transaction[]) {
  const cur = monthTotals(txs);
  return [
    ...monthlyHistory.map((m) => ({ label: monthLabel(m.month), month: m.month, income: m.income, expense: m.expense })),
    { label: monthLabel(CURRENT_MONTH), month: CURRENT_MONTH, income: cur.income, expense: cur.expense },
  ];
}

export function dailySpending(txs: Transaction[], month = CURRENT_MONTH, uptoDay = +TODAY.slice(8)) {
  return Array.from({ length: uptoDay }, (_, i) => {
    const day = `${month}-${String(i + 1).padStart(2, '0')}`;
    return { label: shortDate(day), value: txs.filter((t) => t.type === 'expense' && t.date === day).reduce((s, t) => s + t.amount, 0) };
  });
}

export function categoryBreakdown(txs: Transaction[], categories: Category[], opts: { month?: string; from?: string; to?: string; type?: 'income' | 'expense' } = {}) {
  const { month = CURRENT_MONTH, from, to, type = 'expense' } = opts;
  const inRange = (d: string) => (from || to ? (!from || d >= from) && (!to || d <= to) : d.startsWith(month));
  const totals: Record<string, number> = {};
  for (const t of txs) if (t.type === type && inRange(t.date)) totals[t.categoryId] = (totals[t.categoryId] || 0) + t.amount;
  return Object.entries(totals)
    .map(([id, value]) => {
      const c = categories.find((x) => x.id === id);
      return { id, label: c?.name ?? 'Other', color: c?.color ?? '#9AA3B5', value };
    })
    .sort((a, b) => b.value - a.value);
}

/** Simple forecast: average of the last three months' spending, nudged by this month's pace. */
export function forecastNextMonth(txs: Transaction[]) {
  const hist = monthlyHistory.slice(-2).map((m) => m.expense);
  const cur = monthTotals(txs).expense;
  const pace = (cur / +TODAY.slice(8)) * 30;
  return Math.round((hist[0] + hist[1] + pace) / 3 / 100) * 100;
}
