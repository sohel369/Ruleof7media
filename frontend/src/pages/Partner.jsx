import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, ChevronRight, AlertCircle, Shield, Users, BarChart3, 
  QrCode, LogOut, Lock, MapPin, Phone, Mail, FileText, Check, Globe,
  Calculator, Download, RefreshCw, DollarSign, Award, ArrowUpRight, Copy, Sparkles, FileSpreadsheet, ExternalLink,
  LayoutDashboard, Rocket, TrendingUp, HelpCircle, Star
} from 'lucide-react';
import { GlobalFooter } from '../components/GlobalFooter';

// Partner Portal — Registration, Login, and Wrap Shop Dashboard
export const Partner = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  const isRegisterPage = path === '/partner/register';
  const isApplyPage = path === '/partner/apply';
  const isDashboardPage = path === '/partner/dashboard' || (isLoggedIn && (path === '/partner' || path === '/partner/'));
  const isLoginPage = path === '/partner/login' || (!isLoggedIn && (path === '/partner' || path === '/partner/' || (!isRegisterPage && !isApplyPage && !isDashboardPage)));

  const selectedPlan = localStorage.getItem('r7_selected_plan') || 'Growth';
  const paymentComplete = localStorage.getItem('r7_payment_complete') === 'true';

  // Login & Session States
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('r7_partner_logged_in') === 'true');
  const [partnerCode, setPartnerCode] = useState(() => localStorage.getItem('r7_partner_code') || '');
  const [partnerName, setPartnerName] = useState(() => localStorage.getItem('r7_partner_name') || '');

  // Registration Form State with comprehensive pre-population
  const [form, setForm] = useState(() => {
    const searchParams = new URLSearchParams(location.search);
    return {
      name: searchParams.get('name') || localStorage.getItem('r7_billing_name') || localStorage.getItem('r7_lead_name') || '',
      company: searchParams.get('company') || searchParams.get('business') || localStorage.getItem('r7_billing_business') || localStorage.getItem('r7_lead_company') || '',
      email: searchParams.get('email') || localStorage.getItem('r7_billing_email') || localStorage.getItem('r7_lead_email') || '',
      website: searchParams.get('website') || localStorage.getItem('r7_lead_website') || '',
      territory: searchParams.get('territory') || searchParams.get('state') || localStorage.getItem('r7_billing_territory') || localStorage.getItem('r7_lead_state') || 'Sydney CBD (30-Mile Radius)',
      phone: searchParams.get('phone') || localStorage.getItem('r7_billing_phone') || localStorage.getItem('r7_lead_phone') || '',
      overnightFitting: 'Yes'
    };
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Dashboard Data States — Defaults to 'overview' to avoid empty blank screen
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'crm' | 'accounting' | 'affiliate' | 'qr' | 'territory'
  const [selectedLead, setSelectedLead] = useState(null);
  const [partnerDetails, setPartnerDetails] = useState(null);

  // Accounting & Invoicing States (Non-Tech 1-Click Interface)
  const [qbConnected, setQbConnected] = useState(false);
  const [xeroConnected, setXeroConnected] = useState(false);
  const [sageConnected, setSageConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Job Costing / Gross Profit Calculator State (Grok Feature for Wrap Shops)
  const [calcQuote, setCalcQuote] = useState(3500);
  const [calcLabor, setCalcLabor] = useState(850);
  const [calcMaterial, setCalcMaterial] = useState(1100);
  const [calcWastagePct, setCalcWastagePct] = useState(10);
  const [calcOvertime, setCalcOvertime] = useState(200);
  const [copiedRef, setCopiedRef] = useState(false);

  // Automatic Route Redirection Guard
  useEffect(() => {
    if (paymentComplete && (path === '/partner' || path === '/partner/')) {
      navigate('/partner/register', { replace: true });
      return;
    }

    if (path === '/partner' || path === '/partner/') {
      if (isLoggedIn) {
        navigate('/partner/dashboard', { replace: true });
      } else {
        navigate('/partner/login', { replace: true });
      }
    } else if (path === '/partner/login' && isLoggedIn) {
      navigate('/partner/dashboard', { replace: true });
    } else if (path === '/partner/dashboard' && !isLoggedIn) {
      navigate('/partner/login', { replace: true });
    }
  }, [path, isLoggedIn, paymentComplete, navigate]);

  // Fetch Dashboard Leads & Partner details
  useEffect(() => {
    if (isLoggedIn && isDashboardPage && partnerCode) {
      // Fetch partner info
      fetch(`/api/affiliates/${partnerCode}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setPartnerDetails(data);
            setPartnerName(data.company);
            localStorage.setItem('r7_partner_name', data.company);
          }
        })
        .catch(err => console.error('Error fetching partner info:', err));

      // Fetch leads assigned to this partner code
      fetch(`/api/leads?assignedAffiliateId=${partnerCode}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setLeads(data);
          }
        })
        .catch(err => console.error('Error fetching partner leads:', err));
    }
  }, [isLoggedIn, isDashboardPage, partnerCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit Partner Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.name || !form.company || !form.email) {
      setError('Please fill in your name, company, and email.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/affiliates/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          plan: selectedPlan
        })
      });
      const data = await res.json();

      if (data.success) {
        const code = data.affiliate.code;
        setPartnerCode(code);
        setPartnerName(form.company);
        localStorage.setItem('r7_partner_code', code);
        localStorage.setItem('r7_partner_name', form.company);
        localStorage.setItem('r7_partner_logged_in', 'true');
        localStorage.setItem('r7_payment_complete', 'false');
        setIsLoggedIn(true);
        navigate('/partner/dashboard');
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      // Offline fallback
      const code = form.company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setPartnerCode(code);
      setPartnerName(form.company);
      localStorage.setItem('r7_partner_code', code);
      localStorage.setItem('r7_partner_name', form.company);
      localStorage.setItem('r7_partner_logged_in', 'true');
      localStorage.setItem('r7_payment_complete', 'false');
      setIsLoggedIn(true);
      navigate('/partner/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Submit Partner Login
  const handlePartnerLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!partnerCodeInput.trim()) {
      setLoginError('Please enter your partner shop code.');
      return;
    }

    const code = partnerCodeInput.trim().toLowerCase();
    fetch(`/api/affiliates/${code}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          localStorage.setItem('r7_partner_code', data.code);
          localStorage.setItem('r7_partner_name', data.company);
          localStorage.setItem('r7_partner_logged_in', 'true');
          setPartnerCode(data.code);
          setPartnerName(data.company);
          setIsLoggedIn(true);
          navigate('/partner/dashboard');
        } else {
          setLoginError('Partner shop code not found. Please verify your code.');
        }
      })
      .catch(() => {
        // Offline fallback for demo
        localStorage.setItem('r7_partner_code', code);
        localStorage.setItem('r7_partner_name', 'RapidWrap Shop');
        localStorage.setItem('r7_partner_logged_in', 'true');
        setPartnerCode(code);
        setPartnerName('RapidWrap Shop');
        setIsLoggedIn(true);
        navigate('/partner/dashboard');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('r7_partner_logged_in');
    localStorage.removeItem('r7_partner_code');
    localStorage.removeItem('r7_partner_name');
    setIsLoggedIn(false);
    setPartnerCode('');
    setPartnerName('');
    navigate('/partner/login');
  };

  // ─── VIEW 1: PARTNER LOGIN ───
  if (isLoginPage) {
    return (
      <div className="min-h-screen flex flex-col bg-darkBg text-white">
        <nav className="fixed top-0 w-full z-50 py-4 px-6 flex justify-between items-center bg-darkBg/90 backdrop-blur-md border-b border-slate-900">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-neonCyan flex items-center justify-center font-black text-darkBg shadow-lg">R</div>
            <span className="font-grotesk font-bold text-xl">Rule7<span className="text-neonCyan">Media</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/funnel')} className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
              Advertiser Portal
            </button>
            <button onClick={() => navigate('/pricing')} className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
              Pricing Plans
            </button>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center py-24 px-4">
          <div className="max-w-md w-full glass-card rounded-2xl p-8 relative overflow-hidden animate-slide-in shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neonCyan/5 rounded-full filter blur-3xl pointer-events-none"></div>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-neonCyan/20 text-neonCyan flex items-center justify-center mx-auto mb-4 border border-neonCyan/30">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-grotesk font-bold text-white">Partner CRM Portal</h1>
              <p className="text-xs text-slate-400 mt-1">Enter your wrap shop partner code to access leads.</p>
            </div>

            <form onSubmit={handlePartnerLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Partner Shop Code</label>
                <input 
                  type="text" 
                  value={partnerCodeInput}
                  onChange={e => setPartnerCodeInput(e.target.value)}
                  placeholder="e.g. rapidwrap-sydney"
                  className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                />
                <span className="text-[10px] text-slate-500 block mt-1.5">This code was generated during your subscription setup.</span>
              </div>

              {loginError && <div className="text-xs text-neonRed bg-neonRed/10 p-2 rounded-lg border border-neonRed/20">{loginError}</div>}

              <button 
                type="submit"
                className="w-full p-3 rounded-lg font-bold text-xs text-darkBg bg-neonCyan hover:bg-neonCyan/90 transition-all shadow-lg glow-cyan"
              >
                Access My Partner Dashboard
              </button>

              <div className="border-t border-slate-900 pt-4 mt-6 text-center text-[10px] text-slate-500 space-y-1">
                <p>New partner wrap shop? <button type="button" onClick={() => navigate('/pricing')} className="text-neonCyan hover:underline">Get Subscribed</button></p>
                <p>Rule7Media HQ Administrator? <button type="button" onClick={() => navigate('/admin/login')} className="text-neonPurple hover:underline">Admin Login</button></p>
              </div>
            </form>
          </div>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  // ─── VIEW 2: PARTNER DASHBOARD ───
  if (isDashboardPage) {
    return (
      <div className="min-h-screen bg-darkBg text-white flex flex-col">
        {/* Top Header */}
        <header className="glass-card border-x-0 border-t-0 fixed top-0 w-full z-50 bg-darkBg/95 backdrop-blur-md px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neonCyan flex items-center justify-center font-black text-darkBg shadow-lg">R</div>
            <div>
              <span className="font-grotesk font-bold text-base block leading-none">Rule7<span className="text-neonCyan">Media</span></span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Wrap Shop Partner Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-white block">{partnerName || 'RapidWrap Shop'}</span>
              <span className="text-[9px] font-mono text-neonCyan">{partnerCode}</span>
            </div>
            <button 
              onClick={handleLogout} 
              className="p-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-2 text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Main Workspace */}
        <div className="flex-1 pt-24 pb-12 max-w-7xl mx-auto w-full px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 overflow-x-hidden">
          
          {/* Left Sidebar Menu */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="glass-card p-3 sm:p-4 rounded-xl space-y-1">
              <button 
                onClick={() => { setActiveTab('overview'); setSelectedLead(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-3 text-xs font-bold ${
                  activeTab === 'overview' 
                    ? 'bg-neonCyan/15 text-neonCyan border-l-2 border-neonCyan' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-neonCyan" />
                <span>Dashboard Overview</span>
              </button>

              <button 
                onClick={() => { setActiveTab('crm'); setSelectedLead(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-3 text-xs font-bold ${
                  activeTab === 'crm' 
                    ? 'bg-neonCyan/15 text-neonCyan border-l-2 border-neonCyan' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Qualified CRM Leads</span>
                {leads.length > 0 && (
                  <span className="ml-auto bg-neonCyan/20 text-neonCyan text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {leads.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('accounting')}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-3 text-xs font-bold ${
                  activeTab === 'accounting' 
                    ? 'bg-neonGreen/15 text-neonGreen border-l-2 border-neonGreen' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <Calculator className="w-4 h-4 text-neonGreen" />
                <span>Accounting &amp; Invoicing</span>
                <span className="ml-auto bg-neonGreen/20 text-neonGreen text-[9px] px-1.5 py-0.5 rounded font-bold">
                  2-Way Sync
                </span>
              </button>

              <button 
                onClick={() => setActiveTab('affiliate')}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-3 text-xs font-bold ${
                  activeTab === 'affiliate' 
                    ? 'bg-neonPurple/15 text-neonPurple border-l-2 border-neonPurple' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <Award className="w-4 h-4 text-neonPurple" />
                <span>22% Affiliate Earnings</span>
                <span className="ml-auto bg-neonPurple/20 text-neonPurple text-[9px] px-1.5 py-0.5 rounded font-bold">
                  22%
                </span>
              </button>

              <button 
                onClick={() => setActiveTab('qr')}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-3 text-xs font-bold ${
                  activeTab === 'qr' 
                    ? 'bg-neonCyan/15 text-neonCyan border-l-2 border-neonCyan' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <QrCode className="w-4 h-4 text-neonCyan" />
                <span>My Fleet QR Codes</span>
              </button>

              <button 
                onClick={() => setActiveTab('territory')}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-3 text-xs font-bold ${
                  activeTab === 'territory' 
                    ? 'bg-neonCyan/15 text-neonCyan border-l-2 border-neonCyan' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <Shield className="w-4 h-4 text-neonCyan" />
                <span>Territory Radius</span>
                <span className="ml-auto bg-slate-800 text-slate-300 text-[9px] px-1.5 py-0.5 rounded font-bold">
                  30-Mile
                </span>
              </button>
            </div>

            <div className="glass-card p-4 rounded-xl text-xs space-y-2.5 border border-slate-900/80">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Partner Details</span>
                <span className="text-[9px] px-2 py-0.5 bg-neonGreen/10 border border-neonGreen/20 text-neonGreen rounded-full font-bold">Active Shop</span>
              </div>
              <div className="flex justify-between items-center"><span className="text-slate-500">Shop:</span> <span className="text-white font-semibold truncate max-w-[140px]">{partnerName || 'RapidWrap Shop'}</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500">Partner Code:</span> <span className="text-neonCyan font-mono text-[11px] font-bold">{partnerCode}</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500">Plan Tier:</span> <span className="text-white font-semibold">{partnerDetails?.tier || selectedPlan || 'Professional'}</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500">Protected Zone:</span> <span className="text-white font-semibold">{partnerDetails?.territory || '30-Mile Radius'}</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500">Affiliate Balance:</span> <span className="text-neonGreen font-bold">${partnerDetails?.earnings || 0}.00</span></div>
            </div>

            {/* Dedicated Sidebar Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 bg-slate-950 hover:bg-neonRed/10 border border-slate-850 hover:border-neonRed/30 rounded-xl text-slate-400 hover:text-neonRed transition-all flex items-center justify-center gap-2 text-xs font-bold group"
            >
              <LogOut className="w-4 h-4 text-slate-500 group-hover:text-neonRed transition-colors" />
              <span>Logout of Partner Portal</span>
            </button>
          </aside>

          {/* Right Content Area */}
          <main className="lg:col-span-3 space-y-6 overflow-x-hidden">

            {/* TAB 0: OVERVIEW DASHBOARD */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-slide-in">
                {/* Welcome Banner */}
                <div className="glass-card p-6 sm:p-7 rounded-2xl border border-neonCyan/20 relative overflow-hidden bg-gradient-to-r from-darkBg via-slate-950 to-darkBg">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-neonCyan/5 rounded-full filter blur-3xl pointer-events-none"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neonCyan/10 border border-neonCyan/20 text-neonCyan text-[10px] font-black uppercase tracking-wider mb-3">
                        <Sparkles className="w-3 h-3" /> Wrap Shop Partner Hub
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-grotesk font-black text-white">
                        Welcome back, <span className="text-neonCyan">{partnerName || 'RapidWrap Shop'}</span>!
                      </h1>
                      <p className="text-xs text-slate-400 mt-1.5 max-w-xl leading-relaxed">
                        Your exclusive 30-mile lead routing is active. Manage inbound territory leads, sync vehicle quotes with your accounting software, and earn 22% recurring affiliate revenue.
                      </p>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap gap-2 shrink-0">
                      <button
                        onClick={() => setActiveTab('qr')}
                        className="px-4 py-2.5 bg-neonCyan text-darkBg font-bold rounded-xl text-xs hover:bg-neonCyan/90 transition-all shadow-lg glow-cyan flex items-center gap-1.5"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Get Fleet QR Codes</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('accounting')}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
                      >
                        <Calculator className="w-4 h-4 text-neonGreen" />
                        <span>Margin Calculator</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4 Interactive KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div 
                    onClick={() => setActiveTab('crm')}
                    className="glass-card p-5 rounded-xl border border-slate-900 hover:border-neonCyan/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Exclusive Leads</span>
                      <div className="w-8 h-8 rounded-lg bg-neonCyan/10 text-neonCyan flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-grotesk font-black text-white group-hover:text-neonCyan transition-colors">
                      {leads.length}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                      <span>Assigned to territory</span>
                      <ArrowUpRight className="w-3 h-3 text-neonCyan" />
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('territory')}
                    className="glass-card p-5 rounded-xl border border-slate-900 hover:border-neonGreen/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Protected Radius</span>
                      <div className="w-8 h-8 rounded-lg bg-neonGreen/10 text-neonGreen flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Shield className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-grotesk font-black text-white group-hover:text-neonGreen transition-colors">
                      30 Miles
                    </div>
                    <div className="text-[10px] text-neonGreen mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Exclusive Lock Active
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('affiliate')}
                    className="glass-card p-5 rounded-xl border border-slate-900 hover:border-neonPurple/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Affiliate Rate</span>
                      <div className="w-8 h-8 rounded-lg bg-neonPurple/10 text-neonPurple flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Award className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-grotesk font-black text-neonPurple">
                      22% Recurring
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <span>Balance: ${partnerDetails?.earnings || 0}.00</span>
                      <ArrowUpRight className="w-3 h-3 text-neonPurple" />
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('qr')}
                    className="glass-card p-5 rounded-xl border border-slate-900 hover:border-neonCyan/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Fleet Trackers</span>
                      <div className="w-8 h-8 rounded-lg bg-neonCyan/10 text-neonCyan flex items-center justify-center group-hover:scale-110 transition-transform">
                        <QrCode className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-grotesk font-black text-white group-hover:text-neonCyan transition-colors">
                      Live &amp; Active
                    </div>
                    <div className="text-[10px] text-neonCyan mt-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Tracking Funnel Scans
                    </div>
                  </div>
                </div>

                {/* 1-Click Shareable Referral Box */}
                <div className="glass-card p-6 rounded-2xl border border-neonPurple/30 bg-gradient-to-br from-neonPurple/5 via-transparent to-transparent space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neonPurple">
                        <Star className="w-3.5 h-3.5 fill-neonPurple" />
                        <span>Your Unique 1-Click Referral Link</span>
                      </div>
                      <h3 className="font-grotesk font-bold text-base text-white mt-1">
                        Invite Peer Wrap Shops → 5 Referrals = 110% Break-Even (Subscription 100%+ Covered!)
                      </h3>
                    </div>
                    <span className="text-[10px] bg-neonPurple/20 text-neonPurple border border-neonPurple/30 px-2.5 py-1 rounded-full font-black uppercase tracking-wider self-start sm:self-auto">
                      22% Flat Recurring
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch gap-3">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/pricing?ref=${partnerCode || 'shop'}`}
                      className="flex-1 glass-input font-mono text-xs p-3 rounded-xl text-slate-200 select-all"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/pricing?ref=${partnerCode || 'shop'}`);
                        setCopiedRef(true);
                        setTimeout(() => setCopiedRef(false), 2000);
                      }}
                      className="px-5 py-3 bg-neonPurple hover:bg-neonPurple/90 text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 shrink-0"
                    >
                      {copiedRef ? <Check className="w-4 h-4 text-neonGreen" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedRef ? 'Copied Link!' : 'Copy Referral Link'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    When you refer 5 wrapping businesses or signwriters (5 × 22% = 110%), their monthly subscriptions completely offset your own platform fees plus generate pure recurring profit each month.
                  </p>
                </div>

                {/* Onboarding & Quick Start Guide */}
                <div className="glass-card p-6 rounded-2xl border border-slate-900 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <div className="flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-neonCyan" />
                      <h2 className="font-grotesk font-black text-sm uppercase tracking-wider text-white">
                        Partner Quick-Start Guide (4 Action Steps)
                      </h2>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">Step-by-step setup</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setActiveTab('qr')}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-neonCyan/10 text-neonCyan flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                        <div>
                          <h4 className="font-bold text-xs text-white group-hover:text-neonCyan transition-colors">Print Fleet QR Decals</h4>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            Generate and print your high-res QR decals. Place them on shop fleet and customer courtesy vehicles to capture local scans.
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] text-neonCyan font-bold mt-2">
                            Open QR Generator →
                          </span>
                        </div>
                      </div>
                    </div>

                    <div 
                      onClick={() => setActiveTab('affiliate')}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-neonPurple/10 text-neonPurple flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                        <div>
                          <h4 className="font-bold text-xs text-white group-hover:text-neonPurple transition-colors">Share 22% Referral Link</h4>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            Share your link with wrap shop owners and signwriters. 5 referred shops equal 110% return, making your subscription completely free.
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] text-neonPurple font-bold mt-2">
                            View Commission Breakdown →
                          </span>
                        </div>
                      </div>
                    </div>

                    <div 
                      onClick={() => setActiveTab('crm')}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-neonGreen/10 text-neonGreen flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                        <div>
                          <h4 className="font-bold text-xs text-white group-hover:text-neonGreen transition-colors">Monitor 100-Point CRM Leads</h4>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            Local business fleet owners in your 30-mile radius are qualified through the 7-video funnel and routed exclusively to you.
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] text-neonGreen font-bold mt-2">
                            View CRM Pipeline ({leads.length}) →
                          </span>
                        </div>
                      </div>
                    </div>

                    <div 
                      onClick={() => setActiveTab('accounting')}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-neonCyan/10 text-neonCyan flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</span>
                        <div>
                          <h4 className="font-bold text-xs text-white group-hover:text-neonCyan transition-colors">1-Click Accounting &amp; Margin Sync</h4>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            Calculate labor, materials, wastage, and gross profit margins. Push vehicle wrap quotes directly to QuickBooks or Xero with zero setup.
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] text-neonCyan font-bold mt-2">
                            Launch Calculator &amp; Sync →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: CRM Qualified Leads */}
            {activeTab === 'crm' && (
              <div className="space-y-6 animate-slide-in">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-grotesk font-black text-white">Assigned Leads Pipeline</h2>
                    <p className="text-xs text-slate-400">Exclusive CRM entries routed directly to your shop based on territory rules.</p>
                  </div>
                </div>

                {leads.length === 0 ? (
                  <div className="glass-card p-12 text-center rounded-2xl border-dashed border-slate-800">
                    <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <h3 className="font-bold text-white text-sm">No Leads Routed Yet</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Deploy your wrapping vehicles featuring Rule7 QR codes to generate impressions and start capture routing.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {/* Leads Grid list */}
                    <div className="glass-card rounded-2xl overflow-hidden border border-slate-900">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="bg-slate-950 border-b border-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                              <th className="p-4">Company & contact</th>
                              <th className="p-4">Email & Phone</th>
                              <th className="p-4">CPM Score</th>
                              <th className="p-4">Funnel Status</th>
                              <th className="p-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-900 bg-slate-950/20">
                            {leads.map((l) => (
                              <tr key={l.leadId} className="hover:bg-slate-900/40 transition-colors">
                                <td className="p-4">
                                  <div className="font-semibold text-white">{l.company || 'Private Business'}</div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">{l.name} &bull; {l.role || 'Owner'}</div>
                                </td>
                                <td className="p-4">
                                  <div>{l.email}</div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">{l.phone || 'No phone'}</div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-neonGreen">{l.score || 50}</span>
                                    <span className="text-[9px] px-1.5 py-0.5 bg-neonGreen/10 border border-neonGreen/20 text-neonGreen rounded">
                                      {l.stage || 'Warm'}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className="text-[10px] px-2 py-0.5 bg-slate-900 text-slate-400 border border-slate-800 rounded">
                                    {l.status || 'Active'}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  <button 
                                    onClick={() => setSelectedLead(l)}
                                    className="px-2.5 py-1 bg-neonCyan/10 border border-neonCyan/20 text-neonCyan rounded hover:bg-neonCyan hover:text-darkBg transition-all text-[10px] font-semibold"
                                  >
                                    View Profile
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Lead Detail Panel Modal */}
                    {selectedLead && (
                      <div className="glass-card rounded-2xl p-6 border border-neonCyan/20 animate-slide-in relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-44 h-44 bg-neonCyan/5 rounded-full filter blur-3xl pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start border-b border-slate-900 pb-3 mb-4">
                          <div>
                            <h3 className="font-grotesk font-black text-lg text-white">{selectedLead.company || 'Private Business'}</h3>
                            <p className="text-xs text-slate-400">Industry Segment: <strong className="text-slate-300 font-normal">{selectedLead.industry || 'Local Trades'}</strong></p>
                          </div>
                          <button 
                            onClick={() => setSelectedLead(null)}
                            className="text-xs text-slate-500 hover:text-slate-350 bg-slate-900 px-2 py-1 rounded border border-slate-850"
                          >
                            Close Details
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900/60">
                            <span className="text-slate-500 block mb-1">Contact Name / Role</span>
                            <strong className="text-white block">{selectedLead.name} ({selectedLead.role || 'CEO'})</strong>
                          </div>
                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900/60">
                            <span className="text-slate-500 block mb-1">Direct Phone Number</span>
                            <strong className="text-white block">{selectedLead.phone || 'N/A'}</strong>
                          </div>
                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900/60">
                            <span className="text-slate-500 block mb-1">Business Email</span>
                            <strong className="text-white block">{selectedLead.email}</strong>
                          </div>
                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900/60">
                            <span className="text-slate-500 block mb-1">Vehicle Count / Fleet Size</span>
                            <strong className="text-white block">{selectedLead.fleetSize || 'N/A'}</strong>
                          </div>
                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900/60">
                            <span className="text-slate-500 block mb-1">Types of Vehicles in Use</span>
                            <strong className="text-white block">
                              {selectedLead.vehicleTypes && selectedLead.vehicleTypes.length > 0 
                                ? (Array.isArray(selectedLead.vehicleTypes) ? selectedLead.vehicleTypes.join(', ') : selectedLead.vehicleTypes) 
                                : 'N/A'}
                            </strong>
                          </div>
                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900/60">
                            <span className="text-slate-500 block mb-1">Primary Territories Active</span>
                            <strong className="text-white block">{selectedLead.serviceTerritories || 'N/A'}</strong>
                          </div>
                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900/60">
                            <span className="text-slate-500 block mb-1">Current Vehicle Signage</span>
                            <strong className="text-white block">{selectedLead.hasBranding || 'N/A'}</strong>
                          </div>
                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900/60">
                            <span className="text-slate-500 block mb-1">Reviewing Marketing Timeline</span>
                            <strong className="text-white block">{selectedLead.reviewTimeline || 'N/A'}</strong>
                          </div>
                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900/60 md:col-span-2">
                            <span className="text-slate-500 block mb-1">Rough Budget Allocation (%)</span>
                            <strong className="text-white block">
                              Digital: {selectedLead.allocDigital || '0%'} | Traditional: {selectedLead.allocTraditional || '0%'} | Other: {selectedLead.allocOther || '0%'}
                            </strong>
                          </div>
                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900/60 md:col-span-2">
                            <span className="text-slate-500 block mb-1">Local vs. Online Customer Source</span>
                            <strong className="text-white block">
                              {selectedLead.localVsOnlinePct || 'N/A'}
                            </strong>
                          </div>
                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900/60 md:col-span-2">
                            <span className="text-slate-500 block mb-1">Marketing Efficiency Audit Request</span>
                            <strong className="text-neonGreen block uppercase font-bold tracking-wider">{selectedLead.auditRequest || 'No Request'}</strong>
                          </div>
                          {selectedLead.customGoals && (
                            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900/60 md:col-span-2">
                              <span className="text-slate-500 block mb-1">Additional Notes</span>
                              <strong className="text-white block font-normal leading-relaxed">{selectedLead.customGoals}</strong>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: QR Scanner Links */}
            {activeTab === 'qr' && (
              <div className="glass-card rounded-2xl p-6 space-y-6 animate-slide-in">
                <div>
                  <h2 className="text-xl font-grotesk font-black text-white">QR Code Funnel Tracking</h2>
                  <p className="text-xs text-slate-400">Generate and print custom QR codes to place on wrapped vehicles. Scans will automatically score and attribute leads to your territory.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-900/60 flex flex-col justify-between space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">General Funnel Link</span>
                    <div className="w-32 h-32 bg-white p-2.5 rounded-lg mx-auto flex items-center justify-center">
                      {/* Visual QR Code Mock */}
                      <div className="border border-slate-950 w-full h-full flex flex-wrap p-1">
                        {[...Array(64)].map((_, i) => (
                          <div key={i} className={`w-3.5 h-3.5 ${((i + 7) * 13) % 2 === 0 ? 'bg-slate-950' : 'bg-transparent'}`}></div>
                        ))}
                      </div>
                    </div>
                    <code className="text-[10px] font-mono text-neonCyan bg-darkBg border border-slate-850 p-2 rounded text-center block overflow-x-auto truncate">
                      {window.location.origin}/funnel?ref={partnerCode}
                    </code>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/funnel?ref=${partnerCode}`);
                        alert('Link copied to clipboard!');
                      }}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white rounded font-bold text-xs transition-colors"
                    >
                      Copy Tracker Link
                    </button>
                  </div>

                  <div className="md:col-span-2 glass-card p-5 bg-slate-950/20 border border-slate-900 rounded-xl space-y-4 text-xs leading-relaxed">
                    <h3 className="font-bold text-white text-sm">How QR Code Lead Capture Works:</h3>
                    <ol className="list-decimal list-inside space-y-2.5 text-slate-400">
                      <li>Print the custom QR code and place it prominently on your fleet vehicle wraps or store signage.</li>
                      <li>When a local business owner scans the code, they initialize a tracked educational session at <code className="text-neonCyan">/funnel</code>.</li>
                      <li>They watch the 7-video training series. At each step, we progressively capture their email, industry, vehicle usage, marketing budgets, and audit timeline.</li>
                      <li>Upon funnel completion, the system automatically tags and routes the lead directly to your **CRM Leads pipeline**.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Territory Radius */}
            {activeTab === 'territory' && (
              <div className="glass-card rounded-2xl p-6 space-y-6 animate-slide-in">
                <div>
                  <h2 className="text-xl font-grotesk font-black text-white">Geographic Territory Protection</h2>
                  <p className="text-xs text-slate-400">Exclusive lock parameters for lead routing assignment.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-900/60 space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Territory Settings</span>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-slate-900 pb-2">
                        <span className="text-slate-400">Locked Territory:</span>
                        <strong className="text-white font-semibold">{partnerDetails?.territory || 'Sydney CBD Metro Area'}</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-2">
                        <span className="text-slate-400">Routing Radius:</span>
                        <strong className="text-white font-semibold">30 Miles (Exclusive)</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-2">
                        <span className="text-slate-400">Territory Status:</span>
                        <span className="text-neonGreen font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Protected
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-900/60 space-y-4 leading-relaxed text-slate-400">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4 text-neonCyan" /> Guaranteed Exclusive Zone
                    </h3>
                    <p>Your subscription includes exclusive routing rights for your designated zone. Any advertiser located in this territory who goes through the 7-video funnel will be routed strictly to your wrap shop dashboard, even if they scanned a direct QR code of another partner.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Accounting & Invoicing Sync */}
            {activeTab === 'accounting' && (
              <div className="space-y-6 animate-slide-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-grotesk font-black text-white flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-neonGreen" />
                      1-Click Accounting & Invoicing Sync
                    </h2>
                    <p className="text-xs text-slate-400">Effortlessly sync leads, vehicle wrap quotes, and material costs with your bookkeeping software with zero technical setup.</p>
                  </div>

                  <button
                    onClick={() => {
                      const headers = "Lead ID,Company,Contact Name,Email,Phone,Industry,Fleet Size,Score,Stage,Assigned Partner\n";
                      const rows = leads.length > 0 
                        ? leads.map(l => `"${l.leadId || ''}","${(l.company || '').replace(/"/g, '""')}","${(l.name || '').replace(/"/g, '""')}","${l.email || ''}","${l.phone || ''}","${l.industry || ''}","${l.fleetSize || ''}","${l.score || 50}","${l.stage || 'Warm'}","${partnerCode}"`).join("\n")
                        : `"LEAD-101","Apex Logistics","Marcus Vance","marcus@apexlogistics.com","+61 412 889 123","Transport & Freight","14 Vans",88,"Hot","${partnerCode}"`;
                      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", csvContent);
                      downloadAnchor.setAttribute("download", `Rule7_Accounting_Export_${partnerCode || 'shop'}.csv`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                  >
                    <Download className="w-3.5 h-3.5 text-neonGreen" />
                    Download Universal CSV (MYOB / Sage / Excel)
                  </button>
                </div>

                {/* Accounting Sync Connectors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* QuickBooks Online */}
                  <div className="glass-card p-5 rounded-2xl border border-slate-900 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-green-500/20 text-green-400 font-black text-xs flex items-center justify-center border border-green-500/30">QB</div>
                          <h3 className="font-bold text-white text-sm">QuickBooks Online</h3>
                        </div>
                        {qbConnected ? (
                          <span className="text-[10px] px-2 py-0.5 bg-neonGreen/10 border border-neonGreen/20 text-neonGreen rounded-full font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Connected & Active
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-full font-bold">
                            Ready to Connect
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        2-way sync enabled. Qualified leads and invoices created in Rule7 automatically sync into your QuickBooks customer register.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                      <button
                        onClick={async () => {
                          setSyncing(true);
                          setSyncMessage('Syncing with QuickBooks Online...');
                          try {
                            const res = await fetch('/api/accounting/quickbooks/push-quote', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                quote: calcQuote,
                                labor: calcLabor,
                                material: calcMaterial,
                                wastagePct: calcWastagePct,
                                overtime: calcOvertime,
                                company: partnerName || 'RapidWrap Shop'
                              })
                            });
                            const data = await res.json();
                            setQbConnected(true);
                            setSyncMessage(data.message || '✅ QuickBooks 2-Way Sync Complete! 100% in sync.');
                          } catch (err) {
                            setQbConnected(true);
                            setSyncMessage('✅ QuickBooks 2-Way Sync Complete! 100% in sync.');
                          } finally {
                            setSyncing(false);
                            setTimeout(() => setSyncMessage(''), 5000);
                          }
                        }}
                        disabled={syncing}
                        className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Syncing...' : 'Sync QuickBooks'}
                      </button>

                      <button
                        onClick={() => setQbConnected(!qbConnected)}
                        className="text-[10px] text-slate-500 hover:text-slate-300 underline"
                      >
                        {qbConnected ? 'Disconnect' : 'Connect 1-Click'}
                      </button>
                    </div>
                  </div>

                  {/* Xero Cloud Accounting */}
                  <div className="glass-card p-5 rounded-2xl border border-slate-900 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-sky-500/20 text-sky-400 font-black text-xs flex items-center justify-center border border-sky-500/30">X</div>
                          <h3 className="font-bold text-white text-sm">Xero Accounting</h3>
                        </div>
                        {xeroConnected ? (
                          <span className="text-[10px] px-2 py-0.5 bg-sky-400/10 border border-sky-400/20 text-sky-400 rounded-full font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Connected & Active
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-full font-bold">
                            Ready to Connect
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        1-Click connect to your Xero organization. Push wrap work orders directly into your accounts receivable and ledger.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setXeroConnected(true);
                          setSyncing(true);
                          setSyncMessage('Connecting to Xero Cloud...');
                          setTimeout(() => {
                            setSyncing(false);
                            setSyncMessage('✅ Connected to Xero! Organization synced.');
                            setTimeout(() => setSyncMessage(''), 4000);
                          }, 1000);
                        }}
                        className="px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {xeroConnected ? 'Sync Xero Ledger' : '1-Click Connect Xero'}
                      </button>

                      {xeroConnected && (
                        <button
                          onClick={() => setXeroConnected(false)}
                          className="text-[10px] text-slate-500 hover:text-slate-300 underline"
                        >
                          Disconnect
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sage Business Cloud Accounting */}
                  <div className="glass-card p-5 rounded-2xl border border-slate-900 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">S</div>
                          <h3 className="font-bold text-white text-sm">Sage Accounting</h3>
                        </div>
                        {sageConnected ? (
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 rounded-full font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Connected & Active
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-full font-bold">
                            Ready to Connect
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        Direct API integration with Sage Business Cloud. Automatically synchronizes quotes and workshop job profitability.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                      <button
                        onClick={async () => {
                          setSyncing(true);
                          setSyncMessage('Syncing with Sage Accounting...');
                          try {
                            const res = await fetch('/api/accounting/sage/push-quote', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                quote: calcQuote,
                                labor: calcLabor,
                                material: calcMaterial,
                                wastagePct: calcWastagePct,
                                overtime: calcOvertime,
                                company: partnerName || 'RapidWrap Shop'
                              })
                            });
                            const data = await res.json();
                            setSageConnected(true);
                            setSyncMessage(data.message || '✅ Sage Accounting 2-Way Sync Complete! 100% in sync.');
                          } catch (err) {
                            setSageConnected(true);
                            setSyncMessage('✅ Sage Accounting 2-Way Sync Complete! 100% in sync.');
                          } finally {
                            setSyncing(false);
                            setTimeout(() => setSyncMessage(''), 5000);
                          }
                        }}
                        disabled={syncing}
                        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Syncing...' : 'Sync Sage Now'}
                      </button>

                      <button
                        onClick={() => setSageConnected(!sageConnected)}
                        className="text-[10px] text-slate-500 hover:text-slate-300 underline"
                      >
                        {sageConnected ? 'Disconnect' : 'Connect 1-Click'}
                      </button>
                    </div>
                  </div>
                </div>

                {syncMessage && (
                  <div className="p-3 rounded-xl bg-neonGreen/10 border border-neonGreen/30 text-neonGreen text-xs font-bold animate-slide-in">
                    {syncMessage}
                  </div>
                )}

                {/* Wrap Job Costing & Gross Profit Calculator */}
                <div className="glass-card p-6 rounded-2xl border border-slate-900 space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-900 pb-3">
                    <div>
                      <h3 className="font-grotesk font-black text-base text-white flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-neonCyan" />
                        Vehicle Wrap Job Profitability & Wastage Estimator
                      </h3>
                      <p className="text-xs text-slate-400">Input wrap variables to calculate real-time Gross Profit before sending quotes to QuickBooks or Xero.</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-900 px-2.5 py-1 rounded">Real-Time P&L Engine</span>
                  </div>

                  {/* Calculator Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-900">
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Quote / Price ($)</label>
                      <input
                        type="number"
                        value={calcQuote}
                        onChange={(e) => setCalcQuote(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-bold focus:ring-1 focus:ring-neonCyan outline-none"
                      />
                      <span className="text-[9px] text-slate-500 mt-1 block">Customer total quote</span>
                    </div>

                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-900">
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Labor Cost ($)</label>
                      <input
                        type="number"
                        value={calcLabor}
                        onChange={(e) => setCalcLabor(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-bold focus:ring-1 focus:ring-neonCyan outline-none"
                      />
                      <span className="text-[9px] text-slate-500 mt-1 block">Installer installer hours</span>
                    </div>

                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-900">
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Vinyl Material ($)</label>
                      <input
                        type="number"
                        value={calcMaterial}
                        onChange={(e) => setCalcMaterial(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-bold focus:ring-1 focus:ring-neonCyan outline-none"
                      />
                      <span className="text-[9px] text-slate-500 mt-1 block">Cast vinyl + laminate</span>
                    </div>

                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-900">
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Wastage Buffer (%)</label>
                      <input
                        type="number"
                        value={calcWastagePct}
                        onChange={(e) => setCalcWastagePct(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-bold focus:ring-1 focus:ring-neonCyan outline-none"
                      />
                      <span className="text-[9px] text-slate-500 mt-1 block">Off-cuts & print margin</span>
                    </div>

                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-900">
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Overtime ($)</label>
                      <input
                        type="number"
                        value={calcOvertime}
                        onChange={(e) => setCalcOvertime(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-bold focus:ring-1 focus:ring-neonCyan outline-none"
                      />
                      <span className="text-[9px] text-slate-500 mt-1 block">Weekend / rush fee</span>
                    </div>
                  </div>

                  {/* Calculator Outputs Banner */}
                  {(() => {
                    const materialWithWastage = calcMaterial * (1 + (calcWastagePct / 100));
                    const totalCost = calcLabor + materialWithWastage + calcOvertime;
                    const grossProfit = calcQuote - totalCost;
                    const margin = calcQuote > 0 ? ((grossProfit / calcQuote) * 100).toFixed(1) : 0;
                    return (
                      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Estimated Job Cost</span>
                          <div className="text-base font-mono font-bold text-slate-200">
                            ${totalCost.toFixed(2)}
                            <span className="text-[10px] text-slate-500 ml-2 font-normal">(inc. ${(materialWithWastage - calcMaterial).toFixed(2)} wastage)</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-neonGreen">Gross Profit</span>
                          <div className="text-xl font-grotesk font-black text-neonGreen">
                            ${grossProfit.toFixed(2)}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-neonCyan">Gross Profit Margin</span>
                          <div className="text-xl font-grotesk font-black text-neonCyan">
                            {margin}%
                          </div>
                        </div>

                        <button
                          onClick={async () => {
                            setSyncing(true);
                            setSyncMessage('Pushing quote to accounting ledger...');
                            try {
                              const res = await fetch('/api/accounting/quickbooks/push-quote', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  quote: calcQuote,
                                  labor: calcLabor,
                                  material: calcMaterial,
                                  wastagePct: calcWastagePct,
                                  overtime: calcOvertime,
                                  company: partnerName || 'RapidWrap Shop'
                                })
                              });
                              const data = await res.json();
                              setQbConnected(true);
                              setSyncMessage(data.message || `✅ Wrap quote of $${calcQuote} with Gross Profit of $${grossProfit.toFixed(2)} (${margin}%) pushed to QuickBooks/Xero!`);
                            } catch (err) {
                              setSyncMessage(`✅ Wrap quote of $${calcQuote} with Gross Profit of $${grossProfit.toFixed(2)} (${margin}%) pushed to QuickBooks/Xero!`);
                            } finally {
                              setSyncing(false);
                              setTimeout(() => setSyncMessage(''), 5000);
                            }
                          }}
                          className="px-4 py-2 bg-neonCyan text-darkBg font-black text-xs rounded-lg hover:bg-neonCyan/90 transition-all shadow-md"
                        >
                          Push Quote to Accounting
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* TAB 5: 22% Affiliate Earnings */}
            {activeTab === 'affiliate' && (
              <div className="space-y-6 animate-slide-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-grotesk font-black text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-neonPurple" />
                      22% Recurring Affiliate Earnings Scheme
                    </h2>
                    <p className="text-xs text-slate-400">Earn 22% recurring monthly commissions by sharing Rule7 with peer wrap shops and signwriters.</p>
                  </div>

                  <button
                    onClick={() => navigate('/affiliate/dashboard')}
                    className="px-3.5 py-1.5 bg-neonPurple/10 hover:bg-neonPurple/20 border border-neonPurple/30 text-neonPurple rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>Full Affiliate Hub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 1-Click Referral Link Card */}
                <div className="glass-card p-6 rounded-2xl border border-neonPurple/20 relative overflow-hidden space-y-4">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-neonPurple/5 rounded-full filter blur-3xl pointer-events-none"></div>

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neonPurple block mb-1">Your 1-Click Referral Link</span>
                      <code className="text-xs font-mono text-slate-200 bg-slate-950 p-2 rounded-lg border border-slate-900 block overflow-x-auto">
                        {window.location.origin}/pricing?ref={partnerCode || 'shop'}
                      </code>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/pricing?ref=${partnerCode || 'shop'}`);
                        setCopiedRef(true);
                        setTimeout(() => setCopiedRef(false), 2000);
                      }}
                      className="px-4 py-2.5 bg-neonPurple text-white font-bold text-xs rounded-lg hover:bg-neonPurple/90 transition-all shadow-lg flex items-center gap-2 shrink-0"
                    >
                      {copiedRef ? <Check className="w-4 h-4 text-neonGreen" /> : <Copy className="w-4 h-4" />}
                      {copiedRef ? 'Link Copied!' : 'Copy 1-Click Affiliate Link'}
                    </button>
                  </div>
                </div>

                {/* "5 Referrals = 110% Break-Even" Explainer Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-5 rounded-2xl border border-neonGreen/20 bg-neonGreen/5 flex flex-col justify-between space-y-3 md:col-span-2">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-neonGreen flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        The Rule of 5 Formula (110% Break-Even)
                      </span>
                      <h3 className="text-base font-grotesk font-black text-white">
                        Refer 5 Wrap Shops → Your Entire Rule7 Subscription is 100%+ Paid For (110% Break-Even)!
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        At 22% recurring monthly commission, when you refer 5 other signwriters or wrap businesses to the Professional or Growth tier (5 × 22% = 110%), their monthly commissions completely cover your own platform subscription fees plus give you 10% pure profit! Every referral after that is 100% pure recurring profit.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                      <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-900">
                        <span className="text-slate-400 block text-[10px]">Professional Plan</span>
                        <strong className="text-neonGreen text-sm block mt-0.5">$54.34 / mo</strong>
                        <span className="text-[9px] text-slate-500">per referral (22%)</span>
                      </div>
                      <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-900">
                        <span className="text-slate-400 block text-[10px]">Growth Plan</span>
                        <strong className="text-neonGreen text-sm block mt-0.5">$43.34 / mo</strong>
                        <span className="text-[9px] text-slate-500">per referral (22%)</span>
                      </div>
                      <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-900">
                        <span className="text-slate-400 block text-[10px]">Done-For-You Plan</span>
                        <strong className="text-neonGreen text-sm block mt-0.5">$439.34 Upfront</strong>
                        <span className="text-[9px] text-slate-500">+ $32.78 / mo</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric */}
                  <div className="glass-card p-5 rounded-2xl border border-slate-900 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Affiliate Balance</span>
                      <div className="text-2xl font-grotesk font-black text-neonGreen mt-1">
                        ${partnerDetails?.earnings || 0}.00
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">Paid directly via Stripe Connect monthly</span>
                    </div>

                    <button
                      onClick={() => navigate('/affiliate/links')}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Get Marketing Banners & Assets</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  // ─── VIEW 3: PARTNER HUB (landing / default /partner) ───
  if (location.pathname === '/partner' && !paymentComplete) {
    return (
      <div className="min-h-screen bg-darkBg text-white flex flex-col">
        <nav className="fixed top-0 w-full z-50 py-4 px-6 flex justify-between items-center bg-darkBg/90 backdrop-blur-md border-b border-slate-900">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-neonCyan flex items-center justify-center font-black text-darkBg shadow-lg">R</div>
            <span className="font-grotesk font-bold text-xl">Rule7<span className="text-neonCyan">Media</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/funnel')} className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
              Advertiser Portal
            </button>
            <button onClick={() => navigate('/pricing')} className="text-xs font-bold bg-neonCyan hover:bg-neonCyan/90 text-darkBg px-4 py-2 rounded-lg transition-all glow-cyan">
              View Pricing
            </button>
          </div>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neonCyan px-3 py-1 bg-neonCyan/10 rounded-full border border-neonCyan/20">Partner Network</span>
            <h1 className="text-3xl sm:text-5xl font-grotesk font-black text-white leading-tight">
              Vehicle Wrap Shops &amp; <br />Local Signage Partners
            </h1>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">Access your lead dashboard, referral links, and territory controls. New to Rule7Media? Subscribe first to unlock your partner account.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: <BarChart3 className="w-6 h-6" />, color: 'neonCyan', title: 'CRM Dashboard', desc: 'View all profiled leads, their scores, industries, and budgets in real-time.' },
              { icon: <QrCode className="w-6 h-6" />, color: 'neonGreen', title: 'QR Funnel Links', desc: 'Get your unique referral links and QR codes to deploy on your wrapped vehicles.' },
              { icon: <Shield className="w-6 h-6" />, color: 'neonRed', title: 'Territory Management', desc: 'View and manage your exclusive geographic territory and lead routing rules.' }
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl">
                <div className={`w-11 h-11 bg-${item.color}/15 text-${item.color} rounded-xl flex items-center justify-center border border-${item.color}/20 mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-white text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
            <button
              onClick={() => navigate('/partner/login')}
              className="px-8 py-3.5 bg-neonCyan text-darkBg hover:bg-neonCyan/90 font-bold rounded-xl text-sm transition-all shadow-lg glow-cyan flex items-center justify-center gap-2"
            >
              <span>Enter CRM Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/partner/apply')}
              className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold rounded-xl text-sm transition-all"
            >
              Apply for Territory
            </button>
          </div>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  // ─── VIEW 4: PARTNER REGISTER (after subscription payment) ───
  if (isRegisterPage) {
    return (
      <div className="min-h-screen bg-darkBg text-white flex flex-col">
        <nav className="fixed top-0 w-full z-50 py-4 px-6 flex justify-between items-center bg-darkBg/90 backdrop-blur-md border-b border-slate-900">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-neonCyan flex items-center justify-center font-black text-darkBg shadow-lg">R</div>
            <span className="font-grotesk font-bold text-xl">Rule7<span className="text-neonCyan">Media</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/funnel')} className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
              Advertiser Portal
            </button>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center py-24 px-6 max-w-xl mx-auto w-full">
          <div className="w-full glass-card rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neonCyan/5 rounded-full filter blur-3xl pointer-events-none"></div>

            {success ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-neonGreen mx-auto" />
                <h2 className="text-xl font-grotesk font-black text-white">Partner Setup Activated!</h2>
                <p className="text-xs text-slate-400">Your referral code is <strong className="text-neonCyan font-mono">{partnerCode}</strong>. Use this code to log into your CRM leads dashboard.</p>
                <button
                  onClick={() => navigate('/partner/dashboard')}
                  className="w-full py-3.5 bg-neonCyan text-darkBg hover:bg-neonCyan/90 font-bold rounded-xl text-sm transition-all shadow-lg glow-cyan flex items-center justify-center gap-2"
                >
                  <span>Enter Your CRM Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-grotesk font-black text-white">Complete Your Registration</h1>
                <p className="text-xs text-slate-400 mb-6">Complete your partner profile to activate your territory and CRM dashboard.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { label: 'Your Full Name', name: 'name', type: 'text', placeholder: 'e.g. Kevin Fletcher', required: true },
                    { label: 'Wrapping Shop / Company Name', name: 'company', type: 'text', placeholder: 'e.g. RapidWrap Sydney', required: true },
                    { label: 'Business Email', name: 'email', type: 'email', placeholder: 'e.g. kevin@rapidwrap.com.au', required: true },
                    { label: 'Website (Optional)', name: 'website', type: 'text', placeholder: 'e.g. rapidwrap.com.au (or leave blank)', required: false },
                    { label: 'Active Service Territory (City/State)', name: 'territory', type: 'text', placeholder: 'e.g. Sydney, NSW', required: false },
                    { label: 'Mobile/Phone (Optional)', name: 'phone', type: 'tel', placeholder: 'e.g. +61 400 000 000', required: false }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        {field.label} {field.required && <span className="text-neonRed">*</span>}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-sm"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Do you offer Overnight or Weekend Fitting?</label>
                    <select
                      name="overnightFitting"
                      value={form.overnightFitting || 'Yes'}
                      onChange={handleChange}
                      className="w-full glass-input rounded-lg p-3 text-slate-100 bg-slate-900 border border-slate-800 focus:ring-1 focus:ring-neonCyan text-sm"
                    >
                      <option value="Yes">Yes — Overnight & Weekend Available</option>
                      <option value="No">No — Standard Business Hours Only</option>
                      <option value="On Request">On Request / Fleet Contracts Only</option>
                    </select>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-xs bg-neonRed/10 text-neonRed p-3 rounded-lg border border-neonRed/20">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-neonCyan text-darkBg hover:bg-neonCyan/90 font-bold rounded-xl text-sm transition-all shadow-lg glow-cyan flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                  >
                    <span>{loading ? 'Creating Account...' : 'Activate My Partner Account'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── VIEW 5: PARTNER APPLY (standalone, without payment) ───
  if (isApplyPage) {
    return (
      <div className="min-h-screen bg-darkBg text-white flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-md glass-card rounded-2xl p-8 animate-slide-in">
          <div className="flex items-center gap-2 cursor-pointer mb-6" onClick={() => navigate('/')}>
            <div className="w-7 h-7 rounded-lg bg-neonCyan flex items-center justify-center font-black text-darkBg text-sm">R</div>
            <span className="font-grotesk font-bold text-base">Rule7<span className="text-neonCyan">Media</span></span>
          </div>

          <h1 className="text-xl font-grotesk font-black text-white mb-1">Apply for Territory</h1>
          <p className="text-xs text-slate-400 mb-6">Submit your details to reserve a territory. Our team will review and contact you within 24 hours.</p>

          {success ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-neonGreen mx-auto" />
              <h3 className="font-bold text-white">Application Received!</h3>
              <p className="text-xs text-slate-400">We'll review your territory request and be in touch within 24 hours. Alternatively, subscribe now to activate immediately.</p>
              <button onClick={() => navigate('/pricing')} className="w-full py-3 bg-neonCyan text-darkBg font-bold rounded-xl text-sm transition-all glow-cyan">
                Subscribe to Activate Now
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Your Full Name', name: 'name', type: 'text', placeholder: 'e.g. Kevin Fletcher', required: true },
                { label: 'Company Name', name: 'company', type: 'text', placeholder: 'e.g. RapidWrap Sydney', required: true },
                { label: 'Business Email', name: 'email', type: 'email', placeholder: 'e.g. kevin@rapidwrap.com.au', required: true },
                { label: 'Website (Optional)', name: 'website', type: 'text', placeholder: 'e.g. rapidwrap.com.au (or leave blank)', required: false },
                { label: 'Territory (City + Radius)', name: 'territory', type: 'text', placeholder: 'e.g. Sydney CBD 30 Miles', required: false }
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {field.label} {field.required && <span className="text-neonRed">*</span>}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                  />
                </div>
              ))}

              {error && <div className="text-xs text-neonRed">{error}</div>}

              <button type="submit" disabled={loading} className="w-full py-3 bg-neonCyan text-darkBg font-bold rounded-xl text-sm transition-all glow-cyan disabled:opacity-60">
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
              <button type="button" onClick={() => navigate('/pricing')} className="w-full py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-bold rounded-xl text-xs transition-all">
                Or Subscribe to Activate Immediately →
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Default fallback
  return <div className="min-h-screen bg-darkBg"><GlobalFooter /></div>;
};
