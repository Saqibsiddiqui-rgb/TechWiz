import type { ReactNode } from 'react';
import { ArrowRight, Bell, Bookmark, FileDown, Lock, Pin, Plus, Sparkles, Upload, Wallet } from 'lucide-react';
import { useStore } from '../../lib/store';
import { rs } from '../../lib/format';
import { LogoMark } from '../../components/Brand';
import { Logo} from '../../components/Brand'
import { CategoryIcon } from '../../components/Brand';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/Feedback';
import { navigate } from '../../lib/router';
import type { IconKey } from '../../lib/types';

const examples: { name: string; cat: string; icon: IconKey; color: string; amount: number }[] = [
  { name: 'Campus Cafe', cat: 'Food', icon: 'food', color: '#FF8B73', amount: 850 },
  { name: 'Bus / Ride', cat: 'Transport', icon: 'transport', color: '#8FA8FF', amount: 1200 },
  { name: 'Hostel', cat: 'Hostel/Rent', icon: 'hostel', color: '#F2C14E', amount: 2000 },
  { name: 'Books', cat: 'Academics', icon: 'academics', color: '#4DB6AC', amount: 2400 },
  { name: 'Netflix', cat: 'Subscriptions', icon: 'subscriptions', color: '#A99BFF', amount: 499 },
  { name: 'Movies', cat: 'Entertainment', icon: 'entertainment', color: '#F58BB8', amount: 1600 },
  { name: 'Groceries', cat: 'Food', icon: 'groceries', color: '#FF8B73', amount: 2100 },
];

export default function Landing() {
  const { role } = useStore();
  const start = () => navigate(role === 'student' ? '/app' : '/register');
  return (
    <div className="min-h-screen bg-[#AAE4B7] text-fg">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-[backdrop-blur-md bg-white/20 border border-white/20] backdrop-blur-md" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#/" className='h-12 w-12 flex'><LogoMark /><Logo /></a>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-muted md:flex" aria-label="Sections">
            <a href="#/?s=how" onClick={(e) => { e.preventDefault(); document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-fg">How it works</a>
            <a href="#/?s=insights" onClick={(e) => { e.preventDefault(); document.getElementById('insights')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-fg">Insights</a>
            <a href="#/?s=tips" onClick={(e) => { e.preventDefault(); document.getElementById('tips')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-fg">Saving tips</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="#/login" className="hidden rounded-xl px-3 py-2 text-sm font-semibold hover:bg-fg/5 sm:block">Log in</a>
            <Button size="sm" onClick={start}>Start Tracking</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 lg:grid-cols-[1fr_1.1fr] lg:pt-16">
        <div className="anim-page">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-semibold">
            <span className="h-2 w-2 rounded-full bg-mint" /> Built for college &amp; university students
          </p>
          <h1 className="mt-6 text-[2.9rem] font-extrabold leading-[0.98] tracking-[-0.035em] sm:text-[4.2rem]">Know where your money goes.</h1>
          <p className="mt-6 max-w-lg text-lg text-muted">Campus Coin helps students track spending, set budgets, and build smarter money habits, without complicated banking integrations.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={start} icon={<Plus className="h-5 w-5" />}>Start Tracking</Button>
            <Button size="lg" variant="secondary" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>See How It Works</Button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted"><Lock className="h-4 w-4" /> No bank login. No card details. Just you and your spending.</p>
        </div>
        <HeroPreview />
      </section>

      {/* Why */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3">
          <h2 className="text-3xl font-extrabold tracking-tight md:col-span-3">Why Campus Coin?</h2>
          <Why title="Made for irregular money" body="Allowance twice a month, a tutoring gig, Eidi from relatives. Campus Coin handles income that doesn't arrive like a salary." />
          <Why title="Categories that match your life" body="Canteen food, hostel dues, books, rides and streaming. Not mortgages and car loans. Add your own in a tap." />
          <Why title="Advice in plain words" body="Once a month, AI explains what changed and suggests one small, doable adjustment. You stay in control." />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="max-w-xl text-3xl font-extrabold tracking-tight">The stuff you actually spend on.</h2>
        <p className="mt-3 max-w-xl text-muted">Type &ldquo;Campus Cafe&rdquo; and Campus Coin files it under Food. Change it once and it remembers.</p>
        <div className="no-scrollbar -mx-5 mt-8 flex gap-3 overflow-x-auto px-5 pb-2">
          {examples.map((e) => (
            <div key={e.name} className="flex min-w-[170px] flex-col gap-3 rounded-card border border-line bg-surface p-4 shadow-soft">
              <CategoryIcon icon={e.icon} color={e.color} size="lg" />
              <div><p className="font-bold">{e.name}</p><p className="text-xs text-muted">{e.cat}</p></div>
              <p className="money text-lg font-extrabold">− {rs(e.amount)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-ink text-cream">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-3xl font-extrabold tracking-tight">How it works</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { t: 'Sign up with your allowance', b: 'Tell us roughly what comes in each month and what you\u2019d like to save.', i: <Wallet className="h-5 w-5" /> },
              { t: 'Log spending in seconds', b: 'Quick-add from any screen, or import older transactions from a CSV file.', i: <Upload className="h-5 w-5" /> },
              { t: 'See the month clearly', b: 'Budgets, charts and a monthly AI summary show what changed and what to try.', i: <Sparkles className="h-5 w-5" /> },
            ].map((s, i) => (
              <li key={s.t} className="relative">
                <span className="money text-6xl font-extrabold text-cream/15">{i + 1}</span>
                <span className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-ink">{s.i}</span>
                <h3 className="mt-4 text-lg font-bold">{s.t}</h3>
                <p className="mt-2 text-cream/70">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Insights + budgets */}
      <section id="insights" className="mx-auto grid max-w-6xl gap-6 px-5 py-20 lg:grid-cols-2">
        <div className="ai-texture relative overflow-hidden rounded-[1.75rem] border border-lavender/50 bg-lavender-soft p-7 dark:bg-lavender/[.08] sm:p-9">
          <p className="flex items-center gap-2 text-sm font-bold text-ai"><Sparkles className="h-4 w-4" /> Smart insights</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Your month, explained.</h2>
          <div className="mt-6 rounded-2xl bg-surface p-5 shadow-soft">
            <p className="font-bold">Food delivery spending increased 40% compared with your recent average.</p>
            <p className="mt-3 text-sm text-muted">Try setting a weekly food-delivery limit to keep this category closer to your goal.</p>
          </div>
          <p className="mt-4 text-xs text-muted">Suggestions, not financial advice. You can always override them.</p>
        </div>
        <div className="rounded-[1.75rem] border border-line bg-surface p-7 shadow-soft sm:p-9">
          <p className="text-sm font-bold text-pos">Budget goals</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">A heads-up before you overspend.</h2>
          <div className="mt-6 space-y-5">
            {[['Food', 7200, 10000], ['Transport', 3800, 5000], ['Entertainment', 4200, 4000]].map(([n, s, l]) => (
              <div key={n as string}>
                <div className="mb-1.5 flex justify-between text-sm"><b>{n}</b><span className="money text-muted"><b className="text-fg">{rs(s as number)}</b> / {rs(l as number)}</span></div>
                <ProgressBar value={s as number} max={l as number} label={`${n} budget`} />
              </div>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 rounded-2xl bg-coral/15 px-4 py-3 text-sm"><Bell className="h-4 w-4 text-neg" /> You&rsquo;ve crossed your entertainment budget this month.</p>
        </div>
      </section>

      {/* Tips */}
      <section id="tips" className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="text-3xl font-extrabold tracking-tight">Saving tips that sound like a friend, not a bank.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['Small change, noticeable difference', 'Preparing two extra meals at home each week could shrink your food category.', 2400],
            ['Rides add up quietly', 'Three short rides cost about a week of bus fares. Group errands into one trip.', 900],
            ['Second-hand textbooks work too', 'Seniors often sell last semester\u2019s books at half price.', 1500],
          ].map(([t, b, v]) => (
            <article key={t as string} className="rounded-card border border-line bg-surface p-5">
              <span aria-hidden>💡</span>
              <h3 className="mt-2 font-bold">{t}</h3>
              <p className="mt-1 text-sm text-muted">{b}</p>
              <p className="mt-4 flex items-center justify-between text-xs font-bold"><span className="text-pos">~{rs(v as number)}/month</span><span className="flex gap-2 text-muted"><Pin className="h-4 w-4" /><Bookmark className="h-4 w-4" /></span></p>
            </article>
          ))}
        </div>
      </section>

      {/* Mobile preview */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Log it at the canteen counter.</h2>
            <p className="mt-3 max-w-md text-muted">On your phone, the big plus button is always one thumb away. Balance, budgets and your latest spending come first.</p>
            <ul className="mt-6 space-y-2 text-sm font-semibold">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-mint" /> Works in any modern browser on phone, tablet or laptop</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-mint" /> Dark mode and adjustable text size</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-mint" /> Export monthly reports as PDF or image <FileDown className="h-4 w-4 text-muted" /></li>
            </ul>
          </div>
          <PhonePreview />
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-7 py-14 text-cream sm:px-14">
          <svg className="absolute -right-12 -top-12 h-64 w-64 opacity-60" viewBox="0 0 100 100" aria-hidden><circle cx="50" cy="50" r="40" fill="none" stroke="#72E6B0" strokeWidth="8" /><circle cx="50" cy="50" r="26" fill="none" stroke="#A99BFF" strokeWidth="2" strokeDasharray="3 5" /></svg>
          <h2 className="relative max-w-xl text-4xl font-extrabold leading-tight tracking-tight">Next month, you&rsquo;ll know exactly where it went.</h2>
          <p className="relative mt-3 max-w-md text-cream/70">Free for students. Set up in about a minute.</p>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <Button size="lg" variant="mint" onClick={start}>Start Tracking <ArrowRight className="h-5 w-5" /></Button>
            <a href="#/login" className="inline-flex h-12 items-center rounded-2xl px-6 font-semibold text-cream hover:bg-cream/10">I already have an account</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Why({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-t-2 border-fg pt-5">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 text-muted">{body}</p>
    </div>
  );
}

/** Live-looking preview of the dashboard used in the hero */
function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]" aria-label="Preview of the Campus Coin dashboard" role="img">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-mint/30 via-transparent to-lavender/30 blur-2xl" aria-hidden />
      <div className="grid grid-cols-5 gap-3">
        <div className="col-span-3 rounded-card bg-ink p-5 text-cream shadow-lift">
          <p className="text-xs font-semibold text-cream/60">Balance this month</p>
          <p className="money mt-2 text-[2.1rem] font-extrabold leading-none"><span className="mr-1 text-base opacity-60">Rs.</span>42,850</p>
          <div className="mt-4 flex gap-4 text-xs"><span className="text-mint">+ Rs. 65,000 in</span><span className="text-coral">− Rs. 22,150 out</span></div>
          <div className="mt-5 flex h-16 items-end gap-1.5">
            {[40, 62, 35, 80, 55, 30, 72, 48, 90, 38, 58, 44].map((h, i) => <span key={i} className="anim-grow-y flex-1 rounded-t-md bg-mint/80" style={{ height: `${h}%`, animationDelay: `${i * 35}ms` }} />)}
          </div>
        </div>
        <div className="col-span-2 flex flex-col justify-between rounded-card border border-line bg-surface p-4 shadow-soft">
          <p className="text-xs font-semibold text-muted">Top category</p>
          <div className="flex items-center gap-2"><CategoryIcon icon="food" color="#FF8B73" /><b className="text-lg">Food</b></div>
          <p className="money text-2xl font-extrabold">Rs. 7,200</p>
        </div>
        <div className="col-span-2 rounded-card border border-line bg-surface p-4 shadow-soft">
          <p className="mb-3 text-xs font-semibold text-muted">Budget check</p>
          <div className="space-y-3 text-xs">
            <div><div className="mb-1 flex justify-between"><b>Food</b><span>72%</span></div><ProgressBar value={72} max={100} size="sm" /></div>
            <div><div className="mb-1 flex justify-between"><b>Entertainment</b><span className="text-neg">105%</span></div><ProgressBar value={105} max={100} size="sm" /></div>
          </div>
        </div>
        <div className="col-span-3 rounded-card border border-lavender/50 bg-lavender-soft p-4 shadow-soft dark:bg-[#231f3d]">
          <p className="flex items-center gap-1.5 text-xs font-bold text-ai"><Sparkles className="h-3.5 w-3.5" /> Your month, explained</p>
          <p className="mt-2 text-sm font-bold leading-snug">Food delivery is up 40% on your usual month.</p>
          <p className="mt-1 text-xs text-muted">Try a weekly delivery limit of Rs. 1,000.</p>
        </div>
      </div>
      {/* hand-drawn note */}
      <div className="pointer-events-none absolute -bottom-12 left-2 hidden items-center gap-1 sm:flex" aria-hidden>
        <svg width="46" height="40" viewBox="0 0 46 40" className="text-fg"><path d="M4 36C10 20 22 10 40 6M40 6l-9-1M40 6l-3 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        <span className="-mb-6 rotate-[-4deg] text-sm font-semibold italic text-muted">that&rsquo;s a lot of biryani</span>
      </div>
    </div>
  );
}

function PhonePreview() {
  return (
    <div className="mx-auto w-[270px] rounded-[2.6rem] border-[10px] border-ink bg-canvas p-3 shadow-lift" role="img" aria-label="Campus Coin on a phone">
      <div className="mx-auto mb-3 h-5 w-24 rounded-full bg-ink" />
      <div className="rounded-3xl bg-ink p-4 text-cream">
        <p className="text-[0.65rem] text-cream/60">Balance this month</p>
        <p className="money text-2xl font-extrabold">Rs. 42,850</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[0.7rem] font-bold">
        <span className="rounded-xl bg-coral py-2 text-center text-ink">− Expense</span>
        <span className="rounded-xl bg-mint py-2 text-center text-ink">+ Income</span>
      </div>
      <div className="mt-3 space-y-2 rounded-2xl bg-surface p-3">
        <div className="flex justify-between text-[0.7rem]"><b>Transport</b><span>76%</span></div>
        <ProgressBar value={76} max={100} size="sm" />
      </div>
      <PreviewRow icon="food" color="#FF8B73" name="Campus Cafe" amount={850} />
      <PreviewRow icon="transport" color="#8FA8FF" name="Metro / Bus" amount={1200} />
      <PreviewRow icon="subscriptions" color="#A99BFF" name="Netflix" amount={499} />
      <div className="mt-3 flex items-center justify-around rounded-2xl bg-surface py-2">
        <span className="h-1.5 w-6 rounded-full bg-line" /><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-mint"><Plus className="h-5 w-5" /></span><span className="h-1.5 w-6 rounded-full bg-line" />
      </div>
    </div>
  );
}
function PreviewRow({ icon, color, name, amount }: { icon: IconKey; color: string; name: string; amount: number }) {
  return (
    <div className="mt-2 flex items-center gap-2 rounded-2xl bg-surface p-2">
      <CategoryIcon icon={icon} color={color} size="sm" />
      <span className="flex-1 text-[0.72rem] font-bold">{name}</span>
      <span className="money text-[0.72rem] font-bold">− {rs(amount)}</span>
    </div>
  );
}

/** Sitemap in the footer, as required by the SRS */
export function SiteFooter() {
  const col = (title: string, links: [string, string][]): ReactNode => (
    <div>
      <p className="text-sm font-bold">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-muted">{links.map(([l, h]) => <li key={h}><a href={`#${h}`} className="hover:text-fg">{l}</a></li>)}</ul>
    </div>
  );
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">Smart Spending. Student Style. A budget and expense tracker for college and university students.</p>
        </div>
        {col('Get started', [['Home', '/'], ['Create account', '/register'], ['Log in', '/login'], ['Forgot password', '/forgot-password']])}
        {col('Track', [['Dashboard', '/app'], ['Transactions', '/app/transactions'], ['Add expense', '/app/add-expense'], ['Add income', '/app/add-income'], ['Categories', '/app/categories'], ['Budgets', '/app/budgets']])}
        {col('Understand', [['Reports', '/app/reports'], ['AI Insights', '/app/insights'], ['Saving tips', '/app/tips'], ['Bookmarks', '/app/bookmarks'], ['Notifications', '/app/notifications'], ['Profile & settings', '/app/profile']])}
        {col('Admin', [['Admin login', '/admin/login'], ['Overview', '/admin'], ['Users', '/admin/users'], ['Categories', '/admin/categories'], ['Tips & announcements', '/admin/tips'], ['Statistics', '/admin/stats']])}
      </div>
      <p className="border-t border-line px-5 py-5 text-center text-xs text-muted">Sitemap above. Campus Coin doesn&rsquo;t connect to banks or process payments. AI suggestions are advisory, not financial advice.</p>
    </footer>
  );
}
