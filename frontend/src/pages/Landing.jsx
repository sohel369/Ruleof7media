import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight, Zap, Shield, Users, BarChart3, MapPin, TrendingUp,
  CheckCircle2, Play, Star, ArrowRight, Video, Award, Crown,
  Copy, Check, Link2, DollarSign
} from 'lucide-react';
import { GlobalFooter } from '../components/GlobalFooter';

export const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [copiedDemo, setCopiedDemo] = useState(false);

  // Capture ?ref= from URL and store in localStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlRef = params.get('ref') || params.get('partner') || params.get('referrer');
    if (urlRef) {
      localStorage.setItem('r7_referrer_id', urlRef);
      localStorage.setItem('affiliate', urlRef);
      fetch('/api/affiliates/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: urlRef })
      }).catch(() => {});
    }
  }, [location.search]);

  const handleCopyDemo = () => {
    navigator.clipboard.writeText('https://rule7media.com/funnel?ref=rapidwrap-sydney').then(() => {
      setCopiedDemo(true);
      setTimeout(() => setCopiedDemo(false), 2000);
    });
  };

  const benefits = [
    { icon: <Users className="w-6 h-6" />, color: 'neonCyan', title: 'Automatic Lead Qualification', desc: 'Our 7-video funnel silently profiles every lead that scans your wrap QR codes — scoring intent, budget, and fit without them knowing.' },
    { icon: <MapPin className="w-6 h-6" />, color: 'neonPink', title: 'Protected Territory Rights', desc: 'Lock your geographic area. Every hot lead within your radius routes exclusively to your dashboard — blocked from competing shops.' },
    { icon: <BarChart3 className="w-6 h-6" />, color: 'neonGreen', title: 'Real-Time CRM Dashboard', desc: 'Watch leads flow in live. See their score, company, budget, and fleet size — all captured invisibly as they watch educational videos.' },
    { icon: <Zap className="w-6 h-6" />, color: 'neonAmber', title: 'QR-to-CRM Attribution', desc: 'Bridge your physical wrap campaigns to digital tracking. Every QR scan is logged, attributed, and converted into a scored lead profile.' },
    { icon: <Shield className="w-6 h-6" />, color: 'neonRed', title: 'Invisible Profiling System', desc: "Customers think they're watching free business education. You get a full intelligence profile — industry, role, budget, and intent." },
    { icon: <TrendingUp className="w-6 h-6" />, color: 'neonCyan', title: 'Trusted Industry Sources', desc: 'Content endorsed by established trade publications builds customer trust — they engage willingly without any sales pressure.' }
  ];

  const plans = [
    { name: 'Starter', price: '$197', period: '/month', tag: 'Perfect to start', features: ['1 protected territory', 'Up to 50 leads/month', 'Full CRM dashboard', 'QR scan attribution', 'Email support'], cta: 'Get Started', highlight: false },
    { name: 'Growth', price: '$397', period: '/month', tag: 'Most popular', features: ['3 protected territories', 'Unlimited leads', 'Full CRM dashboard', 'Real-time webhook sync', 'Priority support', 'Co-branded funnels'], cta: 'Choose Growth', highlight: true },
    { name: 'Pro', price: '$697', period: '/month', tag: 'For fleets', features: ['Unlimited territories', 'Unlimited leads', 'White-label dashboard', 'Custom webhook integrations', 'Dedicated account manager', 'Trade magazine placements'], cta: 'Go Pro', highlight: false }
  ];

  const videoOffers = [
    { id: 'A', icon: <Video className="w-7 h-7" />, color: 'neonCyan', badge: 'Free', badgeBg: 'bg-neonCyan/10 text-neonCyan border-neonCyan/20', title: 'Free Video Series', subtitle: 'With Rule7 Watermark', price: 'Free', priceNote: 'Always free', description: 'Access all 7 training videos branded with the Rule7Media watermark. Perfect for getting started and understanding our system.', features: ['All 7 educational videos', 'Rule7Media branding included', 'Lead capture form included', 'Basic quiz & progress tracking', 'Thank you page on completion'], cta: 'Start Watching Free', ctaAction: () => navigate('/funnel'), highlight: false },
    { id: 'B', icon: <Award className="w-7 h-7" />, color: 'neonRed', badge: 'Popular', badgeBg: 'bg-neonRed/10 text-neonRed border-neonRed/20', title: 'Unbranded Video Series', subtitle: 'Your Brand, Our System', price: '$97', priceNote: '/month', description: 'The same powerful 7-video funnel, completely stripped of Rule7 branding. Your logo, your colours, your lead capture.', features: ['All 7 videos — no watermark', 'Your brand logo & colours', 'Custom domain support', 'White-label lead dashboard', 'Priority email support'], cta: 'Get Unbranded', ctaAction: () => navigate('/pricing'), highlight: true },
    { id: 'C', icon: <Crown className="w-7 h-7" />, color: 'neonGreen', badge: 'Premium', badgeBg: 'bg-neonGreen/10 text-neonGreen border-neonGreen/20', title: 'Custom Video Series', subtitle: 'Tailored to Your Market', price: '$297', priceNote: '/month', description: 'We produce custom video scripts and overlays tailored to your city, industry, and customer base. The ultimate competitive weapon.', features: ['Custom scripted video content', 'Your city / market featured', 'Branded intro & outro', 'Territory exclusivity lock', 'Dedicated account manager', 'Trade publication placements'], cta: 'Go Custom', ctaAction: () => navigate('/pricing'), highlight: false }
  ];

  // Full system flow steps
  const flowSteps = [
    { icon: '🏪', label: 'Affiliate', sub: 'Wrapping shop registers', color: 'neonCyan' },
    { icon: '🔗', label: 'Referral Link', sub: 'Gets unique ?ref= URL', color: 'neonCyan' },
    { icon: '📱', label: 'Customer Scans', sub: 'QR on wrapped vehicle', color: 'neonAmber' },
    { icon: '🎥', label: 'Video 1–7', sub: 'Watches education series', color: 'neonAmber' },
    { icon: '🧠', label: 'Lead Qualified', sub: 'Score 0–100 computed', color: 'neonRed' },
    { icon: '📊', label: 'Dashboard', sub: 'Lead routed to affiliate', color: 'neonGreen' },
    { icon: '💰', label: 'Commission', sub: '5–15% earned per close', color: 'neonGreen' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-darkBg text-white">

      {/* Navigation — SINGLE nav, no duplicate */}
      <nav className="fixed top-0 w-full z-50 py-4 px-6 flex justify-between items-center bg-darkBg/90 backdrop-blur-md border-b border-slate-900">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-neonRed flex items-center justify-center font-black text-white shadow-lg text-lg glow-pink">R</div>
          <span className="font-grotesk font-extrabold text-xl tracking-tight">Rule7<span className="text-neonRed">Media</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/partner')} className="text-xs font-semibold text-neonCyan hover:text-white px-3 py-2 transition-colors border border-neonCyan/20 rounded-lg hover:bg-neonCyan/10">
            Partner Portal
          </button>
          <button onClick={() => navigate('/funnel')} className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            Advertiser Portal
          </button>
          <button onClick={() => navigate('/register')} className="text-xs font-semibold text-neonCyan hover:text-white px-3 py-2 transition-colors border border-neonCyan/20 rounded-lg hover:bg-neonCyan/10">
            Join ReferrQ
          </button>
          <button onClick={() => navigate('/admin/login')} className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 transition-colors">
            Dashboard Login
          </button>
          <button onClick={() => navigate('/register')} className="text-xs font-bold bg-neonRed hover:bg-neonRed/90 text-white px-4 py-2 rounded-lg transition-all shadow-lg glow-pink">
            Verify Territory
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-neonRed/8 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-neonCyan/6 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center animate-slide-in">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neonCyan px-4 py-1.5 bg-neonCyan/10 rounded-full border border-neonCyan/20 mb-6">
            <Star className="w-3.5 h-3.5 fill-neonCyan" />
            <span>For Vehicle Wrapping Business Owners</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-grotesk font-black leading-tight mb-6">
            Turn Every Wrapped Vehicle<br />
            Into a <span className="text-neonRed">Lead Generation Machine</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Rule7Media gives your wrapping business a secret weapon: an invisible lead qualification system that profiles and scores every potential customer — automatically — helping build local authority and trust.
          </p>

          {/* ── REFERRAL LINK DEMO ── */}
          <div className="max-w-md mx-auto mb-10 p-4 bg-slate-950/80 rounded-2xl border border-neonCyan/20 shadow-xl text-left">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-neonGreen animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-neonCyan">Your Referral Link</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-900 rounded-lg px-3 py-2.5 font-mono text-xs text-neonCyan border border-slate-800 truncate">
                rule7media.com/funnel?ref=<span className="text-white font-bold">rapidwrap-sydney</span>
              </div>
              <button
                onClick={handleCopyDemo}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                  copiedDemo
                    ? 'bg-neonGreen/20 text-neonGreen border border-neonGreen/30'
                    : 'bg-neonCyan/10 text-neonCyan border border-neonCyan/30 hover:bg-neonCyan/20'
                }`}
              >
                {copiedDemo ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDemo ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Every customer who clicks this link is tracked to your account — automatically.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => navigate('/register')} className="px-8 py-4 bg-neonRed hover:bg-neonRed/90 text-white font-bold rounded-xl transition-all shadow-xl glow-pink flex items-center gap-2 text-sm">
              <span>Verify Territory Eligibility</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/funnel')} className="px-8 py-4 bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold rounded-xl transition-all text-sm flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span>Watch Free Onboarding Series</span>
            </button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-neonGreen" />Free Value-First Education</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-neonGreen" />Establish Community Trust</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-neonGreen" />Territory Protected Lock</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-neonGreen" />Real-Time Lead Attribution</span>
          </div>
        </div>
      </section>

      {/* ── FLOW DIAGRAM ── */}
      <section className="py-16 px-6 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-neonRed px-3 py-1 bg-neonRed/10 rounded-full border border-neonRed/20">How The System Works</span>
            <h2 className="text-2xl font-grotesk font-black text-white mt-4">Full Flow — 5 Seconds to Understand</h2>
            <p className="text-sm text-slate-500 mt-2">From wrap vehicle to qualified lead to commission — fully automated.</p>
          </div>

          {/* Flow steps horizontal */}
          <div className="flex flex-wrap items-start justify-center gap-0">
            {flowSteps.map((step, idx) => (
              <div key={idx} className="flex items-center">
                <div className="flex flex-col items-center w-28 text-center group">
                  <div className={`w-14 h-14 rounded-2xl bg-${step.color}/15 border border-${step.color}/30 flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold text-white mb-0.5">{step.label}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{step.sub}</div>
                </div>
                {idx < flowSteps.length - 1 && (
                  <div className="flex flex-col items-center mb-8 mx-1">
                    <div className="w-6 h-px bg-gradient-to-r from-slate-700 to-slate-600"></div>
                    <ChevronRight className="w-4 h-4 text-slate-700 -mt-2" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: vertical flow */}
          <div className="flex flex-col items-center mt-8 md:hidden space-y-3">
            {flowSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`px-5 py-2.5 rounded-xl bg-${step.color}/10 border border-${step.color}/20 text-xs font-bold text-white flex items-center gap-2`}>
                  <span>{step.icon}</span>
                  <span>{step.label}</span>
                </div>
                {idx < flowSteps.length - 1 && <div className="text-slate-700 text-lg leading-none">↓</div>}
              </div>
            ))}
          </div>

          {/* CTA under diagram */}
          <div className="text-center mt-10">
            <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 px-7 py-3.5 bg-neonCyan/10 hover:bg-neonCyan/20 text-neonCyan border border-neonCyan/30 font-bold text-sm rounded-xl transition-all">
              <Link2 className="w-4 h-4" />
              <span>Become an Affiliate</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── VIDEO SERIES OFFERS A/B/C ── */}
      <section className="py-20 px-6 border-t border-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-neonCyan px-3 py-1 bg-neonCyan/10 rounded-full border border-neonCyan/20">Video Series Options</span>
            <h2 className="text-3xl font-grotesk font-black text-white mt-4">Choose Your Video Package</h2>
            <p className="text-sm text-slate-400 mt-3 max-w-xl mx-auto">
              Whether you're testing the waters or ready to dominate your market — pick the funnel that fits your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {videoOffers.map((offer) => (
              <div key={offer.id} className={`glass-card rounded-2xl p-7 relative flex flex-col transition-all duration-300 hover:translate-y-[-4px] ${offer.highlight ? 'border-neonRed/40 bg-neonRed/5 shadow-2xl scale-105 z-10' : 'hover:border-slate-700'}`}>
                {offer.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-neonRed text-white px-4 py-1.5 rounded-full shadow-xl">
                    <Star className="w-3 h-3 fill-white" /><span>Most Popular</span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-5">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${offer.badgeBg}`}>Option {offer.id} — {offer.badge}</span>
                  <div className={`w-10 h-10 rounded-xl bg-${offer.color}/15 text-${offer.color} flex items-center justify-center border border-${offer.color}/20`}>{offer.icon}</div>
                </div>
                <h3 className="text-lg font-grotesk font-black text-white mb-1">{offer.title}</h3>
                <p className={`text-xs font-semibold text-${offer.color} mb-3`}>{offer.subtitle}</p>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-3xl font-black font-grotesk text-white">{offer.price}</span>
                  {offer.priceNote === 'Always free' ? (
                    <span className="text-neonGreen text-xs mb-1 font-semibold">{offer.priceNote}</span>
                  ) : (
                    <span className="text-slate-500 text-sm mb-1">{offer.priceNote}</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-5 leading-relaxed">{offer.description}</p>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {offer.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className={`w-3.5 h-3.5 text-${offer.color} flex-shrink-0 mt-0.5`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={offer.ctaAction} className={`w-full py-3.5 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${offer.highlight ? 'bg-neonRed hover:bg-neonRed/90 text-white shadow-lg glow-pink' : offer.id === 'A' ? 'bg-neonCyan/10 hover:bg-neonCyan/20 text-neonCyan border border-neonCyan/30' : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200'}`}>
                  <span>{offer.cta}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (Steps) ── */}
      <section className="py-20 px-6 border-t border-slate-900 bg-slate-950/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-neonRed px-3 py-1 bg-neonRed/10 rounded-full border border-neonRed/20">The Strategy</span>
            <h2 className="text-3xl font-grotesk font-black text-white mt-4">How Rule7Media Works</h2>
            <p className="text-sm text-slate-400 mt-3 max-w-xl mx-auto">Our approach is based on one core principle: <em>"Customers purchase when they're ready, not when we want to sell."</em> We build trust first — then convert.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neonRed/30 via-neonCyan/20 to-transparent -translate-x-1/2"></div>
            <div className="space-y-8">
              {[
                { step: '01', title: 'You Wrap. We Track.', desc: 'Place QR codes on your wrapped vehicles. Each scan is instantly logged with location data and attributed to your territory.', side: 'left', color: 'neonRed' },
                { step: '02', title: 'They Watch. We Profile.', desc: 'Scanners enter a 7-video educational series. At each step, we invisibly collect budget, role, industry, and intent data.', side: 'right', color: 'neonCyan' },
                { step: '03', title: 'Lead Scored. Territory Locked.', desc: 'When a viewer finishes the series, our engine produces a 0-100 lead score. Hot leads (71+) are automatically routed to your exclusive dashboard.', side: 'left', color: 'neonGreen' },
                { step: '04', title: 'You Close. No Competition.', desc: 'You receive a fully profiled, qualified lead. Their company, fleet size, budget, and goals — all captured. No other local wrap shop can steal them.', side: 'right', color: 'neonAmber' }
              ].map((item, idx) => (
                <div key={idx} className={`flex items-center gap-8 ${item.side === 'right' ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-1 glass-card p-6 rounded-2xl">
                    <div className={`text-xs font-black uppercase tracking-widest text-${item.color} mb-2`}>Step {item.step}</div>
                    <h3 className="text-lg font-grotesk font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                  <div className={`hidden md:flex w-12 h-12 rounded-full bg-${item.color}/20 border border-${item.color}/30 items-center justify-center font-black text-${item.color} text-sm flex-shrink-0 z-10`}>{item.step}</div>
                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS GRID ── */}
      <section className="py-20 px-6 border-t border-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-neonCyan px-3 py-1 bg-neonCyan/10 rounded-full border border-neonCyan/20">Platform Features</span>
            <h2 className="text-3xl font-grotesk font-black text-white mt-4">Everything You Get</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl group hover:border-slate-700 transition-all duration-300">
                <div className={`w-11 h-11 bg-${b.color}/15 text-${b.color} rounded-xl flex items-center justify-center border border-${b.color}/20 mb-4 group-hover:scale-110 transition-transform duration-300`}>{b.icon}</div>
                <h3 className="font-grotesk font-bold text-base text-white mb-2">{b.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ── */}
      <section className="py-20 px-6 border-t border-slate-900 bg-slate-950/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-neonRed px-3 py-1 bg-neonRed/10 rounded-full border border-neonRed/20">Subscription Plans</span>
            <h2 className="text-3xl font-grotesk font-black text-white mt-4">Simple, Transparent Pricing</h2>
            <p className="text-sm text-slate-400 mt-3">Choose the plan that matches your territory ambitions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, idx) => (
              <div key={idx} className={`glass-card p-7 rounded-2xl relative ${plan.highlight ? 'border-neonRed/40 bg-neonRed/5 shadow-xl' : ''}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest bg-neonRed text-white px-3 py-1 rounded-full shadow-lg">{plan.tag}</div>
                )}
                <div className="mb-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{plan.name}</div>
                  <div className="flex items-end gap-1"><span className="text-4xl font-black font-grotesk text-white">{plan.price}</span><span className="text-slate-500 text-sm mb-1">{plan.period}</span></div>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neonGreen flex-shrink-0 mt-0.5" /><span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/pricing')} className={`w-full py-3 font-bold text-xs rounded-lg transition-all ${plan.highlight ? 'bg-neonRed hover:bg-neonRed/90 text-white glow-pink shadow-lg' : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-6 border-t border-slate-900">
        <div className="max-w-3xl mx-auto glass-card rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neonRed/8 rounded-full filter blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-neonCyan/5 rounded-full filter blur-2xl pointer-events-none"></div>
          <div className="relative">
            <span className="text-xs font-bold uppercase tracking-widest text-neonRed px-3 py-1 bg-neonRed/10 rounded-full border border-neonRed/20">Limited Territories Available</span>
            <h2 className="text-3xl font-grotesk font-black text-white mt-4 mb-3">Ready to Own Your Local Market?</h2>
            <p className="text-sm text-slate-400 mb-8 max-w-xl mx-auto">
              Territory slots are filling fast. Once your local area is claimed by another shop, it's locked — permanently. Secure yours today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate('/pricing')} className="inline-flex items-center gap-2 px-8 py-4 bg-neonRed hover:bg-neonRed/90 text-white font-bold rounded-xl transition-all shadow-xl glow-pink text-sm">
                <span>Claim Your Territory Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 px-8 py-4 bg-neonCyan/10 hover:bg-neonCyan/20 text-neonCyan border border-neonCyan/30 font-bold rounded-xl transition-all text-sm">
                <DollarSign className="w-4 h-4" />
                <span>Become an Affiliate</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
};
