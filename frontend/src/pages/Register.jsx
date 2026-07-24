import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CheckCircle2, ChevronRight, AlertCircle, Link2, Copy, Check,
  MapPin, Globe, Mail, User, Building2, Shield, Zap, Crown, Star, Flame
} from 'lucide-react';
import { GlobalFooter } from '../components/GlobalFooter';

// Tier configuration
const TIERS = {
  standard: {
    id: 'standard',
    name: 'Standard Programme',
    emoji: '🤝',
    color: 'neonCyan',
    badgeColor: 'bg-neonCyan/10 text-neonCyan border-neonCyan/20',
    btnColor: 'bg-neonCyan hover:bg-neonCyan/90 text-darkBg',
    commission: '5%',
    perks: ['Manual approval (24hr review)', 'Business verification required', 'Higher trust & protected territories', 'Basic analytics dashboard'],
    description: 'Manual approval, business verification, and higher trust. Ideal for single-location wrapping shops.'
  },
  elite: {
    id: 'elite',
    name: 'Elite Partner',
    emoji: '👑',
    color: 'neonRed',
    badgeColor: 'bg-neonRed/10 text-neonRed border-neonRed/20',
    btnColor: 'bg-neonRed hover:bg-neonRed/90 text-white glow-pink',
    commission: '22%',
    perks: ['Priority territory lock', '22% flat commission rate', 'Co-branded funnel pages', 'Webhook CRM sync', 'Dedicated account manager'],
    description: 'For established media partners and fleet publishers seeking premium 22% commissions.'
  },
  quick: {
    id: 'quick',
    name: 'Instant Signup',
    emoji: '⚡',
    color: 'neonGreen',
    badgeColor: 'bg-neonGreen/10 text-neonGreen border-neonGreen/20',
    btnColor: 'bg-neonGreen hover:bg-neonGreen/90 text-darkBg',
    commission: '5%',
    perks: ['Instant code generation', 'Start immediately tracking leads', 'Upgrade to territory later', 'Self-serve dashboard'],
    description: 'Instant code, start immediately, and upgrade later. Ready in 60 seconds with 3 fields.'
  }
};

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Detect pre-selected tier from URL: /register?tier=elite
  const params = new URLSearchParams(location.search);
  const urlTier = params.get('tier');
  const initialTier = TIERS[urlTier] ? urlTier : null;

  const [selectedTier, setSelectedTier] = useState(initialTier);

  const [form, setForm] = useState({
    name: '',
    business: '',
    website: '',
    territory: '',
    email: '',
    referralCode: '',
    country: '',
    audienceSize: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedTraining, setCopiedTraining] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedBanner, setCopiedBanner] = useState(false);
  const [copiedGif, setCopiedGif] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Quick tier only needs name + email
    const isQuick = selectedTier === 'quick';
    if (!form.name || !form.email) {
      setError('Please fill in at least your name and email.');
      setLoading(false);
      return;
    }
    if (!isQuick && !form.business) {
      setError('Please fill in your Business Name.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/affiliates/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          company: form.business || form.name,
          email: form.email,
          website: form.website || '',
          territory: form.territory || 'Global',
          tier: selectedTier === 'elite' ? 'Elite' : 'Starter',
          referredBy: form.referralCode || null,
          country: form.country || 'Global',
          audienceSize: form.audienceSize || '< 1,000'
        })
      });
      const data = await res.json();
      const code = data.affiliate?.code || form.business.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || form.name.toLowerCase().replace(/\s+/g, '-');
      const link = `${window.location.origin}/landing.html?ref=${code}`;
      setGeneratedCode(code);
      setReferralLink(link);
      localStorage.setItem('r7_partner_code', code);
      localStorage.setItem('r7_partner_name', form.business || form.name);
      localStorage.setItem('r7_partner_tier', selectedTier);
      setSuccess(true);
    } catch (err) {
      // Offline fallback
      const code = (form.business || form.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const link = `${window.location.origin}/landing.html?ref=${code}`;
      setGeneratedCode(code);
      setReferralLink(link);
      localStorage.setItem('r7_partner_code', code);
      localStorage.setItem('r7_partner_name', form.business || form.name);
      localStorage.setItem('r7_partner_tier', selectedTier);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const tier = selectedTier ? TIERS[selectedTier] : null;

  return (
    <div className="min-h-screen flex flex-col bg-darkBg text-white">

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 py-4 px-6 flex justify-between items-center bg-darkBg/90 backdrop-blur-md border-b border-slate-900">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-neonRed flex items-center justify-center font-black text-white shadow-lg glow-pink">R</div>
          <span className="font-grotesk font-bold text-xl tracking-tight">Rule7<span className="text-neonRed">Media</span></span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {selectedTier && (
            <button onClick={() => setSelectedTier(null)} className="text-slate-400 hover:text-white transition-colors">
              ← Change Tier
            </button>
          )}
          <button onClick={() => navigate('/admin/login')} className="text-slate-400 hover:text-white transition-colors">Partner Login</button>
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white transition-colors">Home</button>
        </div>
      </nav>

      <div className="flex-1 pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">

          {!success ? (
            <>
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neonCyan px-4 py-1.5 bg-neonCyan/10 rounded-full border border-neonCyan/20 mb-5">
                  <Link2 className="w-3.5 h-3.5" />
                  <span>ReferrQ Affiliate Network</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-grotesk font-black text-white mb-3">
                  {tier ? `${tier.emoji} ${tier.name}` : 'Join ReferrQ'}
                </h1>
                <p className="text-sm text-slate-400 max-w-lg mx-auto">
                  {tier ? tier.description : 'Choose your partnership tier and get your unique referral link in minutes.'}
                </p>
              </div>

              {/* STEP 1 — Tier Selection */}
              {!selectedTier && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                  {Object.values(TIERS).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTier(t.id)}
                      className={`glass-card rounded-2xl p-7 text-left transition-all duration-300 hover:translate-y-[-4px] hover:border-slate-600 group ${
                        t.id === 'elite' ? 'border-neonRed/30 bg-neonRed/3 shadow-xl' : ''
                      }`}
                    >
                      {t.id === 'elite' && (
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neonRed mb-4">
                          <Star className="w-3 h-3 fill-neonRed" /> Recommended
                        </div>
                      )}
                      <div className="text-3xl mb-3">{t.emoji}</div>
                      <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border inline-block mb-3 ${t.badgeColor}`}>
                        {t.name}
                      </div>
                      <div className={`text-2xl font-black font-grotesk text-${t.color} mb-1`}>{t.commission}</div>
                      <div className="text-[10px] text-slate-500 mb-4">commission rate</div>
                      <ul className="space-y-2 mb-6">
                        {t.perks.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                            <CheckCircle2 className={`w-3 h-3 text-${t.color} flex-shrink-0 mt-0.5`} />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                      <div className={`w-full py-3 font-bold text-xs rounded-xl text-center transition-all ${t.btnColor}`}>
                        Choose {t.name} →
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 2 — Registration Form */}
              {selectedTier && (
                <div className="max-w-xl mx-auto">
                  {/* Selected tier badge */}
                  <div className={`flex items-center gap-3 p-4 rounded-xl border mb-6 ${tier.badgeColor}`}>
                    <span className="text-2xl">{tier.emoji}</span>
                    <div>
                      <div className={`text-xs font-black uppercase tracking-wider`}>{tier.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{tier.commission} commission · {tier.perks[0]}</div>
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-7 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-48 h-48 bg-${tier.color}/4 rounded-full filter blur-3xl pointer-events-none`}></div>

                    <h2 className="text-base font-grotesk font-bold text-white mb-5 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      {selectedTier === 'quick' ? 'Quick Signup — 3 fields' : 'Create Your Account'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                      <div className={`grid gap-4 ${selectedTier === 'quick' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                            <User className="w-3 h-3 inline mr-1" />Full Name <span className="text-neonRed">*</span>
                          </label>
                          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. John Smith"
                            className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs" />
                        </div>

                        {selectedTier !== 'quick' && (
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                              <Building2 className="w-3 h-3 inline mr-1" />Business Name <span className="text-neonRed">*</span>
                            </label>
                            <input type="text" name="business" value={form.business} onChange={handleChange} placeholder="e.g. Rapid Wrap Sydney"
                              className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs" />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                          <Mail className="w-3 h-3 inline mr-1" />Email <span className="text-neonRed">*</span>
                        </label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@rapidwrapsydney.com"
                          className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                            Country <span className="text-neonRed">*</span>
                          </label>
                          <input type="text" name="country" value={form.country} onChange={handleChange} placeholder="e.g. Germany" required
                            className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                            Audience Size <span className="text-neonRed">*</span>
                          </label>
                          <select name="audienceSize" value={form.audienceSize} onChange={handleChange} required
                            className="w-full glass-input rounded-lg p-3 text-slate-100 bg-slate-900 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs select-none">
                            <option value="">Select audience size</option>
                            <option value="< 1,000">Less than 1,000</option>
                            <option value="1,000 - 10,000">1,000 to 10,000</option>
                            <option value="10,000 - 50,000">10,000 to 50,000</option>
                            <option value="50,000+">50,000+</option>
                          </select>
                        </div>
                      </div>

                      {selectedTier !== 'quick' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                                <Globe className="w-3 h-3 inline mr-1" />Website
                              </label>
                              <input type="url" name="website" value={form.website} onChange={handleChange} placeholder="https://yoursite.com"
                                className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                                <MapPin className="w-3 h-3 inline mr-1" />Territory / City
                                {selectedTier === 'elite' && <span className="text-neonRed"> *</span>}
                              </label>
                              <input type="text" name="territory" value={form.territory} onChange={handleChange} placeholder="e.g. Sydney, NSW"
                                className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                              <Link2 className="w-3 h-3 inline mr-1" />Referral Code (Optional)
                            </label>
                            <input type="text" name="referralCode" value={form.referralCode} onChange={handleChange} placeholder="Who referred you?"
                              className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs" />
                          </div>
                        </>
                      )}

                      {error && (
                        <div className="flex items-center gap-2 text-xs bg-neonRed/10 text-neonRed p-3 rounded-lg border border-neonRed/20">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <button type="submit" disabled={loading}
                        className={`w-full p-4 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 mt-2 ${tier.btnColor}`}>
                        {loading ? <span>Creating Account...</span> : <>
                          <span>{selectedTier === 'quick' ? '⚡ Get My Link Now' : `Create ${tier.name} Account`}</span>
                          <ChevronRight className="w-4 h-4" />
                        </>}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* SUCCESS STATE */
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden animate-slide-in max-w-2xl mx-auto space-y-6">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-neonGreen/8 rounded-full filter blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-neonCyan/5 rounded-full filter blur-2xl pointer-events-none"></div>

              <div className="w-16 h-16 bg-neonGreen/20 text-neonGreen rounded-full flex items-center justify-center mx-auto mb-2 border border-neonGreen/30 shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="text-xs font-black uppercase tracking-widest text-neonGreen px-3 py-1 bg-neonGreen/10 rounded-full border border-neonGreen/20">
                {tier ? `${tier.emoji} ${tier.name} Active` : 'Welcome to ReferrQ'}
              </span>

              <h2 className="text-2xl font-grotesk font-black text-white mt-2">You're In!</h2>
              <p className="text-sm text-slate-400">Share your referral parameters and download creatives below to start earning.</p>

              {/* Commission & Code stats card grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {/* Affiliate Code Card */}
                <div className="glass-card p-4 bg-slate-900/40 border-slate-800/60">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Affiliate Code</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-bold text-neonCyan">{generatedCode}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCode);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }} 
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 font-semibold transition-all"
                    >
                      {copiedCode ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Commission Rate Card */}
                <div className="glass-card p-4 bg-slate-900/40 border-slate-800/60">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Your Commission</span>
                  <div className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>{tier?.commission || '5%'} CPA Recurring</span>
                    <span className="text-[9px] bg-neonGreen/10 text-neonGreen px-1.5 py-0.5 rounded border border-neonGreen/20">Active</span>
                  </div>
                </div>

                {/* Referral Link Card */}
                <div className="glass-card p-4 bg-slate-900/40 border-slate-800/60">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Total Payouts</span>
                  <div className="text-sm font-extrabold text-white font-mono flex items-center gap-1.5">
                    <span>$0.00 Paid</span>
                    <span className="w-2 h-2 rounded-full bg-neonGreen animate-pulse"></span>
                  </div>
                </div>
              </div>

              {/* Primary Referral Link copy section */}
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-left space-y-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-neonCyan mb-2 flex items-center gap-1">
                    <Link2 className="w-3 h-3" /> Landing Page Referral Link
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 font-mono flex-1 truncate">{window.location.origin}/landing.html?ref={generatedCode}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/landing.html?ref=${generatedCode}`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                        copied ? 'bg-neonGreen/20 text-neonGreen border border-neonGreen/30' : 'bg-neonCyan/10 text-neonCyan border border-neonCyan/30 hover:bg-neonCyan/20'
                      }`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-neonPurple mb-2 flex items-center gap-1">
                    <Link2 className="w-3 h-3 text-neonPurple" /> Training Video 1 Referral Link
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 font-mono flex-1 truncate">{window.location.origin}/training/video-1.html?ref={generatedCode}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/training/video-1.html?ref=${generatedCode}`);
                        setCopiedTraining(true);
                        setTimeout(() => setCopiedTraining(false), 2000);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                        copiedTraining ? 'bg-neonGreen/20 text-neonGreen border border-neonGreen/30' : 'bg-neonPurple/10 text-neonPurple border border-neonPurple/30 hover:bg-neonPurple/20'
                      }`}
                    >
                      {copiedTraining ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTraining ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-neonPink mb-2 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-neonPink" /> Print/Magazine Short Link
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 font-mono flex-1 truncate">{window.location.origin + '/r/' + generatedCode}</span>
                    <button onClick={() => {
                      navigator.clipboard.writeText(window.location.origin + '/r/' + generatedCode);
                      alert('Short Link copied to clipboard!');
                    }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-neonPink/10 hover:bg-neonPink/20 text-neonPink border border-neonPink/30 rounded-lg text-xs font-bold transition-all flex-shrink-0">
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Short Link</span>
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-500 mt-1.5">🚀 Ideal for Newspapers, Trade Journals, and Printed ads to avoid long complex URLs.</p>
                </div>
              </div>

              {/* How to Promote Section */}
              <div className="p-5 glass-card border-slate-850 bg-slate-950/20 text-left space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-neonCyan" /> How to Promote
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] text-slate-400 leading-relaxed">
                  <div>
                    <span className="font-bold text-slate-300 block mb-0.5">1. Place Banners</span>
                    <span>Embed the web banner widgets on your blog, portal, or website headers to capture incoming organic traffic.</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-300 block mb-0.5">2. Share Funnel link</span>
                    <span>Distribute your direct Video 1 training links via social networks, emails, and direct B2B chats.</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-300 block mb-0.5">3. Print Custom QRs</span>
                    <span>Print your dynamic referral QR codes on flyers, vehicle wraps, or business brochures to log scans.</span>
                  </div>
                </div>
              </div>

              {/* Download Assets Section */}
              <div className="border-t border-slate-800 pt-6 text-left space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-neonGreen" /> Download Marketing Assets
                </h3>
                <p className="text-xs text-slate-500">Deploy these dynamic creatives embedded with your unique tracking attributes to route B2B leads.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Banner Creative */}
                  <div className="glass-card p-4 border-slate-800 bg-slate-900/30 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-white">Web Banner (728x90)</span>
                        <span className="text-[9px] bg-slate-850 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">HTML</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-3">Leaderboard banner layout loaded with your referral parameters.</p>
                    </div>
                    <button 
                      onClick={() => {
                        const embed = `<a href="${referralLink}" target="_blank"><img src="${window.location.origin}/assets/banner_leaderboard.png" alt="Rule 7 Media Web Ad Funnel" /></a>`;
                        navigator.clipboard.writeText(embed);
                        setCopiedBanner(true);
                        setTimeout(() => setCopiedBanner(false), 2000);
                      }}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all"
                    >
                      {copiedBanner ? 'Copied HTML!' : 'Copy Embed Code'}
                    </button>
                  </div>

                  {/* Animated GIF Creative */}
                  <div className="glass-card p-4 border-slate-800 bg-slate-900/30 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-white">Animated GIF Loop</span>
                        <span className="text-[9px] bg-slate-850 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">GIF</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-3">Dynamic verified lead acquisition loop representing local CRM syncing.</p>
                    </div>
                    <button 
                      onClick={() => {
                        const embed = `<a href="${referralLink}" target="_blank"><img src="${window.location.origin}/assets/animated_marketing_loop.gif" alt="Verified Vehicle Leads Feed" /></a>`;
                        navigator.clipboard.writeText(embed);
                        setCopiedGif(true);
                        setTimeout(() => setCopiedGif(false), 2000);
                      }}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all"
                    >
                      {copiedGif ? 'Copied Embed!' : 'Copy GIF Embed'}
                    </button>
                  </div>

                  {/* Email Template Pitch */}
                  <div className="glass-card p-4 border-slate-800 bg-slate-900/30 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-white">B2B Email Template</span>
                        <span className="text-[9px] bg-slate-850 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">TXT</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-3">Pre-written email outreach pitch to local businesses seeking ad alternatives.</p>
                    </div>
                    <button 
                      onClick={() => {
                        const email = `Subject: Uncapped B2B Transit Ad Revenue streams (No upfront setup fees)\n\nHi,\n\nI wanted to share a quick transit-ad B2B qualify pipeline platform designed specifically to secure local geographic routing and drive qualified dealership / fleet leads.\n\nYou can review our live 7-video verification funnel dashboard directly using my partner code link here:\n${referralLink}\n\nLet me know if you would like a custom setup.\n\nBest Regards,\nPartner Account Admin`;
                        navigator.clipboard.writeText(email);
                        setCopiedEmail(true);
                        setTimeout(() => setCopiedEmail(false), 2000);
                      }}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all"
                    >
                      {copiedEmail ? 'Copied Pitch!' : 'Copy Email Copy'}
                    </button>
                  </div>

                  {/* Custom QR Code */}
                  <div className="glass-card p-4 border-slate-800 bg-slate-900/30 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-white">Custom QR Code</span>
                        <span className="text-[9px] bg-slate-850 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">SVG</span>
                      </div>
                      <p class="text-[11px] text-slate-500 mb-3">Custom SVG QR Code linking directly to your qualified funnel URL.</p>
                    </div>
                    <button 
                      onClick={() => {
                        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="300" height="300"><rect width="100" height="100" fill="white"/><rect x="10" y="10" width="20" height="20" fill="black"/><rect x="14" y="14" width="12" height="12" fill="white"/><rect x="16" y="16" width="8" height="8" fill="black"/><rect x="70" y="10" width="20" height="20" fill="black"/><rect x="74" y="14" width="12" height="12" fill="white"/><rect x="76" y="16" width="8" height="8" fill="black"/><rect x="10" y="70" width="20" height="20" fill="black"/><rect x="14" y="74" width="12" height="12" fill="white"/><rect x="16" y="76" width="8" height="8" fill="black"/><rect x="40" y="40" width="20" height="20" fill="black"/><rect x="44" y="44" width="12" height="12" fill="white"/><rect x="46" y="46" width="8" height="8" fill="black"/><rect x="75" y="75" width="15" height="15" fill="black"/><rect x="78" y="78" width="9" height="9" fill="white"/><text x="50" y="95" font-size="6" font-family="monospace" text-anchor="middle" fill="black">REF:${generatedCode}</text></svg>`;
                        const blob = new Blob([svgString], { type: 'image/svg+xml' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `referq-qr-${generatedCode}.svg`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="w-full py-2 bg-neonGreen/10 hover:bg-neonGreen/20 text-neonGreen border border-neonGreen/30 rounded-lg text-xs font-bold transition-all"
                    >
                      Download QR SVG
                    </button>
                  </div>

                  {/* Social Images Kit Link */}
                  <div className="glass-card p-4 border-slate-800 bg-slate-900/30 flex flex-col justify-between col-span-1 md:col-span-2">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-white">Social Images Creative Kit</span>
                        <span className="text-[9px] bg-slate-850 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">PNG</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-3">Download full size post graphics for feeds (Instagram, LinkedIn and Facebook posts).</p>
                    </div>
                    <button 
                      onClick={() => navigate('/affiliate/dashboard')}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all"
                    >
                      Go to Dashboard & View Social Kit
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation links footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
                <button 
                  onClick={() => window.open(`${window.location.origin}/r/${generatedCode}`, '_blank')}
                  className="flex-1 py-3.5 bg-neonRed hover:bg-neonRed/90 text-white font-bold text-xs rounded-xl transition-all shadow-lg glow-pink flex items-center justify-center gap-1.5"
                >
                  <span>Test My Referral Funnel</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => navigate('/affiliate/dashboard')}
                  className="flex-1 py-3.5 bg-neonCyan/10 hover:bg-neonCyan/20 text-neonCyan border border-neonCyan/30 font-bold text-xs rounded-xl transition-all">
                  Go to Affiliate Dashboard
                </button>
                <button onClick={() => { setSuccess(false); setSelectedTier(null); setForm({ name:'', business:'', website:'', territory:'', email:'', referralCode:'' }); }}
                  className="py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 font-bold text-xs rounded-xl transition-all">
                  Register Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
};
