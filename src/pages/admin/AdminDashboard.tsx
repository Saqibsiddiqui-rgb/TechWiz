import { useEffect, useState } from 'react';
import { Activity, Receipt, UserPlus, Users, Utensils } from 'lucide-react';
import { useStore } from '../../lib/store';
import { adminActivity, categoryUsage } from '../../data/mock';
import { navigate } from '../../lib/router';
import { PageHeader } from '../../components/PageHeader';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge, Skeleton } from '../../components/ui/Feedback';
import { Button } from '../../components/ui/Button';
import { AreaChart, BarChart, ShareBars } from '../../components/charts/Charts';
import { useAdmin } from '../../layouts/AdminLayout';
import { Avatar } from '../../layouts/StudentLayout';
import { CountCard, count } from './AdminShared';

export default function AdminDashboard() {
  const { cat } = useStore();
  const { users } = useAdmin();
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 550); return () => clearTimeout(t); }, []);
  const newest = [...users].sort((a, b) => b.joined.localeCompare(a.joined)).slice(0, 4);

  return (
    <div className="space-y-6">
      <PageHeader title="Campus Coin at a glance" subtitle="How students are using the platform this month. Numbers update daily at midnight."
        actions={<Button variant="secondary" onClick={() => navigate('/admin/stats')}>Full statistics</Button>} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <CountCard label="Active users" value="1,284" delta="31%" note="vs August" icon={<Activity className="h-4 w-4" />} accent="#72E6B0" />
        <CountCard label="Total users" value="3,972" delta="212" note="joined this month" icon={<Users className="h-4 w-4" />} accent="#A99BFF" />
        <CountCard label="Transactions logged" value="19,650" delta="32%" note="this month" icon={<Receipt className="h-4 w-4" />} accent="#FF8B73" />
        <Card interactive className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">Most used category</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral/20 text-neg"><Utensils className="h-4 w-4" /></span>
          </div>
          <p className="mt-3 text-[1.9rem] font-extrabold leading-none tracking-tight">Food</p>
          <p className="mt-2 text-xs text-muted">31% of all expense entries</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <CardHeader title="User activity" subtitle="Monthly active students, last 6 months" action={<Badge tone="pos">+206% since April</Badge>} />
          <div className="mt-4">
            {loading ? <Skeleton className="h-[220px] w-full" /> :
              <AreaChart data={adminActivity.map((a) => ({ label: a.label, value: a.active }))} color="#72E6B0" height={220} valueLabel="Active students" format={count} />}
          </div>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <CardHeader title="Category usage" subtitle="Share of expense entries" />
          <div className="mt-5">
            {loading ? <div className="space-y-4">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-6 w-full" />)}</div> :
              <ShareBars rows={categoryUsage.slice(0, 6).map((u) => ({ label: cat(u.id)?.name ?? u.id, value: u.share, color: cat(u.id)?.color ?? '#697386', note: `${u.share}%` }))} />}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <CardHeader title="Transactions" subtitle="Entries logged per month across all students" />
          <div className="mt-4">
            {loading ? <Skeleton className="h-[220px] w-full" /> :
              <BarChart data={adminActivity} series={[{ key: 'tx', name: 'Transactions', color: '#A99BFF' }]} height={220} format={count} />}
          </div>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <CardHeader title="Newest students" subtitle="Say hi in an announcement?" action={<a href="#/admin/users" className="text-sm font-semibold text-muted hover:text-fg">All users</a>} />
          <ul className="mt-4 divide-y divide-line">
            {newest.map((u) => (
              <li key={u.id} className="flex items-center gap-3 py-3">
                <Avatar name={u.name} size={34} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{u.name}</span>
                  <span className="block truncate text-xs text-muted">{u.academicYear} · joined {new Date(u.joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                </span>
                <UserPlus className="h-4 w-4 text-muted" />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
