import { useEffect, useState } from 'react';
import { Clock, Database, Gauge, Sparkles } from 'lucide-react';
import { useStore } from '../../lib/store';
import { adminActivity, categoryUsage } from '../../data/mock';
import { PageHeader } from '../../components/PageHeader';
import { Card, CardHeader } from '../../components/ui/Card';
import { Segmented } from '../../components/ui/Field';
import { Skeleton } from '../../components/ui/Feedback';
import { BarChart, DonutChart, Legend } from '../../components/charts/Charts';
import { CountCard, count } from './AdminShared';

type Range = '3m' | '6m';
const byYear = [
  { label: '1st Year', value: 842 }, { label: '2nd Year', value: 1106 }, { label: '3rd Year', value: 978 },
  { label: '4th Year', value: 731 }, { label: 'Masters', value: 315 },
];
const features = [
  { label: 'Quick add', value: 88 }, { label: 'Budgets', value: 64 }, { label: 'AI category suggestions', value: 57 },
  { label: 'Monthly insights', value: 49 }, { label: 'CSV import', value: 12 }, { label: 'Report export', value: 18 },
];

export default function AdminStats() {
  const { cat } = useStore();
  const [range, setRange] = useState<Range>('6m');
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 450); return () => clearTimeout(t); }, [range]);
  const rows = range === '3m' ? adminActivity.slice(-3) : adminActivity;
  const perUser = Math.round(rows[rows.length - 1].tx / rows[rows.length - 1].active);

  return (
    <div className="space-y-6">
      <PageHeader title="System statistics" subtitle="Aggregated usage only. No individual student's money data is shown here."
        actions={<Segmented label="Time range" value={range} onChange={setRange} options={[{ value: '3m', label: '3 months' }, { value: '6m', label: '6 months' }]} />} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <CountCard label="Entries per active user" value={String(perUser)} note="this month" icon={<Gauge className="h-4 w-4" />} accent="#72E6B0" />
        <CountCard label="AI suggestions accepted" value="86%" note="students kept the suggested category" icon={<Sparkles className="h-4 w-4" />} accent="#A99BFF" />
        <CountCard label="Median time to log" value="7s" note="from tap to saved" icon={<Clock className="h-4 w-4" />} accent="#FF8B73" />
        <CountCard label="Records stored" value="98,420" note="transactions, all time" icon={<Database className="h-4 w-4" />} accent="#697386" />
      </div>

      <Card className="p-5">
        <CardHeader title="Active users vs transactions" subtitle="Transactions shown in hundreds so both fit one scale" />
        <div className="mt-4">
          {loading ? <Skeleton className="h-[260px] w-full" /> : (
            <BarChart height={260} format={count}
              data={rows.map((r) => ({ label: r.label, active: r.active, tx: Math.round(r.tx / 100) }))}
              series={[{ key: 'active', name: 'Active users', color: '#72E6B0' }, { key: 'tx', name: 'Transactions (×100)', color: '#A99BFF' }]} />
          )}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <CardHeader title="Category usage" subtitle="Share of expense entries" />
          <div className="mt-4 flex flex-col items-center gap-4">
            <DonutChart size={180} format={(n) => `${n}%`} data={categoryUsage.map((u) => ({ label: cat(u.id)?.name ?? u.id, value: u.share, color: cat(u.id)?.color ?? '#697386' }))}
              center={<><span className="text-xs text-muted">Top</span><span className="text-lg font-extrabold">Food</span></>} />
            <Legend items={categoryUsage.map((u) => ({ label: cat(u.id)?.name ?? u.id, color: cat(u.id)?.color ?? '#697386', value: `${u.share}%` }))} />
          </div>
        </Card>
        <Card className="p-5">
          <CardHeader title="Students by year" subtitle="Total registered" />
          <ul className="mt-5 space-y-4">
            {byYear.map((y) => (
              <li key={y.label}>
                <div className="flex justify-between text-sm"><span className="font-semibold">{y.label}</span><span className="money font-bold">{count(y.value)}</span></div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-fg/[.07]"><div className="anim-grow-x h-full rounded-full bg-lavender" style={{ width: `${(y.value / 1106) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <CardHeader title="Feature adoption" subtitle="% of active users this month" />
          <ul className="mt-5 space-y-4">
            {features.map((f) => (
              <li key={f.label}>
                <div className="flex justify-between text-sm"><span className="font-semibold">{f.label}</span><span className="money font-bold">{f.value}%</span></div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-fg/[.07]"><div className="anim-grow-x h-full rounded-full bg-mint" style={{ width: `${f.value}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
