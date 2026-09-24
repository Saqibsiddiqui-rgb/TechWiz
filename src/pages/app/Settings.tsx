import { useState } from 'react';
import { Laptop, Lock, Moon, RotateCcw, Smartphone, Sun } from 'lucide-react';
import type { Profile } from '../../lib/types';
import { cx, rs } from '../../lib/format';
import { useStore, type FontSize } from '../../lib/store';
import { navigate } from '../../lib/router';
import { PageHeader } from '../../components/PageHeader';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Segmented, Select, Toggle } from '../../components/ui/Field';
import { Badge, Modal, Tabs } from '../../components/ui/Feedback';
import { Avatar } from '../../layouts/StudentLayout';

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Masters', 'Other'];

export default function Settings({ initialTab }: { initialTab: 'profile' | 'preferences' | 'security' }) {
  const [tab, setTab] = useState(initialTab);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Profile & Settings" subtitle="Your details, how Campus Coin looks, and keeping your account safe." />
      <Tabs value={tab} onChange={(t) => { setTab(t); navigate(t === 'profile' ? '/app/profile' : '/app/settings'); }}
        tabs={[{ value: 'profile', label: 'Profile' }, { value: 'preferences', label: 'Preferences' }, { value: 'security', label: 'Security' }]} />
      <div className="anim-fade">
        {tab === 'profile' && <ProfileForm />}
        {tab === 'preferences' && <Preferences />}
        {tab === 'security' && <Security />}
      </div>
    </div>
  );
}

function ProfileForm() {
  const { profile, updateProfile, toast } = useStore();
  const [p, setP] = useState<Profile>(profile);
  const [allowance, setAllowance] = useState(String(profile.allowance));
  const [goal, setGoal] = useState(String(profile.savingsGoal));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify({ ...p, allowance: +allowance, savingsGoal: +goal }) !== JSON.stringify(profile);

  const save = () => {
    const e: Record<string, string> = {};
    if (p.name.trim().length < 2) e.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(p.email)) e.email = 'Enter a valid email, like you@university.edu.pk';
    if (!(+allowance >= 0) || allowance === '') e.allowance = 'Enter your usual monthly allowance (0 is fine).';
    if (!(+goal > 0)) e.goal = 'Set a savings goal above zero.';
    else if (+allowance && +goal > +allowance) e.goal = 'Your goal is higher than your allowance. That\u2019s bold. Maybe start smaller?';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    setTimeout(() => { updateProfile({ ...p, allowance: +allowance, savingsGoal: +goal }); setSaving(false); toast('Profile saved. Your dashboard is updated.'); }, 500);
  };

  return (
    <Card className="p-5 sm:p-7">
      <div className="flex items-center gap-4">
        <Avatar name={p.name || 'A'} size={64} />
        <div><p className="text-lg font-bold">{p.name}</p><p className="text-sm text-muted">{p.academicYear} · Student account</p></div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input label="Full name" value={p.name} error={errors.name} onChange={(e) => setP({ ...p, name: e.target.value })} autoComplete="name" />
        <Input label="Email" type="email" value={p.email} error={errors.email} onChange={(e) => setP({ ...p, email: e.target.value })} autoComplete="email" />
        <Select label="Academic year" value={p.academicYear} onChange={(e) => setP({ ...p, academicYear: e.target.value })} options={YEARS.map((y) => ({ value: y, label: y }))} />
        <Input label="Monthly allowance" prefix="Rs." inputMode="numeric" value={allowance} error={errors.allowance} onChange={(e) => setAllowance(e.target.value.replace(/\D/g, ''))} hint="Your usual baseline, before part-time income" />
        <Input label="Monthly savings goal" prefix="Rs." inputMode="numeric" value={goal} error={errors.goal} onChange={(e) => setGoal(e.target.value.replace(/\D/g, ''))}
          hint={+allowance ? `That\u2019s ${Math.round((+goal / +allowance) * 100)}% of your allowance` : undefined} />
      </div>
      <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-5">
        {dirty && <span className="text-sm text-muted">Unsaved changes</span>}
        <Button disabled={!dirty} loading={saving} onClick={save}>Save profile</Button>
      </div>
    </Card>
  );
}

function Preferences() {
  const { settings, updateSettings, resetDemo, toast } = useStore();
  const [confirm, setConfirm] = useState(false);
  const n = settings.notify;
  return (
    <div className="space-y-5">
      <Card className="p-5 sm:p-7">
        <CardHeader title="Appearance" subtitle="Make Campus Coin comfortable to read." />
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[{ dark: false, label: 'Light', icon: Sun }, { dark: true, label: 'Dark', icon: Moon }].map((o) => (
            <button key={o.label} onClick={() => updateSettings({ dark: o.dark })} aria-pressed={settings.dark === o.dark}
              className={cx('overflow-hidden rounded-2xl border-2 text-left transition-colors', settings.dark === o.dark ? 'border-fg' : 'border-line hover:border-fg/30')}>
              <div className={cx('flex h-20 gap-2 p-3', o.dark ? 'bg-[#11141B]' : 'bg-cream')}>
                <div className={cx('w-6 rounded-md', o.dark ? 'bg-[#0C0F15]' : 'bg-ink')} />
                <div className="flex-1 space-y-1.5"><div className={cx('h-3 rounded', o.dark ? 'bg-[#1A1F2A]' : 'bg-white')} /><div className="h-3 w-2/3 rounded bg-mint" /><div className="h-3 w-1/2 rounded bg-lavender" /></div>
              </div>
              <p className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold"><o.icon className="h-4 w-4" />{o.label} mode</p>
            </button>
          ))}
        </div>
        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold">Text size</p>
          <Segmented<FontSize> label="Text size" value={settings.fontSize} onChange={(v) => updateSettings({ fontSize: v })}
            options={[{ value: 'sm', label: <span className="text-xs">Aa Small</span> }, { value: 'md', label: <span className="text-sm">Aa Default</span> }, { value: 'lg', label: <span className="text-base">Aa Large</span> }]} />
          <p className="mt-2 text-xs text-muted">Changes text across the whole app, including charts and numbers.</p>
        </div>
      </Card>

      <Card className="p-5 sm:p-7">
        <CardHeader title="Notifications" subtitle="Choose what Campus Coin tells you about." />
        <div className="mt-2 divide-y divide-line/60">
          <Toggle label="Budget alerts" description="When a category reaches 80% and when it goes over" checked={n.budget} onChange={(v) => updateSettings({ notify: { ...n, budget: v } })} />
          <Toggle label="New saving tips" description="When we spot a new way to save" checked={n.tips} onChange={(v) => updateSettings({ notify: { ...n, tips: v } })} />
          <Toggle label="Monthly insight" description="When your AI summary for the month is ready" checked={n.insights} onChange={(v) => updateSettings({ notify: { ...n, insights: v } })} />
          <Toggle label="Import updates" description="When a CSV import finishes" checked={n.imports} onChange={(v) => updateSettings({ notify: { ...n, imports: v } })} />
        </div>
      </Card>

      <Card className="p-5 sm:p-7">
        <CardHeader title="Demo data" subtitle="Start over with Alex's sample month." />
        <Button className="mt-4" variant="secondary" icon={<RotateCcw className="h-4 w-4" />} onClick={() => setConfirm(true)}>Reset sample data</Button>
      </Card>
      <Modal open={confirm} onClose={() => setConfirm(false)} title="Reset all sample data?" subtitle="Your added transactions, budgets and categories will be replaced with the demo month."
        footer={<><Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button><Button variant="danger" onClick={() => { resetDemo(); setConfirm(false); toast('Sample data restored.', 'info'); }}>Reset data</Button></>}>
        <p className="text-sm text-muted">Your settings stay the same.</p>
      </Modal>
    </div>
  );
}

function Security() {
  const { toast, profile } = useStore();
  const [cur, setCur] = useState(''); const [next, setNext] = useState(''); const [conf, setConf] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const strength = [next.length >= 8, /\d/.test(next), /[A-Z]/.test(next), /[^A-Za-z0-9]/.test(next)].filter(Boolean).length;
  const change = () => {
    const e: Record<string, string> = {};
    if (!cur) e.cur = 'Enter your current password.';
    if (next.length < 8) e.next = 'Use at least 8 characters.';
    if (conf !== next) e.conf = 'Passwords don\u2019t match yet.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    setTimeout(() => { setSaving(false); setCur(''); setNext(''); setConf(''); toast('Password updated. You\u2019re all set.'); }, 700);
  };
  return (
    <div className="space-y-5">
      <Card className="p-5 sm:p-7">
        <CardHeader title="Change password" subtitle={`Signed in as ${profile.email}`} />
        <div className="mt-5 space-y-4">
          <Input label="Current password" type="password" value={cur} error={errors.cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" />
          <Input label="New password" type="password" value={next} error={errors.next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password"
            hint={next ? `Strength: ${['Too weak', 'Weak', 'Okay', 'Good', 'Strong'][strength]}` : 'At least 8 characters. A number and a symbol make it stronger.'} />
          <div className="flex gap-1.5" aria-hidden>{[0, 1, 2, 3].map((i) => <span key={i} className={cx('h-1.5 flex-1 rounded-full', i < strength ? (strength > 2 ? 'bg-mint' : 'bg-[#F2C14E]') : 'bg-line')} />)}</div>
          <Input label="Confirm new password" type="password" value={conf} error={errors.conf} onChange={(e) => setConf(e.target.value)} autoComplete="new-password" />
          <div className="flex justify-end"><Button loading={saving} icon={<Lock className="h-4 w-4" />} onClick={change}>Update password</Button></div>
        </div>
      </Card>
      <Card className="p-5 sm:p-7">
        <CardHeader title="Where you're signed in" subtitle="Sessions end automatically after 7 days of inactivity." />
        <ul className="mt-4 divide-y divide-line/60">
          <li className="flex items-center gap-3 py-3"><Laptop className="h-5 w-5 text-muted" /><div className="flex-1"><p className="font-semibold">Chrome on Windows</p><p className="text-xs text-muted">Karachi · Active now</p></div><Badge tone="pos">This device</Badge></li>
          <li className="flex items-center gap-3 py-3"><Smartphone className="h-5 w-5 text-muted" /><div className="flex-1"><p className="font-semibold">Safari on iPhone</p><p className="text-xs text-muted">Karachi · 2 days ago</p></div></li>
        </ul>
        <Button variant="secondary" className="mt-3" onClick={() => toast('Signed out of other devices.', 'info')}>Sign out of other devices</Button>
      </Card>
      <p className="text-center text-xs text-muted">Only you can see your transactions. Campus Coin never asks for bank or card details. Allowance baseline: {rs(profile.allowance)}.</p>
    </div>
  );
}
