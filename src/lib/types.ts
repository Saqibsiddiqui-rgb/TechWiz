export type TxType = 'income' | 'expense';

export type IconKey =
  | 'allowance' | 'job' | 'scholarship' | 'gift' | 'other-income'
  | 'food' | 'transport' | 'hostel' | 'academics' | 'subscriptions' | 'entertainment' | 'misc'
  | 'groceries' | 'health' | 'music' | 'phone' | 'custom';

export interface Category {
  id: string;
  name: string;
  type: TxType;
  icon: IconKey;
  color: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  categoryId: string;
  type: TxType;
  amount: number;
  recurring?: boolean;
  aiSuggestedCategoryId?: string;
  createdAt: number;
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  month: string; // YYYY-MM
}

export interface Insight {
  id: string;
  month: string; // YYYY-MM
  summary: string;
  pattern: string;
  action: string;
  change: number; // % change of the flagged category vs the student's own average
  categoryId: string;
}

export interface Tip {
  id: string;
  categoryId: string;
  title: string;
  body: string;
  impact: number; // estimated monthly saving in Rs.
  pinned: boolean;
  dismissed: boolean;
}

export type NotificationKind = 'budget-near' | 'budget-over' | 'tip' | 'insight' | 'import';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: number;
  read: boolean;
  link?: string;
}

export interface Profile {
  name: string;
  email: string;
  academicYear: string;
  allowance: number;
  savingsGoal: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  academicYear: string;
  joined: string;
  transactions: number;
  status: 'active' | 'disabled';
  lastActive: string;
}

export interface Announcement {
  id: string;
  kind: 'tip' | 'announcement';
  title: string;
  body: string;
  audience: string;
  status: 'live' | 'draft';
}
