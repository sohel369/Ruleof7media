import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { Link2, Users, DollarSign, Award, MapPin, BarChart3, ShieldCheck, CheckCircle2, QrCode, Clipboard, Star, ChevronRight, Zap, LogOut, Lock } from 'lucide-react';
import { GlobalFooter } from '../components/GlobalFooter';

export const Affiliate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scanEvents } = useSocket();

  // Active Affiliate login states
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('r7_affiliate_logged_in') === 'true');
  const [activePartnerCode, setActivePartnerCode] = useState(() => localStorage.getItem('r7_affiliate_code') || 'rapidwrap-sydney');
  const [affiliates, setAffiliates] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [partnerLeads, setPartnerLeads] = useState([]);
  const [leadTypeFilter, setLeadTypeFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);
  const [loginError, setLoginError] = useState('');

  // Calculate Product Commissions
  const rule7Commission = partnerLeads
    .filter(l => l.subscriptionType === 'Rule7 Subscription')
    .reduce((sum, l) => sum + (l.commissionAmount || 0), 0);
  const scanThemAllCommission = partnerLeads
    .filter(l => l.subscriptionType === 'ScanThemAll Subscription')
    .reduce((sum, l) => sum + (l.commissionAmount || 0), 0);
  const wrapShopCommission = partnerLeads
    .filter(l => l.subscriptionType === 'Wrap Shop Subscription')
    .reduce((sum, l) => sum + (l.commissionAmount || 0), 0);
  
  // Application Form State
  const [applyForm, setApplyForm] = useState({
    name: '',
    company: '',
    email: '',
    website: '',
    territory: ''
  });
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  // QR Simulator State
  const [simulateSuccess, setSimulateSuccess] = useState(false);
  const [simulating, setSimulating] = useState(false);

  // Fetch all affiliates
  const fetchAffiliates = () => {
    fetch('/api/affiliates')
      .then(res => res.json())
      .then(data => {
        setAffiliates(data);
        const active = data.find(a => a.code === activePartnerCode);
        if (active) setActivePartner(active);
      })
      .catch(err => console.error('Error fetching affiliates:', err));
  };

  useEffect(() => {
    fetchAffiliates();
    if (activePartnerCode) {
      fetch(`/api/leads?refId=${activePartnerCode}`)
        .then(res => res.json())
        .then(data => setPartnerLeads(data))
        .catch(err => console.error('Error fetching partner leads:', err));
    }
  }, [activePartnerCode]);

  // Handle Partner Switch
  const handlePartnerChange = (e) => {
    setActivePartnerCode(e.target.value);
  };

  // Submit Affiliate Application
  const handleApply = async (e) => {
    e.preventDefault();
    setApplyError('');
    setApplySuccess(false);

    if (!applyForm.name || !applyForm.company || !applyForm.email) {
      setApplyError('Please fill in Name, Company, and Email.');
      return;
    }

    try {
      const res = await fetch('/api/affiliates/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applyForm)
      });
      const data = await res.json();
      if (data.success) {
        setApplySuccess(true);
        setApplyForm({ name: '', company: '', email: '', website: '', territory: '' });
        fetchAffiliates();
      } else {
        setApplyError(data.error || 'Failed to submit application.');
      }
    } catch (err) {
      setApplyError('Network error. Failed to apply.');
    }
  };

  // Simulate QR wrap scan
  const handleSimulateScan = async () => {
    if (!activePartner) return;
    setSimulating(true);
    setSimulateSuccess(false);

    try {
      const res = await fetch('/api/leads/simulate-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: activePartner.code })
      });
      const data = await res.json();
      if (data.success) {
        setSimulateSuccess(true);
        // Refresh partner metrics
        fetchAffiliates();
        setTimeout(() => setSimulateSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error simulating scan:', err);
    } finally {
      setSimulating(false);
    }
  };

  // Copy referral link to clipboard
  const [copiedLink, setCopiedLink] = useState(false);
  const copyLink = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Determine Sub-view by pathname
  const path = location.pathname;
  const isApply = path === '/affiliate/apply';
  const isLogin = path === '/affiliate/login';
  const isDashboard = path === '/affiliate/dashboard';
  const isLinks = path === '/affiliate/links';
  const isEarnings = path === '/affiliate/earnings';
  const isAssets = path === '/affiliate/assets';
  const isHub = path === '/affiliate';

  const handleLogout = () => {
    localStorage.removeItem('r7_affiliate_logged_in');
    localStorage.removeItem('r7_affiliate_code');
    setIsLoggedIn(false);
    navigate('/affiliate/login');
  };

  const handleAffiliateLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const code = document.getElementById('affiliateCodeInput').value.trim().toLowerCase();
    if (!code) {
      setLoginError('Please enter an affiliate code.');
      return;
    }

    fetch(`/api/affiliates/${code}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          localStorage.setItem('r7_affiliate_logged_in', 'true');
          localStorage.setItem('r7_affiliate_code', data.code);
          setActivePartnerCode(data.code);
          setIsLoggedIn(true);
          navigate('/affiliate/dashboard');
        } else {
          setLoginError('Affiliate code not found. Please verify and try again.');
        }
      })
      .catch(() => {
        // Offline fallback for demo
        localStorage.setItem('r7_affiliate_logged_in', 'true');
        localStorage.setItem('r7_affiliate_code', code);
        setActivePartnerCode(code);
        setIsLoggedIn(true);
        navigate('/affiliate/dashboard');
      });
  };

  // Route protection guard
  useEffect(() => {
    const isProtected = isDashboard || isLinks || isEarnings || isAssets;
    if (isProtected && !isLoggedIn) {
      navigate('/affiliate/login');
    }
  }, [path, isLoggedIn, navigate]);

  // Calculate conversion rates
  const conversionRate = activePartner && activePartner.clicks > 0
    ? ((activePartner.conversions / activePartner.clicks) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="glass-card border-x-0 border-t-0 fixed top-0 w-full z-50 py-4 px-6 flex justify-between items-center bg-darkBg/95 backdrop-blur-md">
        <div className="flex items-center gap-2" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-neonRed flex items-center justify-center font-bold text-white cursor-pointer">R</div>
          <span className="font-grotesk font-bold text-lg cursor-pointer">Rule7<span className="text-neonRed">Media</span></span>
        </div>
        <div className="flex items-center gap-2 md:gap-4 text-xs font-semibold">
          <button onClick={() => navigate('/affiliate')} className={`px-3 py-1.5 rounded-lg ${isHub ? 'bg-neonCyan/10 text-neonCyan' : 'text-slate-400 hover:text-white'}`}>Affiliate Hub</button>
          <button onClick={() => navigate('/affiliate/dashboard')} className={`px-3 py-1.5 rounded-lg ${isDashboard ? 'bg-neonCyan/10 text-neonCyan' : 'text-slate-400 hover:text-white'}`}>Dashboard</button>
          <button onClick={() => navigate('/affiliate/links')} className={`px-3 py-1.5 rounded-lg ${isLinks ? 'bg-neonCyan/10 text-neonCyan' : 'text-slate-400 hover:text-white'}`}>Referral Links</button>
          <button onClick={() => navigate('/affiliate/earnings')} className={`px-3 py-1.5 rounded-lg ${isEarnings ? 'bg-neonCyan/10 text-neonCyan' : 'text-slate-400 hover:text-white'}`}>Earnings & Tiers</button>
          <button onClick={() => navigate('/affiliate/assets')} className={`px-3 py-1.5 rounded-lg ${isAssets ? 'bg-neonCyan/10 text-neonCyan' : 'text-slate-400 hover:text-white'}`}>Assets Kit</button>
          {isLoggedIn && (
            <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-neonRed flex items-center gap-1.5 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pt-24 pb-16">
        
        {/* Affiliate Selector Dropdown (for testing and dashboard swaps) */}
        {!isHub && !isApply && !isLogin && (
          <div className="mb-6 glass-card p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-neonAmber" />
              <div className="text-xs">
                <span className="text-slate-400">Testing Mode: </span>
                <strong className="text-white">Swap Active Wrap Partner to preview dynamic metrics & attribution</strong>
              </div>
            </div>
            <select
              value={activePartnerCode}
              onChange={handlePartnerChange}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg p-2 focus:ring-1 focus:ring-neonCyan outline-none"
            >
              {affiliates.map(a => (
                <option key={a.code} value={a.code}>{a.company} ({a.name})</option>
              ))}
            </select>
          </div>
        )}

        {/* ─── VIEW 1: HUB LANDING ─── */}
        {isHub && (
          <div className="space-y-12 animate-slide-in">
            <div className="text-center max-w-2xl mx-auto py-12">
              <span className="text-xs font-bold uppercase tracking-widest text-neonCyan px-3 py-1 bg-neonCyan/10 rounded-full border border-neonCyan/20">Partnership Program</span>
              <h1 className="text-3xl md:text-4xl font-grotesk font-black text-white mt-4 leading-tight">Monetize Your Local Presence with Rule7Media</h1>
              <p className="text-sm text-slate-400 mt-3 max-w-lg mx-auto">Are you a vehicle wrapping shop, billboard owner, or local advertising agency? Route leads, generate recurring commission, and protect your territory rights.</p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="glass-card p-6 rounded-xl space-y-4 border border-neonCyan/25 bg-neonCyan/2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-neonCyan px-2 py-0.5 bg-neonCyan/10 border border-neonCyan/25 rounded-full">Standard Tier</span>
                    <h3 className="font-grotesk font-black text-lg text-white mt-2">Join Programme</h3>
                    <p className="text-xs text-slate-400 mt-2">5% commission. Ideal for single location wrap shops looking for geographic territory protection and manual verification.</p>
                  </div>
                  <button onClick={() => navigate('/register?tier=standard')} className="w-full mt-4 py-2.5 bg-neonCyan text-darkBg font-bold text-xs rounded-lg transition-all hover:bg-neonCyan/90">
                    Join Programme
                  </button>
                </div>

                <div className="glass-card p-6 rounded-xl space-y-4 border border-neonRed/25 bg-neonRed/2 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-neonRed/5 rounded-full filter blur-xl"></div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-neonRed px-2 py-0.5 bg-neonRed/10 border border-neonRed/25 rounded-full">👑 Elite Partner</span>
                    <h3 className="font-grotesk font-black text-xl text-white mt-2">Join Elite</h3>
                    <p className="text-xs text-slate-400 mt-2">22% commission. Best for premium fleet publishers. Lock priority territory rights, custom co-branding, and webhook syncing.</p>
                  </div>
                  <button onClick={() => navigate('/register?tier=elite')} className="w-full mt-4 py-2.5 bg-neonRed text-white font-bold text-xs rounded-lg transition-all hover:bg-neonRed/90 glow-pink">
                    Join Elite
                  </button>
                </div>

                <div className="glass-card p-6 rounded-xl space-y-4 border border-neonGreen/25 bg-neonGreen/2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-neonGreen px-2 py-0.5 bg-neonGreen/10 border border-neonGreen/25 rounded-full">⚡ Instant Setup</span>
                    <h3 className="font-grotesk font-black text-xl text-white mt-2">Instant Signup</h3>
                    <p className="text-xs text-slate-400 mt-2">5% commission. Get your custom referral tracking link generated immediately in 60 seconds with no approval wait.</p>
                  </div>
                  <button onClick={() => navigate('/register?tier=quick')} className="w-full mt-4 py-2.5 bg-neonGreen text-darkBg font-bold text-xs rounded-lg transition-all hover:bg-neonGreen/90">
                    Instant Signup
                  </button>
                </div>
              </div>

              {/* Login for existing affiliates */}
              <div className="max-w-md mx-auto glass-card p-6 rounded-2xl border-slate-800 bg-slate-905/30 text-center space-y-4 mt-8">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Access Your Affiliate Dashboard</h3>
                <p className="text-xs text-slate-400">Already have an affiliate code? Enter it below to access your dynamic lead analytics and earnings pipeline.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="loginCodeInput"
                    placeholder="e.g. rapidwrap-sydney"
                    className="flex-1 glass-input rounded-lg px-3 py-2 text-xs font-mono text-white bg-slate-950/80 border border-slate-800"
                  />
                  <button
                    onClick={() => {
                      const code = document.getElementById('loginCodeInput').value.trim();
                      if (!code) {
                        alert('Please enter your affiliate code.');
                        return;
                      }
                      fetch(`/api/affiliates/${code.toLowerCase()}`)
                      .then(res => res.json())
                      .then(data => {
                        if (data && !data.error) {
                          localStorage.setItem('r7_affiliate_logged_in', 'true');
                          localStorage.setItem('r7_affiliate_code', data.code);
                          setActivePartnerCode(data.code);
                          setIsLoggedIn(true);
                          navigate('/affiliate/dashboard');
                        } else {
                          alert('Affiliate code not found.');
                        }
                      })
                      .catch(err => {
                        // Offline/demo fallback
                        localStorage.setItem('r7_affiliate_logged_in', 'true');
                        localStorage.setItem('r7_affiliate_code', code);
                        setActivePartnerCode(code);
                        setIsLoggedIn(true);
                        navigate('/affiliate/dashboard');
                      });
                    }}
                    className="px-4 bg-neonCyan text-darkBg hover:bg-neonCyan/90 rounded-lg text-xs font-bold transition-all"
                  >
                    Enter Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Program pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl space-y-3">
                <div className="w-10 h-10 bg-neonCyan/15 text-neonCyan rounded-lg flex items-center justify-center border border-neonCyan/20"><Clipboard className="w-5 h-5" /></div>
                <h3 className="font-grotesk font-bold text-base text-white">Progressive Tracking</h3>
                <p className="text-xs text-slate-400">Attribute B2B leads step-by-step as they progress through our high-converting 7-video verification funnel.</p>
              </div>
              <div className="glass-card p-6 rounded-xl space-y-3">
                <div className="w-10 h-10 bg-neonPink/15 text-neonPink rounded-lg flex items-center justify-center border border-neonPink/20"><MapPin className="w-5 h-5" /></div>
                <h3 className="font-grotesk font-bold text-base text-white">Territory Protection</h3>
                <p className="text-xs text-slate-400">Lock down geographic rights. Leads captured within your radius are routed directly to your shop CRM.</p>
              </div>
              <div className="glass-card p-6 rounded-xl space-y-3">
                <div className="w-10 h-10 bg-neonGreen/15 text-neonGreen rounded-lg flex items-center justify-center border border-neonGreen/20"><DollarSign className="w-5 h-5" /></div>
                <h3 className="font-grotesk font-bold text-base text-white">Tiered Commissions</h3>
                <p className="text-xs text-slate-400">Scale payouts from Starter (5%) to Growth (10%) up to Pro (15%) as your referral conversion volume grows.</p>
              </div>
            </div>
          </div>
        )}

        {/* ─── VIEW: AFFILIATE LOGIN ─── */}
        {isLogin && (
          <div className="flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full glass-card rounded-2xl p-8 relative overflow-hidden animate-slide-in shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-neonRed/5 rounded-full filter blur-3xl pointer-events-none"></div>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-neonRed/20 text-neonRed flex items-center justify-center mx-auto mb-4 border border-neonRed/30">
                  <Lock className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-grotesk font-bold text-white">Affiliate CRM Portal</h1>
                <p className="text-xs text-slate-400 mt-1">Enter your affiliate referral code to access stats.</p>
              </div>

              <form onSubmit={handleAffiliateLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Affiliate Code</label>
                  <input 
                    type="text" 
                    id="affiliateCodeInput"
                    placeholder="e.g. rapidwrap-sydney"
                    className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs bg-slate-950/80 border border-slate-800"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1.5">Enter your unique affiliate identifier to log in.</span>
                </div>

                {loginError && <div className="text-xs text-neonRed bg-neonRed/10 p-2 rounded-lg border border-neonRed/20">{loginError}</div>}

                <button 
                  type="submit"
                  className="w-full p-3 rounded-lg font-bold text-xs text-white bg-neonRed hover:bg-neonRed/90 transition-all shadow-lg glow-pink"
                >
                  Access My Affiliate Dashboard
                </button>

                <div className="border-t border-slate-900 pt-4 mt-6 text-center text-[10px] text-slate-500 space-y-1">
                  <p>New to partnership program? <button type="button" onClick={() => navigate('/register')} className="text-neonCyan hover:underline">Apply Here</button></p>
                  <p>Vehicle Wrap Shop? <button type="button" onClick={() => navigate('/partner/login')} className="text-neonCyan hover:underline">Partner CRM Login</button></p>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── VIEW 2: APPLY FORM ─── */}
        {isApply && (
          <div className="max-w-lg mx-auto glass-card rounded-2xl p-8 relative animate-slide-in">
            <h2 className="text-xl font-grotesk font-bold text-white mb-2">Apply for Territory Protection</h2>
            <p className="text-xs text-slate-400 mb-6">Complete the registration form to obtain your referral code, lock in your exclusive territory rights, and start earning.</p>

            {applySuccess ? (
              <div className="p-6 bg-neonGreen/10 border border-neonGreen/20 rounded-xl text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-neonGreen mx-auto" />
                <h3 className="font-bold text-white">Application Received!</h3>
                <p className="text-xs text-slate-400">We have registered your application. Your referral link is being generated — complete your ReferrQ profile to get started.</p>
                <button 
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 bg-neonCyan text-darkBg rounded-lg font-bold text-xs transition-all mt-2"
                >
                  Complete ReferrQ Registration
                </button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Contact Name</label>
                  <input 
                    type="text" 
                    value={applyForm.name} 
                    onChange={e => setApplyForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Kevin Fletcher" 
                    required
                    className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Wrapping Shop / Company</label>
                  <input 
                    type="text" 
                    value={applyForm.company} 
                    onChange={e => setApplyForm(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g. RapidWrap Sydney" 
                    required
                    className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Business Email</label>
                  <input 
                    type="email" 
                    value={applyForm.email} 
                    onChange={e => setApplyForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. kevin@rapidwrapsydney.com.au" 
                    required
                    className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Website</label>
                  <input 
                    type="url" 
                    value={applyForm.website} 
                    onChange={e => setApplyForm(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="e.g. https://rapidwrapsydney.com.au" 
                    className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Desired Territory (e.g. City & Radius)</label>
                  <input 
                    type="text" 
                    value={applyForm.territory} 
                    onChange={e => setApplyForm(prev => ({ ...prev, territory: e.target.value }))}
                    placeholder="e.g. Sydney CBD 30 Mile Radius" 
                    className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                  />
                </div>

                {applyError && <div className="text-xs text-neonRed">{applyError}</div>}

                <button 
                  type="submit"
                  className="w-full p-3.5 bg-neonCyan text-darkBg hover:bg-neonCyan/90 font-bold text-xs rounded-lg transition-all shadow-lg glow-cyan flex items-center justify-center gap-2"
                >
                  <span>Submit Application</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <p className="text-center text-[10px] text-slate-500 mt-2">
                  Or <button type="button" onClick={() => navigate('/register')} className="text-neonCyan hover:underline">register directly via ReferrQ</button> to get your link instantly.
                </p>
              </form>
            )}
          </div>
        )}

        {/* ─── VIEW 3: PARTNER DASHBOARD ─── */}
        {isDashboard && activePartner && (
          <div className="space-y-6 animate-slide-in">
            {/* Summary statistics grid */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="glass-card p-4 rounded-xl relative overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Total Clicks</span>
                  <span className="text-xl font-extrabold text-white font-grotesk">{activePartner.clicks}</span>
                  <Link2 className="w-8 h-8 text-neonCyan/5 absolute -right-2 -bottom-2" />
                </div>
                <div className="glass-card p-4 rounded-xl relative overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">B2B Leads</span>
                  <span className="text-xl font-extrabold text-neonCyan font-grotesk">{partnerLeads.filter(l => l.leadType === 'B2B').length}</span>
                  <Users className="w-8 h-8 text-neonCyan/5 absolute -right-2 -bottom-2" />
                </div>
                <div className="glass-card p-4 rounded-xl relative overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">B2C Leads</span>
                  <span className="text-xl font-extrabold text-neonPurple font-grotesk">{partnerLeads.filter(l => l.leadType === 'B2C').length}</span>
                  <Users className="w-8 h-8 text-neonPurple/5 absolute -right-2 -bottom-2" />
                </div>
                <div className="glass-card p-4 rounded-xl relative overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Videos Completed</span>
                  <span className="text-xl font-extrabold text-neonGreen font-grotesk">{partnerLeads.filter(l => l.status === 'Completed').length}</span>
                  <CheckCircle2 className="w-8 h-8 text-neonGreen/5 absolute -right-2 -bottom-2" />
                </div>
                <div className="glass-card p-4 rounded-xl relative overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Subscriptions</span>
                  <span className="text-xl font-extrabold text-white font-grotesk">{activePartner.assignedLeadsCount}</span>
                  <Award className="w-8 h-8 text-slate-500/5 absolute -right-2 -bottom-2" />
                </div>
                <div className="glass-card p-4 rounded-xl relative overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Active Tier</span>
                  <span className="text-xl font-extrabold text-neonCyan font-grotesk">{activePartner.tier}</span>
                  <Award className="w-8 h-8 text-neonAmber/5 absolute -right-2 -bottom-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="glass-card p-4 rounded-xl bg-neonGreen/5 border-neonGreen/20 relative overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neonGreen block mb-1">Total Commission</span>
                  <span className="text-xl font-extrabold text-white font-grotesk">${(activePartner.earnings || 0).toFixed(2)}</span>
                  <DollarSign className="w-8 h-8 text-neonGreen/5 absolute -right-2 -bottom-2" />
                </div>
                <div className="glass-card p-4 rounded-xl relative overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Pending</span>
                  <span className="text-xl font-extrabold text-slate-300 font-grotesk">${(activePartner.pendingCommission || 0).toFixed(2)}</span>
                  <DollarSign className="w-8 h-8 text-slate-500/5 absolute -right-2 -bottom-2" />
                </div>
                <div className="glass-card p-4 rounded-xl relative overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Paid</span>
                  <span className="text-xl font-extrabold text-slate-300 font-grotesk">${(activePartner.paidCommission || 0).toFixed(2)}</span>
                  <DollarSign className="w-8 h-8 text-slate-500/5 absolute -right-2 -bottom-2" />
                </div>
                <div className="glass-card p-4 rounded-xl relative overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Recurring</span>
                  <span className="text-xl font-extrabold text-neonCyan font-grotesk">${(activePartner.recurringCommission || 0).toFixed(2)}</span>
                  <DollarSign className="w-8 h-8 text-neonCyan/5 absolute -right-2 -bottom-2" />
                </div>
                <div className="glass-card p-4 rounded-xl relative overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">One Time</span>
                  <span className="text-xl font-extrabold text-neonPurple font-grotesk">${(activePartner.oneTimeCommission || 0).toFixed(2)}</span>
                  <DollarSign className="w-8 h-8 text-neonPurple/5 absolute -right-2 -bottom-2" />
                </div>
              </div>
            </div>

            {/* Conversion Funnel Analytics Visualizer */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-800 pb-2">
                Conversion Funnel Analytics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                {/* Click Rate */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neonCyan block mb-1">Step 1: Clicks</span>
                    <span className="text-2xl font-black text-white">{activePartner.clicks}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-neonCyan h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-2 block">100% Funnel Entry Rate</span>
                </div>

                {/* Started Rate */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neonPurple block mb-1">Step 2: Started</span>
                    <span className="text-2xl font-black text-white">
                      {Math.max(partnerLeads.length, activePartner.clicks > 0 ? Math.round(activePartner.clicks * 0.75) : 0)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-neonPurple h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-2 block">75% Conversion Intent</span>
                </div>

                {/* Completed Funnel */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neonAmber block mb-1">Step 3: Completed</span>
                    <span className="text-2xl font-black text-white">
                      {partnerLeads.filter(l => l.status === 'Completed').length || (partnerLeads.length === 0 ? 1 : 0)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-neonAmber h-full rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-2 block">50% Videos Finished</span>
                </div>

                {/* Qualified Leads */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neonRed block mb-1">Step 4: Qualified</span>
                    <span className="text-2xl font-black text-white">
                      {partnerLeads.filter(l => l.score >= 70).length || (partnerLeads.length === 0 ? 1 : 0)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-neonRed h-full rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-2 block">35% Scored (70+ score)</span>
                </div>

                {/* Commission Conversion */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neonGreen block mb-1">Step 5: Converted</span>
                    <span className="text-2xl font-black text-white">
                      {partnerLeads.filter(l => l.status === 'Completed').length || (partnerLeads.length === 0 ? 1 : 0)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-neonGreen h-full rounded-full" style={{ width: '20%' }}></div>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-2 block">Stripe Contract Payout</span>
                </div>
              </div>
            </div>

            {/* Dashboard main layout: stats vs QR simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 cols: Partner info & details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-800 pb-2">
                    Territory Protection Contract
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                      <span className="text-slate-500 block">Registered Partner Code</span>
                      <strong className="text-white font-mono text-sm mt-1 block">{activePartner.code}</strong>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                      <span className="text-slate-500 block">Protected Territory Radius</span>
                      <strong className="text-white text-sm mt-1 block">{activePartner.territory || 'Sydney CBD 30mi'}</strong>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                      <span className="text-slate-500 block">Registered Agency Contact</span>
                      <strong className="text-white text-sm mt-1 block">{activePartner.name}</strong>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                      <span className="text-slate-500 block">Affiliate Tier commission Rate</span>
                      <strong className="text-neonCyan text-sm mt-1 block">
                        {activePartner.tier === 'Elite' ? '22%' : activePartner.tier === 'Pro' ? '15%' : activePartner.tier === 'Growth' ? '10%' : '5%'} commission
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Attributed Lead list */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                        Attributed Lead Pipelines
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Leads that scanned your wraps or clicked your referral link.</p>
                    </div>
                    {/* Segment Filter Toggle */}
                    <div className="flex bg-slate-950/80 rounded-lg p-0.5 border border-slate-900 self-stretch sm:self-auto">
                      {['All', 'B2B', 'B2C'].map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setLeadTypeFilter(filter)}
                          className={`flex-1 sm:flex-none px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                            leadTypeFilter === filter
                              ? 'bg-neonCyan text-darkBg shadow-md'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Lead list widget */}
                  <div className="bg-slate-950/40 rounded-xl border border-slate-900 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-950 border-b border-slate-900 text-[10px] font-bold text-slate-500 uppercase grid grid-cols-5">
                      <span>Lead Company</span>
                      <span>Segment</span>
                      <span>Progress State</span>
                      <span>Score</span>
                      <span className="text-right">Routing Status</span>
                    </div>
                    
                    {/* Simulated leads filtered by active partner (with fallbacks if empty) */}
                    <div className="divide-y divide-slate-900/60 max-h-60 overflow-y-auto">
                      {(partnerLeads.length > 0 ? partnerLeads : [
                        {
                          leadId: 'demo-lead-1',
                          company: 'ABC Plumbing & Heating',
                          status: 'Completed',
                          score: 82,
                          leadType: 'B2B',
                          createdAt: new Date().toISOString()
                        }
                      ])
                      .filter((l) => {
                        if (leadTypeFilter === 'All') return true;
                        return l.leadType === leadTypeFilter;
                      })
                      .map((lead) => (
                        <div 
                          key={lead.leadId} 
                          onClick={() => setSelectedLead(lead)}
                          className="px-4 py-3 text-xs grid grid-cols-5 items-center cursor-pointer hover:bg-slate-900/30 transition-all"
                        >
                          <span className="font-semibold text-white truncate pr-2">{lead.company || lead.name || 'Anonymous'}</span>
                          <span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider ${
                              lead.leadType === 'B2B' 
                                ? 'bg-neonCyan/10 text-neonCyan border border-neonCyan/20' 
                                : 'bg-neonPurple/10 text-neonPurple border border-neonPurple/20'
                            }`}>
                              {lead.leadType || 'B2C'}
                            </span>
                          </span>
                          <span className={lead.status === 'Completed' ? 'text-neonGreen' : 'text-neonAmber'}>
                            {lead.status}
                          </span>
                          <span className="font-mono">{lead.score}/100</span>
                          <span className={`text-right font-semibold ${lead.status === 'Completed' ? 'text-neonGreen' : 'text-slate-400'}`}>
                            {lead.status === 'Completed' ? 'Routed & Locked' : 'In Progress'}
                          </span>
                        </div>
                      ))}
                      {(partnerLeads.length > 0 ? partnerLeads : [
                        {
                          leadId: 'demo-lead-1',
                          company: 'ABC Plumbing & Heating',
                          status: 'Completed',
                          score: 82,
                          leadType: 'B2B',
                          createdAt: new Date().toISOString()
                        }
                      ]).filter((l) => {
                        if (leadTypeFilter === 'All') return true;
                        return l.leadType === leadTypeFilter;
                      }).length === 0 && (
                        <div className="px-4 py-8 text-center text-slate-600 text-xs">
                          No {leadTypeFilter === 'All' ? '' : leadTypeFilter} leads found in this pipeline.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Commission Breakout by Subscription Type */}
                <div className="glass-card rounded-2xl p-6 mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-800 pb-2">
                    Commission by Subscription Type
                  </h3>
                  <p className="text-[10px] text-slate-500 mb-4">Breakdown of commission payouts accrued across different client subscription packages.</p>
                  <div className="space-y-4">
                    {/* Rule7 Subscription */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-neonCyan"></span>
                          Rule7 Subscription
                        </span>
                        <span className="font-mono font-bold text-white">${rule7Commission.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-slate-950/60 h-2 rounded-full overflow-hidden border border-slate-900">
                        <div className="bg-neonCyan h-full rounded-full" style={{ width: `${(activePartner.earnings > 0 ? (rule7Commission / activePartner.earnings) * 100 : 0)}%` }}></div>
                      </div>
                    </div>

                    {/* ScanThemAll Subscription */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-neonPurple"></span>
                          ScanThemAll Subscription
                        </span>
                        <span className="font-mono font-bold text-white">${scanThemAllCommission.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-slate-950/60 h-2 rounded-full overflow-hidden border border-slate-900">
                        <div className="bg-neonPurple h-full rounded-full" style={{ width: `${(activePartner.earnings > 0 ? (scanThemAllCommission / activePartner.earnings) * 100 : 0)}%` }}></div>
                      </div>
                    </div>

                    {/* Wrap Shop Subscription */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-neonGreen"></span>
                          Wrap Shop Subscription
                        </span>
                        <span className="font-mono font-bold text-white">${wrapShopCommission.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-slate-950/60 h-2 rounded-full overflow-hidden border border-slate-900">
                        <div className="bg-neonGreen h-full rounded-full" style={{ width: `${(activePartner.earnings > 0 ? (wrapShopCommission / activePartner.earnings) * 100 : 0)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment History timeline list widget */}
                <div className="glass-card rounded-2xl p-6 mt-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-800 pb-2">
                    Payment History
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">Payout schedule for upfront lead bounties and recurring active wrap subscriptions.</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs p-3.5 bg-slate-950/40 rounded-lg border border-slate-900">
                      <div>
                        <span className="text-white font-semibold block">Upfront Lead Bounty (One-Time)</span>
                        <span className="text-[10px] text-slate-500 block">Status: Completed · Transferred to Wrapping shop bank</span>
                      </div>
                      <span className="font-extrabold text-neonGreen font-mono">+${(activePartner.oneTimeCommission || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-3.5 bg-slate-950/40 rounded-lg border border-slate-900">
                      <div>
                        <span className="text-white font-semibold block">Monthly Active Wrap Subscription (Recurring)</span>
                        <span className="text-[10px] text-slate-500 block">Status: Pending Verification (30-day lock active)</span>
                      </div>
                      <span className="font-extrabold text-neonCyan font-mono">+${(activePartner.recurringCommission || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Col: QR Wrap scan simulator */}
              <div className="space-y-6">
                {/* Quick Actions Card */}
                <div className="glass-card rounded-2xl p-6 border-neonCyan/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-neonCyan" />
                    <h3 className="font-grotesk font-bold text-white">Quick Actions</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    {/* Copy Referral Link */}
                    <button
                      type="button"
                      onClick={() => copyLink(`${window.location.protocol}//${window.location.host}/funnel?ref=${activePartner.code}`)}
                      className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 hover:text-white font-semibold transition-all flex flex-col items-center justify-center gap-1.5"
                    >
                      <Clipboard className="w-4 h-4 text-neonCyan" />
                      <span>Copy Funnel Link</span>
                    </button>

                    {/* Download QR */}
                    <button
                      type="button"
                      onClick={() => {
                        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="300" height="300"><rect width="100" height="100" fill="white"/><rect x="10" y="10" width="20" height="20" fill="black"/><rect x="14" y="14" width="12" height="12" fill="white"/><rect x="16" y="16" width="8" height="8" fill="black"/><rect x="70" y="10" width="20" height="20" fill="black"/><rect x="74" y="14" width="12" height="12" fill="white"/><rect x="76" y="16" width="8" height="8" fill="black"/><rect x="10" y="70" width="20" height="20" fill="black"/><rect x="14" y="74" width="12" height="12" fill="white"/><rect x="16" y="76" width="8" height="8" fill="black"/><rect x="40" y="40" width="20" height="20" fill="black"/><rect x="44" y="44" width="12" height="12" fill="white"/><rect x="46" y="46" width="8" height="8" fill="black"/><rect x="75" y="75" width="15" height="15" fill="black"/><rect x="78" y="78" width="9" height="9" fill="white"/><text x="50" y="93" font-size="5.5" font-family="monospace" text-anchor="middle" fill="black" font-weight="bold">r/${activePartner.code}</text></svg>`;
                        const blob = new Blob([svgString], { type: 'image/svg+xml' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `referq-qr-${activePartner.code}.svg`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 hover:text-white font-semibold transition-all flex flex-col items-center justify-center gap-1.5"
                    >
                      <QrCode className="w-4 h-4 text-neonGreen" />
                      <span>Download QR</span>
                    </button>

                    {/* Copy GIF Embed */}
                    <button
                      type="button"
                      onClick={() => {
                        const embed = `<a href="${window.location.origin}/funnel?ref=${activePartner.code}" target="_blank"><img src="${window.location.origin}/assets/animated_loop.gif" alt="CRM telemetry tracking" style="width:300px;height:250px;border:none;" /></a>`;
                        navigator.clipboard.writeText(embed);
                        alert('GIF Embed Code copied!');
                      }}
                      className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 hover:text-white font-semibold transition-all flex flex-col items-center justify-center gap-1.5"
                    >
                      <Star className="w-4 h-4 text-neonPink" />
                      <span>Copy GIF Embed</span>
                    </button>

                    {/* Test Referral Funnel */}
                    <button
                      type="button"
                      onClick={() => window.open(`${window.location.origin}/r/${activePartner.code}`, '_blank')}
                      className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 hover:text-white font-semibold transition-all flex flex-col items-center justify-center gap-1.5"
                    >
                      <ChevronRight className="w-4 h-4 text-neonRed" />
                      <span>Test Funnel</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/affiliate/assets')}
                    className="w-full mt-4 py-2 bg-neonCyan/10 hover:bg-neonCyan/20 text-neonCyan border border-neonCyan/30 rounded-lg font-bold text-[11px] transition-all text-center"
                  >
                    View Full Assets Kit →
                  </button>
                </div>

                <div className="glass-card rounded-2xl p-6 border-neonCyan/20">
                  <div className="flex items-center gap-2 mb-4">
                    <QrCode className="w-5 h-5 text-neonCyan" />
                    <h3 className="font-grotesk font-bold text-white">QR wrap Scan Simulator</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-6">Simulate a customer driving in {activePartner.company}'s protected territory scanning your vehicle wrap QR code.</p>
                  
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900/80 text-center space-y-4 mb-6">
                    <div className="w-28 h-28 bg-white p-2 rounded-lg mx-auto flex items-center justify-center shadow-lg">
                      {/* Simple Mock QR SVG */}
                      <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                        <rect x="0" y="0" width="25" height="25" fill="black" />
                        <rect x="5" y="5" width="15" height="15" fill="white" />
                        <rect x="8" y="8" width="9" height="9" fill="black" />

                        <rect x="75" y="0" width="25" height="25" fill="black" />
                        <rect x="80" y="5" width="15" height="15" fill="white" />
                        <rect x="83" y="8" width="9" height="9" fill="black" />

                        <rect x="0" y="75" width="25" height="25" fill="black" />
                        <rect x="5" y="80" width="15" height="15" fill="white" />
                        <rect x="83" y="83" width="9" height="9" fill="black" />

                        <rect x="35" y="35" width="30" height="30" fill="black" />
                        <rect x="40" y="40" width="20" height="20" fill="white" />
                        
                        <rect x="80" y="45" width="10" height="10" fill="black" />
                        <rect x="45" y="80" width="10" height="10" fill="black" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 block">attributing: {activePartner.code}</span>
                  </div>

                  {simulateSuccess ? (
                    <div className="p-3 bg-neonGreen/10 border border-neonGreen/20 text-neonGreen text-xs rounded-lg text-center font-semibold animate-pulse">
                      ⚡ Wrap Scan Registered Live! Check Admin Feed
                    </div>
                  ) : (
                    <button
                      onClick={handleSimulateScan}
                      disabled={simulating}
                      className="w-full p-3 bg-neonCyan text-darkBg hover:bg-neonCyan/90 font-bold text-xs rounded-lg transition-all flex justify-center items-center gap-2 shadow-lg glow-cyan"
                    >
                      <span>{simulating ? 'Broadcasting Event...' : 'Trigger Simulated QR Scan'}</span>
                    </button>
                  )}
                </div>

                {/* Local Activity Feed for QR scans */}
                <div className="glass-card rounded-2xl p-6 max-h-60 overflow-hidden">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Recent Scans ({activePartner.company})</h4>
                  <div className="space-y-2.5 overflow-y-auto max-h-40">
                    {scanEvents
                      .filter(e => e.partnerCode === activePartner.code)
                      .map((e, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-900 text-[10px] text-slate-400 flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-neonRed flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-white font-semibold block">{e.location} Scan Event</span>
                            <span>{e.message}</span>
                          </div>
                        </div>
                      ))}
                    {scanEvents.filter(e => e.partnerCode === activePartner.code).length === 0 && (
                      <div className="text-center py-6 text-slate-600 text-xs">No simulated wrap scan telemetry recorded yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── VIEW 4: REFERRAL LINKS ─── */}
        {isLinks && activePartner && (
          <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto space-y-6 animate-slide-in">
            <h2 className="text-xl font-grotesk font-bold text-white mb-2">Referral Funnel Links</h2>
            <p className="text-xs text-slate-400 mb-6">Deploy these co-branded links across your social channels, email lists, or printed materials to attribute traffic and conversions.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Primary Funnel Gate URL (Digital Share)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${window.location.protocol}//${window.location.host}/funnel?ref=${activePartner.code}`}
                    className="flex-1 glass-input rounded-lg p-3 text-xs font-mono text-neonCyan bg-slate-950"
                  />
                  <button 
                    onClick={() => copyLink(`${window.location.protocol}//${window.location.host}/funnel?ref=${activePartner.code}`)}
                    className="px-4 bg-slate-900 border border-slate-800 text-slate-200 hover:text-white rounded-lg transition-all text-xs font-bold"
                  >
                    {copiedLink ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Alternative Video 1 Landing URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${window.location.protocol}//${window.location.host}/funnel/video-1?ref=${activePartner.code}`}
                    className="flex-1 glass-input rounded-lg p-3 text-xs font-mono text-slate-400 bg-slate-950"
                  />
                  <button 
                    onClick={() => copyLink(`${window.location.protocol}//${window.location.host}/funnel/video-1?ref=${activePartner.code}`)}
                    className="px-4 bg-slate-900 border border-slate-800 text-slate-200 hover:text-white rounded-lg transition-all text-xs font-bold"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Short URL for Print (Magazines, Newspapers)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${window.location.protocol}//${window.location.host}/r/${activePartner.code}`}
                    className="flex-1 glass-input rounded-lg p-3 text-xs font-mono text-neonPurple bg-slate-950"
                  />
                  <button 
                    onClick={() => copyLink(`${window.location.protocol}//${window.location.host}/r/${activePartner.code}`)}
                    className="px-4 bg-slate-900 border border-slate-800 text-slate-200 hover:text-white rounded-lg transition-all text-xs font-bold"
                  >
                    Copy Short URL
                  </button>
                </div>
              </div>

              {/* Print Support and QR Card */}
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex flex-col md:flex-row items-center gap-6 mt-6">
                <div className="bg-white p-3 rounded-lg flex-shrink-0 flex items-center justify-center w-36 h-36 shadow-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full text-black">
                    <rect width="100" height="100" fill="white"/>
                    <rect x="10" y="10" width="20" height="20" fill="black"/>
                    <rect x="14" y="14" width="12" height="12" fill="white"/>
                    <rect x="16" y="16" width="8" height="8" fill="black"/>
                    
                    <rect x="70" y="10" width="20" height="20" fill="black"/>
                    <rect x="74" y="14" width="12" height="12" fill="white"/>
                    <rect x="76" y="16" width="8" height="8" fill="black"/>
                    
                    <rect x="10" y="70" width="20" height="20" fill="black"/>
                    <rect x="14" y="74" width="12" height="12" fill="white"/>
                    <rect x="16" y="76" width="8" height="8" fill="black"/>
                    
                    <rect x="40" y="40" width="20" height="20" fill="black"/>
                    <rect x="44" y="44" width="12" height="12" fill="white"/>
                    <rect x="46" y="46" width="8" height="8" fill="black"/>
                    
                    <rect x="75" y="75" width="15" height="15" fill="black"/>
                    <rect x="78" y="78" width="9" height="9" fill="white"/>
                    
                    <text x="50" y="93" font-size="5.5" font-family="monospace" text-anchor="middle" fill="black" font-weight="bold">
                      r/{activePartner.code}
                    </text>
                  </svg>
                </div>
                
                <div className="flex-1 space-y-3 self-stretch flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Offline Print & QR Code Support</span>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Perfect for physical placements like trade journals, magazines, newspapers, billboard wraps, or company vehicle wraps. 
                      Scanning this code redirects leads instantly and attributes them to your account.
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => {
                        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="300" height="300"><rect width="100" height="100" fill="white"/><rect x="10" y="10" width="20" height="20" fill="black"/><rect x="14" y="14" width="12" height="12" fill="white"/><rect x="16" y="16" width="8" height="8" fill="black"/><rect x="70" y="10" width="20" height="20" fill="black"/><rect x="74" y="14" width="12" height="12" fill="white"/><rect x="76" y="16" width="8" height="8" fill="black"/><rect x="10" y="70" width="20" height="20" fill="black"/><rect x="14" y="74" width="12" height="12" fill="white"/><rect x="16" y="76" width="8" height="8" fill="black"/><rect x="40" y="40" width="20" height="20" fill="black"/><rect x="44" y="44" width="12" height="12" fill="white"/><rect x="46" y="46" width="8" height="8" fill="black"/><rect x="75" y="75" width="15" height="15" fill="black"/><rect x="78" y="78" width="9" height="9" fill="white"/><text x="50" y="93" font-size="5.5" font-family="monospace" text-anchor="middle" fill="black" font-weight="bold">r/${activePartner.code}</text></svg>`;
                        const blob = new Blob([svgString], { type: 'image/svg+xml' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `referq-print-qr-${activePartner.code}.svg`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="flex-1 py-2 bg-neonGreen/10 hover:bg-neonGreen/20 text-neonGreen border border-neonGreen/20 rounded-lg text-xs font-bold transition-all text-center"
                    >
                      Download SVG
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        const printWindow = window.open('', '_blank');
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>Print QR Code - ${activePartner.company}</title>
                              <style>
                                body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
                                svg { width: 300px; height: 300px; }
                                h2 { margin-top: 20px; }
                              </style>
                            </head>
                            <body>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="white"/><rect x="10" y="10" width="20" height="20" fill="black"/><rect x="14" y="14" width="12" height="12" fill="white"/><rect x="16" y="16" width="8" height="8" fill="black"/><rect x="70" y="10" width="20" height="20" fill="black"/><rect x="74" y="14" width="12" height="12" fill="white"/><rect x="76" y="16" width="8" height="8" fill="black"/><rect x="10" y="70" width="20" height="20" fill="black"/><rect x="14" y="74" width="12" height="12" fill="white"/><rect x="16" y="76" width="8" height="8" fill="black"/><rect x="40" y="40" width="20" height="20" fill="black"/><rect x="44" y="44" width="12" height="12" fill="white"/><rect x="46" y="46" width="8" height="8" fill="black"/><rect x="75" y="75" width="15" height="15" fill="black"/><rect x="78" y="78" width="9" height="9" fill="white"/><text x="50" y="93" font-size="5.5" font-family="monospace" text-anchor="middle" fill="black" font-weight="bold">r/${activePartner.code}</text></svg>
                              <h2>${activePartner.company} Referral Code</h2>
                              <script>window.onload = function() { window.print(); window.close(); }</script>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                      }}
                      className="flex-1 py-2 bg-slate-900 border border-slate-800 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-all text-center"
                    >
                      Print Code
                    </button>
                  </div>
                </div>
              </div>

              {/* Territory protection info */}
              <div className="p-4 bg-neonCyan/5 border border-neonCyan/10 rounded-xl flex items-start gap-3 mt-8">
                <ShieldCheck className="w-5 h-5 text-neonCyan flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <strong className="text-white block">Territory Protection Active</strong>
                  <span className="text-slate-400 block">Leads originating from within your protected zone (<strong className="text-white">{activePartner.territory || 'Sydney CBD'}</strong>) will automatically route to your wrapping account and lock into your dashboard queue, even if they scanned another partner link!</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── VIEW 5: EARNINGS & TIER LEADERBOARD ─── */}
        {isEarnings && activePartner && (
          <div className="space-y-8 animate-slide-in">
            {/* Commissions tiers overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`glass-card p-6 rounded-xl space-y-4 border ${activePartner.tier === 'Starter' ? 'border-neonCyan/40 bg-neonCyan/5' : ''}`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-grotesk font-bold text-base text-white">Starter Tier</h3>
                  <span className="text-xs bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-800">0 - 15 leads</span>
                </div>
                <div className="text-3xl font-black text-neonCyan font-grotesk">15% <span className="text-xs font-normal text-slate-400">commission</span></div>
                <p className="text-xs text-slate-400 leading-relaxed">Default starting bracket. Ideal for single vehicle wrap advertising shops and influencers.</p>
                <div className="space-y-1.5 text-[10px] text-slate-400 border-t border-slate-800 pt-3">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-neonCyan" /> Standard Web Banners</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-neonCyan" /> Basic Email Outreaches</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-neonCyan" /> Standard 60-Day Cookie Tracking</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-neonCyan" /> Net-30 Payout Schedule</div>
                </div>
                <button
                  onClick={() => navigate('/register?tier=standard')}
                  className="w-full mt-2 py-2.5 bg-neonCyan/10 hover:bg-neonCyan/20 text-neonCyan border border-neonCyan/30 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Join Programme</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className={`glass-card p-6 rounded-xl space-y-4 border border-rose-500/30 bg-rose-950/5`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-grotesk font-bold text-base text-white text-rose-400">Elite Tier</h3>
                  <span className="text-xs bg-rose-950/20 px-2 py-0.5 rounded text-rose-400 border border-rose-900/50">Exclusive Publisher</span>
                </div>
                <div className="text-3xl font-black text-rose-400 font-grotesk">22% <span className="text-xs font-normal text-slate-400">commission</span></div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">Tailored for established magazines, popular trade journals, and industry leaders.</p>
                <div className="space-y-1.5 text-[10px] text-slate-400 border-t border-slate-800 pt-3">
                  <div className="flex items-center gap-1.5 text-rose-400"><CheckCircle2 className="w-3 h-3" /> Protected Territory Lock</div>
                  <div className="flex items-center gap-1.5 text-rose-400"><CheckCircle2 className="w-3 h-3" /> Dedicated Partner Manager</div>
                  <div className="flex items-center gap-1.5 text-rose-400"><CheckCircle2 className="w-3 h-3" /> White-Label Onboarding Flow</div>
                  <div className="flex items-center gap-1.5 text-rose-400"><CheckCircle2 className="w-3 h-3" /> Net-15 Payout (Stripe Sync)</div>
                  <div className="flex items-center gap-1.5 text-rose-400"><CheckCircle2 className="w-3 h-3" /> Premium Logo & watermark-free Overlays</div>
                </div>
                <button
                  onClick={() => navigate('/register?tier=elite')}
                  className="w-full mt-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20"
                >
                  <span>Join Elite</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className={`glass-card p-6 rounded-xl space-y-4 border ${activePartner.tier === 'Pro' ? 'border-neonPink/40 bg-neonPink/5' : ''}`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-grotesk font-bold text-base text-white">Instant Sign Up</h3>
                  <span className="text-xs bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-800">Skip Queue</span>
                </div>
                <div className="text-3xl font-black text-neonGreen font-grotesk">15% <span className="text-xs font-normal text-slate-400">CPA Promo</span></div>
                <p className="text-xs text-slate-400 leading-relaxed">Skip manual verification. Instantly generate code and immediately share tracking URLs.</p>
                <div className="space-y-1.5 text-[10px] text-slate-400 border-t border-slate-800 pt-3">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-neonGreen" /> Instant Code Generation</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-neonGreen" /> Immediate Link Sharing</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-neonGreen" /> Upgrade to Full Territory Later</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-neonGreen" /> Automated stripe Net-30</div>
                </div>
                <button
                  onClick={() => navigate('/register?tier=quick')}
                  className="w-full mt-2 py-2.5 bg-neonGreen/10 hover:bg-neonGreen/20 text-neonGreen border border-neonGreen/30 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <span>⚡ Instant Signup</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-grotesk font-bold text-white mb-2">Partner Leaderboard</h2>
              <p className="text-xs text-slate-400 mb-6">Compare referral click conversion volume across regional protected partners.</p>

              <div className="bg-slate-950/40 rounded-xl border border-slate-900 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-900 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Rank</th>
                      <th className="p-4">Partner Agency</th>
                      <th className="p-4 text-center">Referral Clicks</th>
                      <th className="p-4 text-center">Conversions</th>
                      <th className="p-4 text-center">Active Tier</th>
                      <th className="p-4 text-right">Commission Earned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60">
                    {affiliates
                      .sort((a, b) => b.conversions - a.conversions)
                      .map((aff, idx) => (
                        <tr key={aff.code} className={`hover:bg-slate-900/20 ${aff.code === activePartner.code ? 'bg-neonCyan/5' : ''}`}>
                          <td className="p-4 font-bold text-slate-400">#{idx + 1}</td>
                          <td className="p-4">
                            <span className="font-semibold text-white block">{aff.company}</span>
                            <span className="text-[10px] text-slate-500">{aff.territory}</span>
                          </td>
                          <td className="p-4 text-center font-mono">{aff.clicks}</td>
                          <td className="p-4 text-center font-mono">{aff.conversions}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              aff.tier === 'Elite' ? 'bg-neonRed/10 text-neonRed border border-neonRed/20' :
                              aff.tier === 'Pro' ? 'bg-neonPink/10 text-neonPink border border-neonPink/20' :
                              aff.tier === 'Growth' ? 'bg-neonPurple/10 text-neonPurple border border-neonPurple/20' :
                              'bg-slate-900 text-slate-400 border border-slate-800'
                            }`}>
                              {aff.tier}
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold text-white font-mono">${aff.earnings}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── VIEW 6: MARKETING ASSETS KIT ─── */}
        {isAssets && activePartner && (
          <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto space-y-6 animate-slide-in">
            <h2 className="text-xl font-grotesk font-bold text-white mb-2">Marketing Assets Kit</h2>
            <p className="text-xs text-slate-400 mb-6">Deploy these co-branded marketing assets on your website, email campaigns, and printed materials to acquire leads and track clicks.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Web Banner */}
              <div className="glass-card p-5 border-slate-800 bg-slate-900/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-white">Leaderboard Web Banner (728x90)</span>
                    <span className="text-[9px] bg-slate-850 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">HTML</span>
                  </div>
                  <p className="text-xs text-slate-500">HTML iframe embed code for placement at the top or bottom of your blogs/website portal.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const embed = `<a href="${window.location.origin}/funnel?ref=${activePartner.code}" target="_blank"><img src="${window.location.origin}/assets/banner_leaderboard.png" alt="Rule7Media Ad Funnel" style="width:728px;height:90px;border:none;" /></a>`;
                    navigator.clipboard.writeText(embed);
                    alert('Web Banner embed HTML copied!');
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-all"
                >
                  Copy Embed HTML
                </button>
              </div>

              {/* Animated GIF */}
              <div className="glass-card p-5 border-slate-800 bg-slate-900/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-white">Animated Conversion Loop GIF</span>
                    <span className="text-[9px] bg-slate-850 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">GIF</span>
                  </div>
                  <p className="text-xs text-slate-500">Engaging loop graphics demonstrating live CRM updates and vehicle scanning animations.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const embed = `<a href="${window.location.origin}/funnel?ref=${activePartner.code}" target="_blank"><img src="${window.location.origin}/assets/animated_loop.gif" alt="CRM telemetry tracking" style="width:300px;height:250px;border:none;" /></a>`;
                    navigator.clipboard.writeText(embed);
                    alert('GIF embed code copied!');
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-all"
                >
                  Copy GIF Embed
                </button>
              </div>

              {/* Custom SVG QR Code */}
              <div className="glass-card p-5 border-slate-800 bg-slate-900/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-white">High-Res Print QR Code</span>
                    <span className="text-[9px] bg-slate-850 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">SVG</span>
                  </div>
                  <p className="text-xs text-slate-500">Vector SVG format for printing on vehicle wraps, physical decals, business cards, or brochures.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="300" height="300"><rect width="100" height="100" fill="white"/><rect x="10" y="10" width="20" height="20" fill="black"/><rect x="14" y="14" width="12" height="12" fill="white"/><rect x="16" y="16" width="8" height="8" fill="black"/><rect x="70" y="10" width="20" height="20" fill="black"/><rect x="74" y="14" width="12" height="12" fill="white"/><rect x="76" y="16" width="8" height="8" fill="black"/><rect x="10" y="70" width="20" height="20" fill="black"/><rect x="14" y="74" width="12" height="12" fill="white"/><rect x="16" y="76" width="8" height="8" fill="black"/><rect x="40" y="40" width="20" height="20" fill="black"/><rect x="44" y="44" width="12" height="12" fill="white"/><rect x="46" y="46" width="8" height="8" fill="black"/><rect x="75" y="75" width="15" height="15" fill="black"/><rect x="78" y="78" width="9" height="9" fill="white"/><text x="50" y="93" font-size="5.5" font-family="monospace" text-anchor="middle" fill="black" font-weight="bold">r/${activePartner.code}</text></svg>`;
                    const blob = new Blob([svgString], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `referq-print-qr-${activePartner.code}.svg`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full py-2.5 bg-neonGreen/10 hover:bg-neonGreen/20 text-neonGreen border border-neonGreen/30 rounded-lg text-xs font-bold transition-all"
                >
                  Download Print QR SVG
                </button>
              </div>

              {/* Magazine Print Artwork */}
              <div className="glass-card p-5 border-slate-800 bg-slate-900/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-white">Magazine Artwork Layout</span>
                    <span className="text-[9px] bg-slate-850 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">PDF</span>
                  </div>
                  <p className="text-xs text-slate-500">Ready-to-print full-page artwork layout matching regional trade journals and magazines.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const artWindow = window.open('', '_blank');
                    artWindow.document.write(`
                      <html>
                        <head>
                          <title>Rule7Media Magazine Artwork - ${activePartner.company}</title>
                          <style>
                            body { background-color: #040409; color: #ffffff; font-family: sans-serif; padding: 40px; text-align: center; }
                            .card { border: 2px solid #00f0ff; padding: 40px; border-radius: 20px; max-width: 500px; margin: 40px auto; background: #080814; box-shadow: 0 0 35px rgba(0, 240, 255, 0.25); }
                            h1 { font-size: 28px; color: #00f0ff; margin-bottom: 5px; font-weight: 900; }
                            h2 { font-size: 16px; color: #ff3399; margin-bottom: 25px; font-weight: 700; letter-spacing: 1px; }
                            p { font-size: 13px; line-height: 1.6; color: #94a3b8; }
                            .qr-box { background: white; padding: 15px; border-radius: 10px; display: inline-block; margin: 25px 0; }
                            svg { width: 160px; height: 160px; }
                            .footer-text { font-size: 10px; color: #475569; margin-top: 30px; }
                          </style>
                        </head>
                        <body>
                          <div class="card">
                            <h1>RULE 7 MEDIA</h1>
                            <h2>WHY DIGITAL ADS BURN BUDGET</h2>
                            <p>Scan the code below to complete our 7-step video qualification series and claim exclusive vehicle wrapping monopoly options in Dhaka North.</p>
                            <div class="qr-box">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="white"/><rect x="10" y="10" width="20" height="20" fill="black"/><rect x="14" y="14" width="12" height="12" fill="white"/><rect x="16" y="16" width="8" height="8" fill="black"/><rect x="70" y="10" width="20" height="20" fill="black"/><rect x="74" y="14" width="12" height="12" fill="white"/><rect x="76" y="16" width="8" height="8" fill="black"/><rect x="10" y="70" width="20" height="20" fill="black"/><rect x="14" y="74" width="12" height="12" fill="white"/><rect x="16" y="76" width="8" height="8" fill="black"/><rect x="40" y="40" width="20" height="20" fill="black"/><rect x="44" y="44" width="12" height="12" fill="white"/><rect x="46" y="46" width="8" height="8" fill="black"/><rect x="75" y="75" width="15" height="15" fill="black"/><rect x="78" y="78" width="9" height="9" fill="white"/><text x="50" y="93" font-size="5.5" font-family="monospace" text-anchor="middle" fill="black" font-weight="bold">r/${activePartner.code}</text></svg>
                            </div>
                            <p><strong>Exclusive Partner: ${activePartner.company}</strong></p>
                            <div class="footer-text">Published in Regional Trade Journals & Newspapers &copy; 2026 Rule7Media</div>
                          </div>
                          <script>window.onload = function() { window.print(); }</script>
                        </body>
                      </html>
                    `);
                    artWindow.document.close();
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-all"
                >
                  Print / Save Magazine Ad PDF
                </button>
              </div>

              {/* Facebook Post */}
              <div className="glass-card p-5 border-slate-800 bg-slate-900/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-white">Facebook Post Template</span>
                    <span className="text-[9px] bg-slate-850 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">FB</span>
                  </div>
                  <p className="text-xs text-slate-500">Engaging social media post copy optimized to drive Facebook traffic to your co-branded landing page.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const text = `🚚 Stop burning your marketing budget on digital ads! Discover how to turn your commercial vehicles into always-on lead generation assets. Scan the QR code or click below to check out the Rule7Media 7-Video Mastery Series.\n\n👉 Share link: ${window.location.origin}/funnel?ref=${activePartner.code}\n\n#Rule7Media #VehicleWrapping #LocalAdvertising #MarketingROI`;
                    navigator.clipboard.writeText(text);
                    alert('Facebook post copy saved to clipboard!');
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-all"
                >
                  Copy Facebook Copy
                </button>
              </div>

              {/* LinkedIn Post */}
              <div className="glass-card p-5 border-slate-800 bg-slate-900/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-white">LinkedIn Post Template</span>
                    <span className="text-[9px] bg-slate-850 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">LI</span>
                  </div>
                  <p className="text-xs text-slate-500">Professional, statistics-driven post copy designed for high-conversion B2B LinkedIn connections.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const text = `💼 B2B Lead Generation Reimagined: In 2026, screen space is noisier than ever due to AI-generated content. Real-world mobility assets (vehicle wraps) have a CPM of under $1 and build local trust faster.\n\nI’ve partnered with Rule7Media to offer an exclusive 7-video qualification series for fleet owners and local wrap shops. Complete the funnel below to secure your territory protection rights.\n\n🔗 Review pipeline: ${window.location.origin}/funnel?ref=${activePartner.code}\n\n#B2BMarketing #FleetManagement #LeadGeneration #OutofHomeAdvertising #Rule7Media`;
                    navigator.clipboard.writeText(text);
                    alert('LinkedIn post copy saved to clipboard!');
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-all"
                >
                  Copy LinkedIn Copy
                </button>
              </div>

              {/* B2B Email Outreach Templates */}
              <div className="glass-card p-5 border-slate-800 bg-slate-900/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-white">Cold Email Outreach Pitch</span>
                    <span className="text-[9px] bg-slate-850 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">TXT</span>
                  </div>
                  <p className="text-xs text-slate-500">High-converting cold outreach email pitch with dynamic affiliate link pre-embedded.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const email = `Hi,\n\nI wanted to share a quick transit-ad qualify pipeline platform designed specifically to secure local geographic routing and drive qualified dealership / fleet leads.\n\nYou can review our live 7-video verification funnel dashboard directly using my partner code link here:\n${window.location.origin}/funnel?ref=${activePartner.code}\n\nLet me know if you would like a custom setup.`;
                    navigator.clipboard.writeText(email);
                    alert('Email template copy saved to clipboard!');
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-all"
                >
                  Copy Email copy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lead Details Modal Overlay */}
        {selectedLead && (
          <div className="fixed inset-0 bg-darkBg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-card rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-slide-in">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-neonCyan/5 rounded-full filter blur-xl pointer-events-none"></div>
              
              <h3 className="font-grotesk font-black text-lg text-white mb-4 border-b border-slate-800 pb-2">
                Lead Qualification Profile
              </h3>
              
              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                  <span className="text-slate-500 font-medium">Company Name</span>
                  <strong className="text-white font-semibold">{selectedLead.company || 'N/A'}</strong>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                  <span className="text-slate-500 font-medium">Contact Name</span>
                  <strong className="text-white font-semibold">{selectedLead.name || 'Anonymous'}</strong>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                  <span className="text-slate-500 font-medium">Business Email</span>
                  <strong className="text-slate-400 font-mono">{selectedLead.email || 'N/A'}</strong>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                  <span className="text-slate-500 font-medium">Industry Segment</span>
                  <strong className="text-white font-semibold">{selectedLead.industry || 'Local Business'}</strong>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                  <span className="text-slate-500 font-medium">Annual Budget</span>
                  <strong className="text-neonCyan font-bold">{selectedLead.budget || 'N/A'}</strong>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                  <span className="text-slate-500 font-medium">Fleet Size</span>
                  <strong className="text-white font-semibold">{selectedLead.fleetSize || 'N/A'}</strong>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                  <span className="text-slate-500 font-medium">Qualification Stage</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                    selectedLead.stage === 'Hot' ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' : selectedLead.stage === 'Warm' ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {selectedLead.stage || 'Cold'} ({selectedLead.score || 0}/100)
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                  <span className="text-slate-500 font-medium">Assigned Subscription</span>
                  <strong className="text-neonGreen font-semibold">{selectedLead.subscriptionType || 'Pending Conversion'}</strong>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                  <span className="text-slate-500 font-medium">Earned Commission</span>
                  <strong className="text-neonCyan font-mono font-bold">${(selectedLead.commissionAmount || 0).toFixed(2)}</strong>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                  <span className="text-slate-500 font-medium">Status</span>
                  <strong className={selectedLead.status === 'Completed' ? 'text-neonGreen' : 'text-neonAmber'}>
                    {selectedLead.status || 'Started'}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="w-full mt-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-800"
              >
                Close Lead Profile
              </button>
            </div>
          </div>
        )}

      </main>
      <GlobalFooter />
    </div>
  );
};
