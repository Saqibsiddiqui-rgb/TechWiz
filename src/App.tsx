import { useEffect, type ReactNode } from 'react';
import { useRoute, navigate } from './lib/router';
import { useStore } from './lib/store';
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';
import Landing from './pages/public/Landing';
import { ForgotPassword, Login, Register } from './pages/public/Auth';
import Dashboard from './pages/app/Dashboard';
import Transactions from './pages/app/Transactions';
import AddTransaction from './pages/app/AddTransaction';
import Categories from './pages/app/Categories';
import Budgets from './pages/app/Budgets';
import Reports from './pages/app/Reports';
import Insights from './pages/app/Insights';
import Tips from './pages/app/Tips';
import Bookmarks from './pages/app/Bookmarks';
import Notifications from './pages/app/Notifications';
import Settings from './pages/app/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminTips from './pages/admin/AdminTips';
import AdminStats from './pages/admin/AdminStats';

const titles: Record<string, string> = {
  '/': 'Know where your money goes', '/login': 'Log in', '/register': 'Create account', '/forgot-password': 'Reset password',
  '/admin/login': 'Admin sign in', '/app': 'Overview', '/app/transactions': 'Transactions', '/app/budgets': 'Budgets',
  '/app/reports': 'Reports', '/app/insights': 'AI Insights', '/app/tips': 'Saving Tips', '/app/bookmarks': 'Bookmarks',
  '/app/categories': 'Categories', '/app/notifications': 'Notifications', '/app/settings': 'Settings', '/app/profile': 'Profile',
  '/app/add-expense': 'Add expense', '/app/add-income': 'Add income', '/admin': 'Admin overview', '/admin/users': 'Users',
  '/admin/categories': 'Default categories', '/admin/tips': 'Tips & announcements', '/admin/stats': 'System statistics',
};

function Guard({ ok, to, children }: { ok: boolean; to: string; children: ReactNode }) {
  useEffect(() => { if (!ok) navigate(to); }, [ok, to]);
  return ok ? <>{children}</> : null;
}

export default function App() {
  const path = useRoute();
  const { role } = useStore();
  const [route, qs] = path.split('?');
  const query = new URLSearchParams(qs ?? '');

  useEffect(() => { document.title = `${titles[route] ?? 'Campus Coin'} · Campus Coin`; }, [route]);

  if (route.startsWith('/admin') && route !== '/admin/login') {
    const page: Record<string, ReactNode> = {
      '/admin': <AdminDashboard />, '/admin/users': <AdminUsers />, '/admin/categories': <AdminCategories />,
      '/admin/tips': <AdminTips />, '/admin/stats': <AdminStats />,
    };
    return (
      <Guard ok={role === 'admin'} to="/admin/login">
        <AdminLayout path={path}>{page[route] ?? <NotFound home="/admin" />}</AdminLayout>
      </Guard>
    );
  }

  if (route.startsWith('/app')) {
    const page: Record<string, ReactNode> = {
      '/app': <Dashboard />, '/app/transactions': <Transactions query={query} />,
      '/app/add-expense': <AddTransaction type="expense" />, '/app/add-income': <AddTransaction type="income" />,
      '/app/categories': <Categories />, '/app/budgets': <Budgets />, '/app/reports': <Reports />, '/app/insights': <Insights />,
      '/app/tips': <Tips />, '/app/bookmarks': <Bookmarks />, '/app/notifications': <Notifications />,
      '/app/profile': <Settings key="profile" initialTab="profile" />, '/app/settings': <Settings key="settings" initialTab="preferences" />,
    };
    return (
      <Guard ok={role === 'student'} to="/login">
        <StudentLayout path={path}>{page[route] ?? <NotFound home="/app" />}</StudentLayout>
      </Guard>
    );
  }

  switch (route) {
    case '/login': return <Login key="student" />;
    case '/admin/login': return <Login key="admin" admin />;
    case '/register': return <Register />;
    case '/forgot-password': return <ForgotPassword />;
    case '/': return <Landing />;
    default: return <NotFound home="/" />;
  }
}

function NotFound({ home }: { home: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <p className="money text-6xl font-extrabold text-muted/40">404</p>
      <h1 className="mt-3 text-2xl font-extrabold">This page wandered off campus</h1>
      <p className="mt-2 max-w-sm text-muted">The link might be old, or there was a typo. Your money data is safe either way.</p>
      <a href={`#${home}`} className="mt-6 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-cream dark:bg-mint dark:text-ink">Take me back</a>
    </div>
  );
}
