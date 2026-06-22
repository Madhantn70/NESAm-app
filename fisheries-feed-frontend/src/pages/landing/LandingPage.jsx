import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Fish, BarChart3, Package, Droplets, Bell, FileText,
  TrendingUp, ChevronRight, Shield, Zap, Star,
  ArrowRight, Check, Activity, Database, Users
} from 'lucide-react';

// ─── Animated Counter Hook ───────────────────────────────────────────────────
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ─── Intersection Observer Hook ──────────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ value, suffix = '', label, inView }) {
  const count = useCounter(value, 2000, inView);
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-black text-white mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-cyan-300 text-sm font-medium uppercase tracking-widest">{label}</div>
    </div>
  );
}

// ─── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, gradient }) {
  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 backdrop-blur-sm">
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4 shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-300 transition-colors">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function LandingPage() {
  const { token, loading } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [statsRef, statsInView] = useInView(0.3);

  useEffect(() => {
    if (!loading && token) navigate('/dashboard', { replace: true });
  }, [token, loading, navigate]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const features = [
    { icon: Package,    title: 'Feed Inventory',      description: 'Track all feed types, batch numbers, and stock quantities in real-time with automated low-stock alerts.',          gradient: 'from-blue-500 to-cyan-500' },
    { icon: Droplets,   title: 'Tank Monitoring',     description: 'Monitor individual tank consumption, water parameters, and feeding schedules from a single unified dashboard.',     gradient: 'from-teal-500 to-emerald-500' },
    { icon: TrendingUp, title: 'Stock Analytics',     description: 'Visualise feed consumption trends, predict restocking needs, and reduce wastage with intelligent analytics.',       gradient: 'from-violet-500 to-purple-500' },
    { icon: BarChart3,  title: 'Reports & Exports',   description: 'Generate detailed PDF reports on inventory, consumption, and stock movements — filterable by date and type.',      gradient: 'from-orange-500 to-amber-500' },
    { icon: Bell,       title: 'Smart Alerts',        description: 'Get notified when stock levels drop below threshold, feeding is overdue, or anomalies are detected.',              gradient: 'from-rose-500 to-pink-500' },
    { icon: Shield,     title: 'Audit Trail',         description: 'Every action is logged with user, timestamp, and change details — ensuring full accountability across your team.',  gradient: 'from-indigo-500 to-blue-500' },
  ];

  const mockStats = [
    { label: 'Active Tanks', value: '24', icon: Database, color: 'text-cyan-400' },
    { label: 'Feed Types',   value: '12', icon: Package,  color: 'text-emerald-400' },
    { label: 'Today Entries',value: '38', icon: Activity, color: 'text-violet-400' },
    { label: 'Staff Users',  value: '6',  icon: Users,    color: 'text-amber-400' },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0f1e]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600">
                <Fish className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">
                AquaFeed
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors px-3 py-1.5">
                Sign In
              </Link>
              <Link to="/signup" className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -right-40 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 text-cyan-400 text-sm font-medium">
            <Zap className="w-3.5 h-3.5" />
            Smart Fisheries Management · Built for Scale
          </div>

          {/* Title */}
          <div>
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none">
              <span className="bg-gradient-to-br from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Aqua
              </span>
              <span className="bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Feed
              </span>
            </h1>
            <p className="mt-3 text-xl sm:text-2xl font-semibold text-slate-300">
              Smart Fisheries Feed Management Platform
            </p>
          </div>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg leading-relaxed">
            Manage feed inventory, monitor tank consumption, track stock levels, and generate analytics from a single platform. Built for modern aquaculture operations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="group flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 w-full sm:w-auto justify-center"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-2 bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/30 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 w-full sm:w-auto justify-center"
            >
              Create Account
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
            {['Real-time Sync', 'Role-based Access', 'PDF Reports', 'Audit Logs'].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-slate-400 text-sm">
                <Check className="w-4 h-4 text-cyan-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-1.5 text-violet-400 text-sm font-medium mb-4">
              <Star className="w-3.5 h-3.5" />
              Everything You Need
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Powerful Features for{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Modern Fisheries
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              From feed tracking to analytics — AquaFeed covers every aspect of fisheries feed management.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Your Command{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Centre
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Get an instant overview of your entire fisheries operation from one beautiful dashboard.
            </p>
          </div>

          {/* Mock Dashboard */}
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-cyan-900/30">
            {/* Window bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-white/5">
              <div className="w-3 h-3 rounded-full bg-rose-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <div className="ml-4 text-xs text-slate-500 font-mono">AquaFeed · Dashboard</div>
            </div>

            <div className="p-6 sm:p-8">
              {/* Top stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {mockStats.map((stat) => (
                  <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/8 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +12% this week
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-white">Feed Consumption — Last 7 Days</span>
                    <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-lg">kg / day</span>
                  </div>
                  <div className="flex items-end gap-2 h-28">
                    {[55, 72, 61, 88, 74, 92, 79].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-400 opacity-80 hover:opacity-100 transition-opacity"
                          style={{ height: `${h}%` }}
                        />
                        <span className="text-xs text-slate-500">{['M','T','W','T','F','S','S'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-sm font-semibold text-white mb-4">Stock Levels</div>
                  {[
                    { name: 'Pellet A',  pct: 82, color: 'bg-cyan-500' },
                    { name: 'Pellet B',  pct: 45, color: 'bg-amber-500' },
                    { name: 'Flake Mix', pct: 68, color: 'bg-emerald-500' },
                    { name: 'Shrimp',   pct: 23, color: 'bg-rose-500' },
                  ].map((s) => (
                    <div key={s.name} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">{s.name}</span>
                        <span className="text-slate-400">{s.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATISTICS ── */}
      <section ref={statsRef} className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-cyan-600/20 via-teal-600/10 to-blue-600/20 border border-cyan-500/20 p-12 backdrop-blur-sm">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Trusted by Fisheries Operations
              </h2>
              <p className="text-slate-400 mt-3">Real numbers from real aquaculture teams</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard value={500}  suffix="+"  label="Tanks Managed"   inView={statsInView} />
              <StatCard value={99}   suffix="%"  label="Uptime"          inView={statsInView} />
              <StatCard value={1200} suffix="+"  label="Feed Logs / Day" inView={statsInView} />
              <StatCard value={50}   suffix="+"  label="Active Users"    inView={statsInView} />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-teal-600 to-blue-700" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="relative px-8 py-16 sm:py-20">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                Ready to Modernise Your Feed Management?
              </h2>
              <p className="text-cyan-100 text-lg mb-10 max-w-2xl mx-auto">
                Join fisheries teams who use AquaFeed to reduce waste, save time, and gain full visibility into their operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="group flex items-center justify-center gap-2 bg-white text-cyan-700 font-black px-8 py-4 rounded-2xl hover:bg-cyan-50 transition-all duration-200 shadow-2xl hover:scale-105"
                >
                  Start Free Today
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-200"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600">
              <Fish className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white">AquaFeed</span>
            <span className="text-slate-500 text-sm ml-2">· Smart Fisheries Feed Management</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link to="/login"  className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            <span className="text-slate-600">© {new Date().getFullYear()} AquaFeed</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
