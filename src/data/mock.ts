import type {
  AdminUser, Announcement, AppNotification, Budget, Category, Insight, Profile, Tip, Transaction,
} from '../lib/types';

/* Sample student. All data is local mock data: Campus Coin never connects to a bank. */
export const demoProfile: Profile = {
  name: 'Alex Khan',
  email: 'alex.khan@campus.edu.pk',
  academicYear: '3rd Year',
  allowance: 60000,
  savingsGoal: 20000,
};

export const DEMO_STUDENT = { email: 'alex.khan@campus.edu.pk', password: 'student123' };
export const DEMO_ADMIN = { email: 'admin@campuscoin.pk', password: 'admin123' };

export const defaultCategories: Category[] = [
  { id: 'allowance', name: 'Allowance', type: 'income', icon: 'allowance', color: '#72E6B0', isDefault: true },
  { id: 'job', name: 'Part-time Job', type: 'income', icon: 'job', color: '#4DB6AC', isDefault: true },
  { id: 'scholarship', name: 'Scholarship', type: 'income', icon: 'scholarship', color: '#A99BFF', isDefault: true },
  { id: 'gift', name: 'Gift', type: 'income', icon: 'gift', color: '#F58BB8', isDefault: true },
  { id: 'other-income', name: 'Other Income', type: 'income', icon: 'other-income', color: '#9AA3B5', isDefault: true },
  { id: 'food', name: 'Food', type: 'expense', icon: 'food', color: '#FF8B73', isDefault: true },
  { id: 'transport', name: 'Transport', type: 'expense', icon: 'transport', color: '#8FA8FF', isDefault: true },
  { id: 'hostel', name: 'Hostel/Rent', type: 'expense', icon: 'hostel', color: '#F2C14E', isDefault: true },
  { id: 'academics', name: 'Academics', type: 'expense', icon: 'academics', color: '#4DB6AC', isDefault: true },
  { id: 'subscriptions', name: 'Subscriptions', type: 'expense', icon: 'subscriptions', color: '#A99BFF', isDefault: true },
  { id: 'entertainment', name: 'Entertainment', type: 'expense', icon: 'entertainment', color: '#F58BB8', isDefault: true },
  { id: 'misc', name: 'Miscellaneous', type: 'expense', icon: 'misc', color: '#9AA3B5', isDefault: true },
  // A personal category Alex created under "Manage own categories"
  { id: 'gym', name: 'Gym & Health', type: 'expense', icon: 'health', color: '#72E6B0', isDefault: false },
];

type Seed = [date: string, description: string, categoryId: string, amount: number, recurring?: boolean];

const income: Seed[] = [
  ['2026-09-01', 'Monthly Allowance (1st half)', 'allowance', 30000, true],
  ['2026-09-12', 'Tutoring: O-Level Maths', 'job', 5000],
  ['2026-09-15', 'Monthly Allowance (2nd half)', 'allowance', 30000, true],
  ['2026-08-01', 'Monthly Allowance (1st half)', 'allowance', 30000, true],
  ['2026-08-15', 'Monthly Allowance (2nd half)', 'allowance', 30000, true],
  ['2026-08-20', 'Eid gift from Khala', 'gift', 3000],
];

const expenses: Seed[] = [
  // September 2026: Rs. 22,150 across seven categories
  ['2026-09-23', 'Campus Cafe', 'food', 850],
  ['2026-09-22', 'Metro / Bus card top-up', 'transport', 1200],
  ['2026-09-21', 'Foodpanda: Biryani', 'food', 1450],
  ['2026-09-20', 'Movies at Nueplex', 'entertainment', 1600],
  ['2026-09-19', 'Careem ride home', 'transport', 650],
  ['2026-09-18', 'Campus Cafe', 'food', 620],
  ['2026-09-17', 'Photocopies: lab manual', 'misc', 302],
  ['2026-09-16', 'Books: Financial Accounting', 'academics', 2400],
  ['2026-09-14', 'Groceries: Imtiaz', 'food', 2100],
  ['2026-09-13', 'Bowling with friends', 'entertainment', 1400],
  ['2026-09-12', 'Bykea to library', 'transport', 350],
  ['2026-09-11', 'Mobile top-up', 'misc', 500],
  ['2026-09-10', 'Chai & paratha', 'food', 380],
  ['2026-09-09', 'iCloud storage', 'subscriptions', 250, true],
  ['2026-09-07', 'Qawwali night ticket', 'entertainment', 1200],
  ['2026-09-06', 'Foodpanda: Pizza', 'food', 1800],
  ['2026-09-05', 'Hostel laundry & utilities', 'hostel', 2000, true],
  ['2026-09-04', 'Petrol share (carpool)', 'transport', 1600],
  ['2026-09-03', 'Stationery', 'academics', 700],
  ['2026-09-02', 'Netflix', 'subscriptions', 499, true],
  ['2026-09-02', 'Spotify Student', 'subscriptions', 299, true],
  // August 2026 (partial history shown in the list)
  ['2026-08-28', 'Foodpanda: Burgers', 'food', 1650],
  ['2026-08-25', 'Movies at Cinepax', 'entertainment', 1500],
  ['2026-08-22', 'Semester registration fee', 'academics', 4500],
  ['2026-08-18', 'Campus Cafe', 'food', 760],
  ['2026-08-12', 'Careem ride', 'transport', 820],
  ['2026-08-05', 'Hostel laundry & utilities', 'hostel', 2000, true],
  ['2026-08-02', 'Netflix', 'subscriptions', 499, true],
];

let n = 0;
const toTx = (type: 'income' | 'expense') => ([date, description, categoryId, amount, recurring]: Seed): Transaction => ({
  id: `t${++n}`, date, description, categoryId, amount, type, recurring, createdAt: Date.parse(date),
  aiSuggestedCategoryId: type === 'expense' ? categoryId : undefined,
});

export const seedTransactions: Transaction[] = [...income.map(toTx('income')), ...expenses.map(toTx('expense'))]
  .sort((a, b) => b.date.localeCompare(a.date));

export const seedBudgets: Budget[] = [
  { id: 'b1', categoryId: 'food', limit: 10000, month: '2026-09' },
  { id: 'b2', categoryId: 'transport', limit: 5000, month: '2026-09' },
  { id: 'b3', categoryId: 'entertainment', limit: 4000, month: '2026-09' },
  { id: 'b4', categoryId: 'academics', limit: 5000, month: '2026-09' },
  { id: 'b5', categoryId: 'hostel', limit: 3000, month: '2026-09' },
  { id: 'b6', categoryId: 'subscriptions', limit: 1200, month: '2026-09' },
  { id: 'b7', categoryId: 'misc', limit: 1500, month: '2026-09' },
];

/** Summarised totals for months before the detailed history (used for 6-month trends). */
export const monthlyHistory = [
  { month: '2026-04', income: 60000, expense: 27400, food: 9800, transport: 4100, entertainment: 3100 },
  { month: '2026-05', income: 62500, expense: 25900, food: 9100, transport: 3900, entertainment: 2800 },
  { month: '2026-06', income: 60000, expense: 29800, food: 10400, transport: 3600, entertainment: 4600 },
  { month: '2026-07', income: 64000, expense: 26300, food: 8600, transport: 4200, entertainment: 3300 },
  { month: '2026-08', income: 57830, expense: 24610, food: 7900, transport: 4000, entertainment: 3050 },
];

export const seedInsights: Insight[] = [
  {
    id: 'i-2026-09', month: '2026-09', categoryId: 'food', change: 40,
    summary: 'You spent Rs. 22,150 this month and kept 66% of your income, which puts your Rs. 20,000 savings goal well within reach.',
    pattern: 'Food delivery spending increased 40% compared with your recent average, mostly from two Foodpanda orders.',
    action: 'Try setting a weekly food-delivery limit of Rs. 1,000 to keep this category closer to your goal.',
  },
  {
    id: 'i-2026-08', month: '2026-08', categoryId: 'entertainment', change: 18,
    summary: 'August was steady. Semester fees made Academics your biggest one-off, but everyday spending stayed calm.',
    pattern: 'Your entertainment spending increased compared with your recent average.',
    action: 'Consider setting a weekly entertainment limit, like one paid outing a week.',
  },
  {
    id: 'i-2026-07', month: '2026-07', categoryId: 'transport', change: 12,
    summary: 'You saved Rs. 37,700 in July, your best month since spring.',
    pattern: 'Ride-hailing trips crept up during the summer classes.',
    action: 'A monthly bus card could replace three or four short Careem rides.',
  },
  {
    id: 'i-2026-06', month: '2026-06', categoryId: 'entertainment', change: 49,
    summary: 'June was your busiest month: end-of-semester outings pushed spending to Rs. 29,800.',
    pattern: 'Entertainment rose 49% above your average, mostly on weekends.',
    action: 'Plan one free hangout (a campus event or a picnic) for every paid outing.',
  },
  {
    id: 'i-2026-05', month: '2026-05', categoryId: 'food', change: -7,
    summary: 'Food spending dropped for the second month running. Nice work.',
    pattern: 'Groceries replaced some delivery orders, cutting food costs by 7%.',
    action: 'Keep the grocery routine going; it is already paying off.',
  },
];

export const seedTips: Tip[] = [
  { id: 'tip1', categoryId: 'food', impact: 2400, pinned: true, dismissed: false,
    title: 'Small change, noticeable difference',
    body: 'You spent more on food delivery this month. Preparing two extra meals at home each week could help reduce this category.' },
  { id: 'tip2', categoryId: 'entertainment', impact: 1200, pinned: false, dismissed: false,
    title: 'Your entertainment budget is already spent',
    body: 'Movie tickets cost less on Tuesday discount nights, and campus society screenings are free. Worth a look before the next outing.' },
  { id: 'tip3', categoryId: 'transport', impact: 900, pinned: false, dismissed: false,
    title: 'Rides add up quietly',
    body: 'Three short Careem and Bykea trips this month cost about the same as a week of bus fares. Grouping errands into one trip helps.' },
  { id: 'tip4', categoryId: 'subscriptions', impact: 499, pinned: false, dismissed: false,
    title: 'Check your streaming overlap',
    body: 'You pay for Netflix and Spotify every month. If you watched Netflix less than twice in September, pausing it for a month is an easy win.' },
  { id: 'tip5', categoryId: 'academics', impact: 1500, pinned: false, dismissed: false,
    title: 'Second-hand textbooks work too',
    body: 'Seniors often sell last semester\u2019s books at half price. Urdu Bazaar and your class WhatsApp group are good places to check first.' },
];

const hoursAgo = (h: number) => Date.now() - h * 3600000;

export const seedNotifications: AppNotification[] = [
  { id: 'n1', kind: 'budget-over', title: 'You\u2019ve crossed your entertainment budget this month',
    body: 'You\u2019ve spent Rs. 4,200 of Rs. 4,000. A quiet week could bring it back in line.', time: hoursAgo(3), read: false, link: '/app/budgets' },
  { id: 'n2', kind: 'budget-near', title: 'Transport is getting close to its limit',
    body: 'You\u2019ve used 76% of your Rs. 5,000 transport budget with a week to go.', time: hoursAgo(9), read: false, link: '/app/budgets' },
  { id: 'n3', kind: 'insight', title: 'Your September insight is ready',
    body: 'See what changed this month and one small thing to try next.', time: hoursAgo(26), read: false, link: '/app/insights' },
  { id: 'n4', kind: 'tip', title: 'New saving tip for you',
    body: 'Second-hand textbooks could save you around Rs. 1,500 this semester.', time: hoursAgo(50), read: true, link: '/app/tips' },
  { id: 'n5', kind: 'import', title: 'CSV import finished',
    body: '12 August transactions were added and categorized. Nothing needed fixing.', time: hoursAgo(120), read: true, link: '/app/transactions' },
];

/* ---------------- Admin mock data ---------------- */
export const adminUsers: AdminUser[] = [
  { id: 'u1', name: 'Alex Khan', email: 'alex.khan@campus.edu.pk', academicYear: '3rd Year', joined: '2026-02-11', transactions: 214, status: 'active', lastActive: 'Today' },
  { id: 'u2', name: 'Ayesha Siddiqui', email: 'ayesha.s@iba.edu.pk', academicYear: '2nd Year', joined: '2026-03-02', transactions: 188, status: 'active', lastActive: 'Today' },
  { id: 'u3', name: 'Hamza Qureshi', email: 'hamza.q@neduet.edu.pk', academicYear: '4th Year', joined: '2026-01-19', transactions: 342, status: 'active', lastActive: 'Yesterday' },
  { id: 'u4', name: 'Fatima Noor', email: 'fatima.noor@szabist.pk', academicYear: '1st Year', joined: '2026-09-02', transactions: 37, status: 'active', lastActive: 'Today' },
  { id: 'u5', name: 'Bilal Ahmed', email: 'bilal.ahmed@fast.edu.pk', academicYear: '3rd Year', joined: '2026-04-27', transactions: 96, status: 'disabled', lastActive: '12 Aug' },
  { id: 'u6', name: 'Zainab Raza', email: 'zainab.raza@ku.edu.pk', academicYear: '2nd Year', joined: '2026-05-14', transactions: 151, status: 'active', lastActive: '2 days ago' },
  { id: 'u7', name: 'Usman Tariq', email: 'usman.t@lums.edu.pk', academicYear: 'Masters', joined: '2026-06-08', transactions: 73, status: 'active', lastActive: '5 days ago' },
  { id: 'u8', name: 'Mahnoor Iqbal', email: 'mahnoor.i@habib.edu.pk', academicYear: '1st Year', joined: '2026-09-10', transactions: 19, status: 'active', lastActive: 'Today' },
];

export const adminActivity = [
  { label: 'Apr', active: 420, tx: 6100 }, { label: 'May', active: 610, tx: 8800 }, { label: 'Jun', active: 740, tx: 11200 },
  { label: 'Jul', active: 690, tx: 10400 }, { label: 'Aug', active: 980, tx: 14900 }, { label: 'Sep', active: 1284, tx: 19650 },
];

export const categoryUsage = [
  { id: 'food', share: 31 }, { id: 'transport', share: 19 }, { id: 'entertainment', share: 14 },
  { id: 'academics', share: 12 }, { id: 'subscriptions', share: 10 }, { id: 'hostel', share: 8 }, { id: 'misc', share: 6 },
];

export const seedAnnouncements: Announcement[] = [
  { id: 'a1', kind: 'announcement', title: 'Mid-term week is coming', body: 'Stationery and printing costs usually spike during mid-terms. Set an Academics budget now so it doesn\u2019t surprise you.', audience: 'All students', status: 'live' },
  { id: 'a2', kind: 'tip', title: 'Carry a water bottle', body: 'Buying bottled water daily on campus can cost Rs. 1,500+ a month. Most departments have filtered water coolers.', audience: 'All students', status: 'live' },
  { id: 'a3', kind: 'tip', title: 'Split subscriptions fairly', body: 'Sharing a family streaming plan with hostel friends can cut the cost per person by more than half.', audience: 'Hostel residents', status: 'draft' },
];
