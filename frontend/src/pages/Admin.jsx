import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Cell
} from 'recharts';
import { 
  Users, BarChart3, TrendingUp, DollarSign, Search, Shield, Filter, MapPin, 
  ChevronRight, ChevronDown, Calendar, ArrowUpRight, Zap, RefreshCw, Send, CheckCircle2, Lock, Eye,
  Flame, Sparkles, HelpCircle, Menu, X, LogOut, Phone, Mail
} from 'lucide-react';
import { GlobalFooter } from '../components/GlobalFooter';

// 25 Local Industry Categories
const LOCAL_INDUSTRIES = [
  "Trades & Home Services (Plumbing, Electrical, HVAC, Roofing)",
  "Storage, Logistics and Removalists",
  "Automotive Services & Detailing",
  "IT, Cyber & Tech Support Services",
  "Retail, Commercial & Hospitality",
  "Health, Medical & Fitness Clinics",
  "Real Estate & Property Management",
  "Construction, Scaffolding & Civil Works",
  "Landscaping, Tree Lopping & Fencing",
  "Cleaning & Facility Services",
  "Security, Locksmiths & Fire Safety",
  "Catering, Events & Mobile Hospitality",
  "Pest Control & Hygiene Services",
  "Legal, Accounting & Financial Advisory",
  "Solar, Energy & Electrical Infrastructure",
  "Waste Management & Recycling",
  "Veterinary & Mobile Pet Services",
  "Painting & Surface Coating",
  "Glazing, Windows & Doors",
  "Telecommunications & Network Cabling",
  "Heavy Equipment & Machinery Hire",
  "Agriculture, Farming & Rural Services",
  "Marine & Boating Services",
  "Education, Tutoring & Training",
  "Transportation, Couriers & Last-Mile Delivery"
];

// 19 Automotive Sector Niches
const AUTOMOTIVE_SECTORS = [
  "Vehicle Dealerships (New & Used)",
  "Mechanical Workshops & Auto Repair",
  "Panel Beating & Smash Repairs",
  "Auto Detailing & Paint Protection (PPF)",
  "Tyre, Wheel & Alignment Centres",
  "Auto Electrical & Diagnostic Specialists",
  "Windscreen & Auto Glass Replacement",
  "Towing & Roadside Emergency Fleets",
  "Performance, Tuning & Dyno Tuning",
  "Car Audio, Security & Accessories",
  "4WD, Off-Road & Camping Fitouts",
  "Commercial Fleet Maintenance & Management",
  "Car Rental, Hire & Share Fleets",
  "Mobile Mechanics & On-Site Servicing",
  "Auto Dismantlers & Recyclers",
  "Mufflers, Exhausts & Brakes Specialists",
  "Transmission & Drivetrain Centres",
  "Air Conditioning & Heating Auto Services",
  "Motorcycle & Powersports Dealerships"
];

export const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: leadParamId } = useParams();
  const { liveFeed, connected } = useSocket();

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('r7_admin_logged_in') === 'true');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const loggedInPartnerCode = '';

  // Core Data States
  const [leads, setLeads] = useState([]);
  const [affiliates, setAffiliates] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Filtering & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterAffiliate, setFilterAffiliate] = useState('');
  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
  const [industrySearchTerm, setIndustrySearchTerm] = useState('');
  const industryDropdownRef = useRef(null);

  // Close custom dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (industryDropdownRef.current && !industryDropdownRef.current.contains(e.target)) {
        setIsIndustryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredIndustriesList = LOCAL_INDUSTRIES.filter(ind => 
    ind.toLowerCase().includes(industrySearchTerm.toLowerCase())
  );
  const filteredAutoList = AUTOMOTIVE_SECTORS.filter(sec => 
    sec.toLowerCase().includes(industrySearchTerm.toLowerCase())
  );

  // Webhook Simulation state
  const [webhookUrl, setWebhookUrl] = useState('https://api.rapidwrapsydney.com.au/crm/webhook-catch');
  const [webhookLogs, setWebhookLogs] = useState([]);
  const [simulatingWebhook, setSimulatingWebhook] = useState(false);

  // Settings Weights
  const [scoringWeights, setScoringWeights] = useState({
    video: 40,
    budget: 20,
    fleet: 15,
    quiz: 15,
    referrer: 10
  });

  const path = location.pathname;
  const isDashboard = path === '/admin/dashboard';
  const isLeadsList = path === '/admin/leads';
  const isLeadDetail = path.startsWith('/admin/leads/');
  const isRoutingView = path === '/admin/routing';
  const isReportsView = path === '/admin/reports';
  const isSettingsView = path === '/admin/settings';

  // Fetch Data
  const fetchData = async () => {
    try {
      const leadsRes = await fetch('/api/leads');
      const leadsData = await leadsRes.json();
      setLeads(leadsData);

      const affRes = await fetch('/api/affiliates');
      const affData = await affRes.json();
      setAffiliates(affData);

      // If on detail page, fetch specific lead
      if (isLeadDetail && leadParamId) {
        const leadRes = await fetch(`/api/leads/${leadParamId}`);
        const leadData = await leadRes.json();
        if (!leadData.error) {
          setSelectedLead(leadData);
          // Auto-adjust default webhook URL depending on referrer
          if (leadData.assignedAffiliateId) {
            setWebhookUrl(`https://api.${leadData.assignedAffiliateId}.com.au/crm/webhook-receive`);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, path, leadParamId]);

  // Handle live WebSocket reload notifications
  useEffect(() => {
    if (isLoggedIn && liveFeed.length > 0) {
      // Reload lists when socket notifies new activity
      fetchData();
    }
  }, [liveFeed]);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'rule7media' || password === 'admin') {
      localStorage.setItem('r7_admin_logged_in', 'true');
      setIsLoggedIn(true);
      setLoginError('');
      navigate('/admin/dashboard');
    } else {
      setLoginError('Invalid Administrator Password.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('r7_admin_logged_in');
    setIsLoggedIn(false);
    navigate('/admin/login');
  };

  // Route Lead to Affiliate
  const handleAssignLead = async (leadId, affiliateCode) => {
    try {
      const res = await fetch('/api/leads/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, affiliateCode })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error('Error routing lead:', err);
    }
  };

  // Webhook posting simulation
  const handleTriggerWebhook = async () => {
    if (!selectedLead) return;
    setSimulatingWebhook(true);

    const payload = {
      event: 'lead_qualified',
      source: 'Rule7Media CRM Routing',
      timestamp: new Date().toISOString(),
      lead: {
        id: selectedLead.leadId,
        name: selectedLead.name,
        email: selectedLead.email,
        company: selectedLead.company,
        role: selectedLead.role,
        industry: selectedLead.industry,
        budget: selectedLead.budget,
        fleetSize: selectedLead.fleetSize,
        score: selectedLead.score,
        stage: selectedLead.stage,
        refId: selectedLead.refId,
        assignedAffiliate: selectedLead.assignedAffiliateId
      }
    };

    try {
      const res = await fetch('/api/webhooks/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl, payload })
      });
      const data = await res.json();

      setWebhookLogs(prev => [
        {
          timestamp: new Date().toLocaleTimeString(),
          url: webhookUrl,
          status: data.status,
          success: data.success,
          requestBody: payload,
          responseBody: data
        },
        ...prev
      ]);
    } catch (err) {
      console.error('Webhook simulation failed:', err);
    } finally {
      setSimulatingWebhook(false);
    }
  };

  // Global redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn && path !== '/admin/login') {
      navigate('/admin/login');
    }
  }, [isLoggedIn, path]);

  // Helper: 100-Point Lead Scoring Priority Tier Badges
  const getStageInfo = (score, stage) => {
    const numScore = Number(score) || 0;
    if (numScore >= 85 || stage === 'Hot') {
      return {
        label: 'Hot Priority',
        badge: 'bg-neonRed/15 text-neonRed border-neonRed/30',
        icon: '🔥',
        pointsText: '85-100 pts',
        tierName: 'Hot'
      };
    }
    if (numScore >= 70 || stage === 'Warm High') {
      return {
        label: 'Warm High',
        badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        icon: '⚡',
        pointsText: '70-84 pts',
        tierName: 'Warm High'
      };
    }
    if (numScore >= 55 || stage === 'Warm') {
      return {
        label: 'Warm',
        badge: 'bg-neonGreen/15 text-neonGreen border-neonGreen/30',
        icon: '🌿',
        pointsText: '55-69 pts',
        tierName: 'Warm'
      };
    }
    if (numScore >= 35 || stage === 'Cool') {
      return {
        label: 'Cool',
        badge: 'bg-neonCyan/15 text-neonCyan border-neonCyan/30',
        icon: '❄️',
        pointsText: '35-54 pts',
        tierName: 'Cool'
      };
    }
    return {
      label: 'Low',
      badge: 'bg-slate-800/80 text-slate-400 border-slate-700',
      icon: '⚪',
      pointsText: '< 35 pts',
      tierName: 'Low'
    };
  };

  // Filter leads — if partner logged in, show ONLY their leads
  const effectiveAffiliateFilter = loggedInPartnerCode || filterAffiliate;
  const filteredLeads = leads.filter(l => {
    const searchMatch = !searchTerm || 
      (l.name && l.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.company && l.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.email && l.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.phone && l.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.industry && l.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.serviceTerritories && l.serviceTerritories.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // 100-Point Lead Score Tier Matching
    const stageMatch = !filterStage || (() => {
      const score = Number(l.score) || 0;
      if (filterStage === 'Hot') return score >= 85 || l.stage === 'Hot';
      if (filterStage === 'Warm High') return (score >= 70 && score < 85) || l.stage === 'Warm High';
      if (filterStage === 'Warm') return (score >= 55 && score < 70) || l.stage === 'Warm';
      if (filterStage === 'Cool') return (score >= 35 && score < 55) || l.stage === 'Cool';
      if (filterStage === 'Low' || filterStage === 'Cold') return score < 35 || l.stage === 'Low' || l.stage === 'Cold';
      return l.stage === filterStage;
    })();

    // 25 Industries & 19 Automotive Sectors Flexible Matching
    const industryMatch = !filterIndustry || (() => {
      if (!l.industry) return false;
      const leadInd = l.industry.toLowerCase();
      const targetInd = filterIndustry.toLowerCase();
      const cleanTarget = targetInd.split('(')[0].trim().toLowerCase();
      return leadInd.includes(cleanTarget) || cleanTarget.includes(leadInd) || leadInd.includes(targetInd);
    })();

    const affiliateMatch = !effectiveAffiliateFilter || l.refId === effectiveAffiliateFilter || l.assignedAffiliateId === effectiveAffiliateFilter;
    
    return searchMatch && stageMatch && industryMatch && affiliateMatch;
  });

  // Calculate high level KPIs
  const totalLeads = leads.length;
  const avgScore = totalLeads > 0 
    ? Math.round(leads.reduce((sum, l) => sum + (l.score || 0), 0) / totalLeads)
    : 0;
  const hotLeadsCount = leads.filter(l => (Number(l.score) || 0) >= 70 || l.stage === 'Hot' || l.stage === 'Warm High').length;
  const conversionRate = totalLeads > 0 
    ? ((leads.filter(l => l.status === 'Completed').length / totalLeads) * 100).toFixed(1)
    : '0.0';
  const totalRevenueSimulated = affiliates.reduce((sum, a) => sum + (a.earnings || 0), 0);

  // Recharts Chart Formatter: Funnel Completion rates per video
  const funnelStepsData = [
    { name: 'Video 1', rate: 100 },
    { name: 'Video 2', rate: Math.round((leads.filter(l => l.status === 'Completed' || (l.status && l.status.match(/Video [2-7] Complete/))).length / (totalLeads || 1)) * 100) || 0 },
    { name: 'Video 3', rate: Math.round((leads.filter(l => l.status === 'Completed' || (l.status && l.status.match(/Video [3-7] Complete/))).length / (totalLeads || 1)) * 100) || 0 },
    { name: 'Video 4', rate: Math.round((leads.filter(l => l.status === 'Completed' || (l.status && l.status.match(/Video [4-7] Complete/))).length / (totalLeads || 1)) * 100) || 0 },
    { name: 'Video 5', rate: Math.round((leads.filter(l => l.status === 'Completed' || (l.status && l.status.match(/Video [5-7] Complete/))).length / (totalLeads || 1)) * 100) || 0 },
    { name: 'Video 6', rate: Math.round((leads.filter(l => l.status === 'Completed' || (l.status && l.status.match(/Video [6-7] Complete/))).length / (totalLeads || 1)) * 100) || 0 },
    { name: 'Video 7', rate: Math.round((leads.filter(l => l.status === 'Completed').length / (totalLeads || 1)) * 100) || 0 }
  ];

  // Legacy fallback
  const getStageColor = (stage) => {
    return getStageInfo(0, stage).badge;
  };

  // Render Login Panel
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-darkBg">
        <div className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full glass-card rounded-2xl p-8 relative overflow-hidden animate-slide-in shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neonPurple/5 rounded-full filter blur-3xl pointer-events-none"></div>
            
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-neonPurple/20 text-neonPurple flex items-center justify-center mx-auto mb-4 border border-neonPurple/30">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-grotesk font-bold text-white">Rule7Media CRM Dashboard</h1>
              <p className="text-xs text-slate-400 mt-1">Sign in to access your admin dashboard.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Admin Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                />
                <span className="text-[10px] text-slate-500 block mt-1.5">Default: <strong className="text-slate-400 font-mono">admin</strong></span>
              </div>

              {loginError && <div className="text-xs text-neonRed bg-neonRed/10 p-2 rounded-lg border border-neonRed/20">{loginError}</div>}

              <button 
                type="submit"
                className="w-full p-3 rounded-lg font-bold text-xs text-white transition-all shadow-lg bg-neonPurple hover:bg-neonPurple/90 glow-purple"
              >
                Sign In as Admin
              </button>
            </form>
          </div>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  // --- CRM ADMIN SHELL TEMPLATE ---
  return (
    <div className="min-h-screen flex bg-darkBg text-slate-100">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 glass-card border-y-0 border-l-0 hidden lg:flex flex-col bg-darkSecondary/80 backdrop-blur-md">
        <div className="p-6 flex items-center gap-2 border-b border-slate-900">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${loggedInPartnerCode ? 'bg-neonCyan' : 'bg-neonPurple'}`}>
            {loggedInPartnerCode ? 'P' : 'C'}
          </div>
          <span className="font-grotesk font-bold text-lg tracking-tight">
            {loggedInPartnerCode ? <><span className="text-neonCyan">Partner</span>HQ</> : <>HQ<span className="text-neonPurple">Admin</span></>}
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 text-xs font-semibold">
          <button onClick={() => navigate('/admin/dashboard')} className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 ${isDashboard ? 'bg-neonPurple/10 text-neonPurple border-l-2 border-neonPurple' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}>
            <BarChart3 className="w-4 h-4" />
            <span>HQ Overview</span>
          </button>
          <button onClick={() => navigate('/admin/leads')} className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 ${isLeadsList || isLeadDetail ? 'bg-neonPurple/10 text-neonPurple border-l-2 border-neonPurple' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}>
            <Users className="w-4 h-4" />
            <span>Leads Pipeline</span>
          </button>
          <button onClick={() => navigate('/admin/routing')} className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 ${isRoutingView ? 'bg-neonPurple/10 text-neonPurple border-l-2 border-neonPurple' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}>
            <Send className="w-4 h-4" />
            <span>Webhook Simulator</span>
          </button>
          <button onClick={() => navigate('/admin/reports')} className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 ${isReportsView ? 'bg-neonPurple/10 text-neonPurple border-l-2 border-neonPurple' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}>
            <TrendingUp className="w-4 h-4" />
            <span>Conversion Analytics</span>
          </button>
          <button onClick={() => navigate('/admin/settings')} className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 ${isSettingsView ? 'bg-neonPurple/10 text-neonPurple border-l-2 border-neonPurple' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}>
            <Zap className="w-4 h-4" />
            <span>Scoring Engine Settings</span>
          </button>
        </nav>

        {/* Bottom profile/status */}
        <div className="p-4 border-t border-slate-900 space-y-2 text-xs">
          {loggedInPartnerCode && (
            <div className="p-2 bg-neonCyan/10 rounded-lg border border-neonCyan/20">
              <span className="text-[10px] text-neonCyan font-bold uppercase tracking-wider block">Partner Mode</span>
              <span className="text-[10px] text-slate-400 font-mono">{loggedInPartnerCode}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-neonGreen animate-pulse' : 'bg-slate-600'}`}></span>
              <span className="text-slate-400 font-mono">Socket Connected</span>
            </div>
            <button onClick={handleLogout} className="text-neonRed hover:underline">Logout</button>
          </div>
        </div>
      </aside>

      {/* Main body wrapper */}
      <div className="flex-1 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        
        {/* Top Header bar */}
        <header className="glass-card border-x-0 border-t-0 py-3.5 px-4 sm:px-6 flex justify-between items-center bg-darkSecondary/60 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h2 className="font-grotesk font-bold text-white text-sm sm:text-base leading-tight">
                {isDashboard ? 'HQ CRM Overview' :
                 isLeadsList ? 'Lead Pipeline Database' :
                 isLeadDetail ? 'Lead Engagement Profile' :
                 isRoutingView ? 'Webhook simulator' :
                 isReportsView ? 'Analytical Reports' :
                 isSettingsView ? 'Lead scoring custom weights' : 'CRM Dashboard'}
              </h2>
              <span className="text-[10px] text-slate-400 block lg:hidden font-mono">
                {loggedInPartnerCode ? `Partner: ${loggedInPartnerCode}` : 'HQ Admin'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-xs">
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-900">
              7-Video Qualification Funnel
            </span>
            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-neonRed/10 border border-slate-800 text-slate-400 hover:text-neonRed text-[11px] font-semibold transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-slate-950/95 border-b border-slate-900 p-4 space-y-1 text-xs font-semibold animate-slide-in">
            <button 
              onClick={() => { navigate('/admin/dashboard'); setMobileNavOpen(false); }} 
              className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-3 ${isDashboard ? 'bg-neonPurple/15 text-neonPurple border-l-2 border-neonPurple' : 'text-slate-400 hover:text-white'}`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>HQ Overview</span>
            </button>
            <button 
              onClick={() => { navigate('/admin/leads'); setMobileNavOpen(false); }} 
              className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-3 ${isLeadsList || isLeadDetail ? 'bg-neonPurple/15 text-neonPurple border-l-2 border-neonPurple' : 'text-slate-400 hover:text-white'}`}
            >
              <Users className="w-4 h-4" />
              <span>Leads Pipeline</span>
              <span className="ml-auto bg-neonPurple/20 text-neonPurple text-[10px] px-2 py-0.5 rounded-full font-bold">{leads.length}</span>
            </button>
            <button 
              onClick={() => { navigate('/admin/routing'); setMobileNavOpen(false); }} 
              className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-3 ${isRoutingView ? 'bg-neonPurple/15 text-neonPurple border-l-2 border-neonPurple' : 'text-slate-400 hover:text-white'}`}
            >
              <Send className="w-4 h-4" />
              <span>Webhook Simulator</span>
            </button>
            <button 
              onClick={() => { navigate('/admin/reports'); setMobileNavOpen(false); }} 
              className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-3 ${isReportsView ? 'bg-neonPurple/15 text-neonPurple border-l-2 border-neonPurple' : 'text-slate-400 hover:text-white'}`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Conversion Analytics</span>
            </button>
            <button 
              onClick={() => { navigate('/admin/settings'); setMobileNavOpen(false); }} 
              className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-3 ${isSettingsView ? 'bg-neonPurple/15 text-neonPurple border-l-2 border-neonPurple' : 'text-slate-400 hover:text-white'}`}
            >
              <Zap className="w-4 h-4" />
              <span>Scoring Engine Settings</span>
            </button>
          </div>
        )}

        {/* View Layout Container */}
        <div className="flex-1 p-3 sm:p-6 overflow-y-auto w-full max-w-full overflow-x-hidden">

          {/* ─── VIEW 1: ADMIN HOME DASHBOARD ─── */}
          {isDashboard && (
            <div className="space-y-6 animate-slide-in">
              {/* Metric grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="glass-card p-4 rounded-xl relative overflow-hidden">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Active Leads</span>
                  <span className="text-xl font-extrabold text-white font-grotesk">{totalLeads}</span>
                  <Users className="w-8 h-8 text-neonCyan/5 absolute -right-2 -bottom-2" />
                </div>
                <div className="glass-card p-4 rounded-xl relative overflow-hidden">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Average score</span>
                  <span className="text-xl font-extrabold text-white font-grotesk">{avgScore}/100</span>
                  <Zap className="w-8 h-8 text-neonAmber/5 absolute -right-2 -bottom-2" />
                </div>
                <div className="glass-card p-4 rounded-xl relative overflow-hidden">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Hot Leads (Score 70+)</span>
                  <span className="text-xl font-extrabold text-neonRed font-grotesk">{hotLeadsCount}</span>
                  <TrendingUp className="w-8 h-8 text-neonRed/5 absolute -right-2 -bottom-2" />
                </div>
                <div className="glass-card p-4 rounded-xl relative overflow-hidden">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Completion rate</span>
                  <span className="text-xl font-extrabold text-white font-grotesk">{conversionRate}%</span>
                  <BarChart3 className="w-8 h-8 text-neonPurple/5 absolute -right-2 -bottom-2" />
                </div>
                <div className="glass-card p-4 rounded-xl relative overflow-hidden col-span-2 lg:col-span-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Affiliate Revenue</span>
                  <span className="text-xl font-extrabold text-neonGreen font-grotesk">${totalRevenueSimulated}</span>
                  <DollarSign className="w-8 h-8 text-neonGreen/5 absolute -right-2 -bottom-2" />
                </div>
              </div>

              {/* Main dashboard body splits: charts & queue vs sidebar activity feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left 2 Cols: Funnel Completion chart & Leads table */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Chart */}
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">7-Video Funnel Completion rate</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={funnelStepsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#0e1420" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                          <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                          <Tooltip contentStyle={{ backgroundColor: '#080814', borderColor: 'rgba(255,255,255,0.06)', borderRadius: '8px', fontSize: '12px' }} />
                          <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                            {funnelStepsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#b55fe6' : '#00f0ff'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Leads routing queue */}
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-900 pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Leads routing queue</h3>
                      <button onClick={() => navigate('/admin/leads')} className="text-xs text-neonPurple hover:underline flex items-center gap-1">
                        <span>View pipeline</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    {/* leads mini queue */}
                    <div className="bg-slate-950/40 rounded-xl border border-slate-900 overflow-hidden">
                      {/* Desktop Header */}
                      <div className="hidden sm:grid px-4 py-3 bg-slate-950/90 text-[10px] font-bold text-slate-500 uppercase grid-cols-5 border-b border-slate-900">
                        <span>Company</span>
                        <span>Industry</span>
                        <span>Score</span>
                        <span>Attributed Partner</span>
                        <span className="text-right">Action</span>
                      </div>
                      
                      {/* Mobile Card List (<640px) */}
                      <div className="block sm:hidden divide-y divide-slate-900/80 p-2 space-y-2">
                        {leads.slice(0, 5).map(lead => {
                          const stageInfo = getStageInfo(lead.score, lead.stage);
                          return (
                            <div key={lead.leadId} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80 space-y-2.5">
                              <div className="flex justify-between items-start gap-2">
                                <div className="min-w-0 flex-1">
                                  <span className="font-bold text-white text-xs block truncate">{lead.company || 'Private Lead'}</span>
                                  <span className="text-[10px] text-slate-400 block truncate">{lead.industry || 'General Trades'}</span>
                                </div>
                                <span className={`inline-flex items-center gap-1 font-semibold font-mono px-2 py-0.5 rounded text-[10px] border shrink-0 ${stageInfo.badge}`}>
                                  <span>{stageInfo.icon}</span>
                                  <span>{lead.score || 50}</span>
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-900/60 pt-2">
                                <span className="font-mono text-slate-400 truncate max-w-[150px]">Ref: <strong className="text-slate-200">{lead.refId || 'Organic'}</strong></span>
                                <button 
                                  onClick={() => navigate(`/admin/leads/${lead.leadId}`)} 
                                  className="px-2.5 py-1 bg-neonPurple/10 text-neonPurple hover:bg-neonPurple hover:text-white rounded border border-neonPurple/20 text-[10px] font-bold transition-all"
                                >
                                  Detail →
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Desktop Rows (>=640px) */}
                      <div className="hidden sm:block divide-y divide-slate-900/60">
                        {leads.slice(0, 5).map(lead => (
                          <div key={lead.leadId} className="px-4 py-3 text-xs grid grid-cols-5 items-center hover:bg-slate-900/10">
                            <div>
                              <span className="font-semibold text-white block">{lead.company || 'Private Lead'}</span>
                              <span className="text-[10px] text-slate-500">{lead.name}</span>
                            </div>
                            <span className="text-slate-400 truncate pr-2">{lead.industry || 'General Trades'}</span>
                            <div>
                              <span className={`font-semibold font-mono px-2 py-0.5 rounded text-[10px] border ${getStageColor(lead.stage)}`}>
                                {lead.score} - {lead.stage}
                              </span>
                            </div>
                            <span className="text-slate-400 font-mono text-[10px]">{lead.refId || 'Organic Search'}</span>
                            <div className="text-right">
                              <button 
                                onClick={() => navigate(`/admin/leads/${lead.leadId}`)} 
                                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-850 text-[10px] transition-all"
                              >
                                Detail
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right col: Real-time live feed logs */}
                <div className="glass-card rounded-2xl p-6 flex flex-col h-[520px]">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-900 pb-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-neonPurple animate-pulse" />
                      <span>Live WebSocket Attributions</span>
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-neonGreen animate-pulse"></span>
                  </div>

                  {/* List feeds */}
                  <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                    {liveFeed.map((f, idx) => (
                      <div key={idx} className="p-3 bg-slate-950/60 rounded-lg border border-slate-900 text-xs space-y-1 animate-slide-in">
                        <div className="flex justify-between items-center text-[10px] text-slate-500">
                          <span className="font-semibold text-neonPurple">
                            {f.event === 'partner_application' ? 'Partner Application' : 'Progress Event'}
                          </span>
                          <span>{new Date(f.timestamp).toLocaleTimeString()}</span>
                        </div>
                        {f.event === 'partner_application' ? (
                          <p className="text-white text-xs">
                            Partner registered: <strong>{f.company}</strong> ({f.name})
                          </p>
                        ) : (
                          <>
                            <p className="text-white text-xs">
                              Lead <strong>{f.company}</strong> ({f.name}) hit state: <span className="text-neonCyan">{f.status}</span>
                            </p>
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1 border-t border-slate-900/40 pt-1">
                              <span>Attributed Ref: <strong>{f.refId || 'Organic'}</strong></span>
                              <span>Score: <strong>{f.score}</strong></span>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    {liveFeed.length === 0 && (
                      <div className="text-center py-20 text-slate-600 text-xs">
                        <RefreshCw className="w-8 h-8 text-slate-700 animate-spin mx-auto mb-2" />
                        <span>Waiting for live WebSocket funnel captures...</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ─── VIEW 2: LEADS LIST DATABASE ─── */}
          {isLeadsList && (
            <div className="space-y-6 animate-slide-in">
              {/* Filters Panel */}
              <div className="glass-card p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center relative z-30">
                {/* Search */}
                <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by Company, Name, Email, Territory..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full glass-input rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonPurple"
                  />
                </div>
                
                {/* Filter Stage (100-Pt Tiers) */}
                <select
                  value={filterStage}
                  onChange={e => setFilterStage(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-neonPurple"
                >
                  <option value="">All Lead Score Tiers (100-pt)</option>
                  <option value="Hot">🔥 Hot Priority (85-100 pts)</option>
                  <option value="Warm High">⚡ Warm High (70-84 pts)</option>
                  <option value="Warm">🌿 Warm (55-69 pts)</option>
                  <option value="Cool">❄️ Cool (35-54 pts)</option>
                  <option value="Low">⚪ Low (&lt;35 pts)</option>
                </select>

                {/* Custom Responsive Sector Filter (25 Industries & 19 Auto) */}
                <div className="relative w-full min-w-0" ref={industryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsIndustryDropdownOpen(!isIndustryDropdownOpen)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-neonPurple flex justify-between items-center text-left hover:border-slate-700 transition-all cursor-pointer"
                  >
                    <span className="truncate mr-2 font-medium">
                      {filterIndustry || "All Sectors (25 Industries & 19 Auto)"}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isIndustryDropdownOpen ? 'rotate-180 text-neonPurple' : ''}`} />
                  </button>

                  {isIndustryDropdownOpen && (
                    <div 
                      style={{ backgroundColor: '#080c18' }}
                      className="absolute left-0 right-0 z-50 mt-1.5 max-h-80 w-full max-w-full overflow-y-auto rounded-xl border border-slate-700 shadow-[0_12px_40px_rgba(0,0,0,0.95)] animate-slide-in p-1.5 text-xs divide-y divide-slate-800/80"
                    >
                      {/* Search box inside dropdown */}
                      <div style={{ backgroundColor: '#080c18' }} className="p-1 pb-2 sticky top-0 z-20">
                        <input
                          type="text"
                          placeholder="Search 44 sectors..."
                          value={industrySearchTerm}
                          onChange={e => setIndustrySearchTerm(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-400 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-neonPurple"
                          onClick={e => e.stopPropagation()}
                          autoFocus
                        />
                      </div>

                      <div className="pt-1.5 space-y-1">
                        {/* All option */}
                        <button
                          type="button"
                          onClick={() => {
                            setFilterIndustry('');
                            setIsIndustryDropdownOpen(false);
                            setIndustrySearchTerm('');
                          }}
                          className={`w-full text-left p-2.5 px-3 rounded-lg text-xs transition-colors hover:bg-neonPurple hover:text-white truncate block ${
                            !filterIndustry ? 'bg-neonPurple/25 text-neonPurple font-bold border border-neonPurple/40' : 'text-slate-200'
                          }`}
                        >
                          All Sectors (25 Industries &amp; 19 Auto)
                        </button>

                        {/* 25 Local Industries */}
                        {filteredIndustriesList.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="px-2.5 py-1 text-[9.5px] font-bold text-neonCyan uppercase tracking-wider bg-slate-900/90 rounded border border-slate-800">
                              ── 25 Local Industry Categories ──
                            </div>
                            {filteredIndustriesList.map((ind, idx) => (
                              <button
                                key={`ind-${idx}`}
                                type="button"
                                onClick={() => {
                                  setFilterIndustry(ind);
                                  setIsIndustryDropdownOpen(false);
                                  setIndustrySearchTerm('');
                                }}
                                className={`w-full text-left p-2 px-3 rounded-lg text-xs transition-colors hover:bg-neonPurple hover:text-white truncate block ${
                                  filterIndustry === ind ? 'bg-neonPurple/25 text-neonPurple font-bold border border-neonPurple/40' : 'text-slate-200'
                                }`}
                                title={ind}
                              >
                                {ind}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* 19 Automotive Sectors */}
                        {filteredAutoList.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="px-2.5 py-1 text-[9.5px] font-bold text-neonPink uppercase tracking-wider bg-slate-900/90 rounded border border-slate-800">
                              ── 19 Automotive Sector Niches ──
                            </div>
                            {filteredAutoList.map((sec, idx) => (
                              <button
                                key={`sec-${idx}`}
                                type="button"
                                onClick={() => {
                                  setFilterIndustry(sec);
                                  setIsIndustryDropdownOpen(false);
                                  setIndustrySearchTerm('');
                                }}
                                className={`w-full text-left p-2 px-3 rounded-lg text-xs transition-colors hover:bg-neonPurple hover:text-white truncate block ${
                                  filterIndustry === sec ? 'bg-neonPurple/25 text-neonPurple font-bold border border-neonPurple/40' : 'text-slate-200'
                                }`}
                                title={sec}
                              >
                                {sec}
                              </button>
                            ))}
                          </div>
                        )}

                        {filteredIndustriesList.length === 0 && filteredAutoList.length === 0 && (
                          <div className="p-4 text-center text-slate-400 text-xs italic">
                            No sector matches "{industrySearchTerm}"
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Filter Affiliate */}
                <select
                  value={filterAffiliate}
                  onChange={e => setFilterAffiliate(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-neonPurple"
                >
                  <option value="">All Referral Partners</option>
                  {affiliates.map(a => (
                    <option key={a.code} value={a.code}>{a.company} ({a.code})</option>
                  ))}
                  <option value="">Direct / Organic Traffic</option>
                </select>
              </div>

              {/* Leads Table */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      Total Filtered Leads: <strong className="text-white font-mono">{filteredLeads.length}</strong>
                    </span>
                    {(searchTerm || filterStage || filterIndustry || filterAffiliate) && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setFilterStage('');
                          setFilterIndustry('');
                          setFilterAffiliate('');
                        }}
                        className="text-[10px] text-neonPurple hover:underline font-bold ml-2"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider bg-slate-950 px-2.5 py-1 rounded-full border border-slate-900">
                    100-Point Algorithmic Routing
                  </span>
                </div>
                
                {/* Mobile View: Stacked Responsive Cards (<640px) */}
                <div className="block sm:hidden divide-y divide-slate-900/80">
                  {filteredLeads.map(lead => {
                    const stageInfo = getStageInfo(lead.score, lead.stage);
                    return (
                      <div key={lead.leadId} className="p-4 space-y-3 hover:bg-slate-900/20 transition-colors">
                        {/* Company & Score */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-white text-sm block leading-tight truncate">
                              {lead.company || 'Private Business'}
                            </span>
                            <span className="text-[11px] text-slate-400 block mt-0.5 truncate">
                              {lead.industry || 'Local Commercial Trades'}
                            </span>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border font-mono shrink-0 ${stageInfo.badge}`}>
                            <span>{stageInfo.icon}</span>
                            <span>{lead.score || 50}/100</span>
                          </span>
                        </div>

                        {/* Contact & Territory Grid */}
                        <div className="grid grid-cols-1 gap-1.5 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-900/80">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <span className="text-slate-500 text-[10px] font-medium w-16 shrink-0">Contact:</span>
                            <strong className="text-white truncate">{lead.name}</strong>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <span className="text-slate-500 text-[10px] font-medium w-16 shrink-0">Email:</span>
                            <span className="truncate text-slate-300 font-mono text-[11px]">{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-300 pt-1 border-t border-slate-900/60">
                            <MapPin className="w-3.5 h-3.5 text-neonCyan shrink-0" />
                            <span className="truncate text-[11px] text-slate-300">{lead.serviceTerritories || lead.territory || 'Sydney (30-Mile Protected)'}</span>
                          </div>

                          {/* IP Location Check Badge */}
                          {lead.isMismatch ? (
                            <div className="mt-1 p-2 rounded bg-neonRed/15 border border-neonRed/30 text-[10.5px] text-neonRed flex items-start gap-1.5 font-semibold">
                              <span>🚩</span>
                              <span className="leading-tight">{lead.mismatchAlert || `Location Mismatch: IP is from ${lead.ipCountry}`}</span>
                            </div>
                          ) : lead.ipCountry ? (
                            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                              <Shield className="w-3 h-3 text-neonGreen shrink-0" />
                              <span>IP Verified: <strong>{lead.ipCountry} {lead.ipCity ? `(${lead.ipCity})` : ''}</strong></span>
                            </div>
                          ) : null}
                        </div>

                        {/* Status & Partner Meta */}
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-850 text-slate-300 font-medium">
                              {lead.status || 'Active'}
                            </span>
                            <span className="font-mono text-slate-400">
                              Ref: <strong className={lead.assignedAffiliateId ? "text-neonCyan font-bold" : "text-slate-300"}>{lead.assignedAffiliateId || lead.refId || 'Organic'}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Explore CTA Button */}
                        <button 
                          onClick={() => navigate(`/admin/leads/${lead.leadId}`)}
                          className="w-full py-2.5 bg-neonPurple/15 text-neonPurple hover:bg-neonPurple hover:text-white rounded-lg border border-neonPurple/30 transition-all font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <span>Explore Lead Details</span>
                          <span>→</span>
                        </button>
                      </div>
                    );
                  })}
                  {filteredLeads.length === 0 && (
                    <div className="p-6 text-center">
                      <div className="glass-card p-6 text-center rounded-xl border-dashed border-slate-800 space-y-2.5">
                        <div className="w-10 h-10 rounded-full bg-neonPurple/10 text-neonPurple flex items-center justify-center mx-auto border border-neonPurple/20">
                          <Users className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-white text-xs">No Leads Found</h3>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          No leads match the current filters.
                        </p>
                        {(searchTerm || filterStage || filterIndustry || filterAffiliate) && (
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setFilterStage('');
                              setFilterIndustry('');
                              setFilterAffiliate('');
                            }}
                            className="mt-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 rounded-lg text-xs font-bold transition-all"
                          >
                            Reset Filters
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop View: Full Table (>=640px) */}
                <div className="hidden sm:block overflow-x-auto w-full">
                  <table className="w-full text-xs text-left min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-900 font-bold uppercase tracking-wider text-[9px]">
                        <th className="p-4">Business &amp; Sector</th>
                        <th className="p-4">Contact Person</th>
                        <th className="p-4">Local Territory</th>
                        <th className="p-4">100-Pt Score</th>
                        <th className="p-4">Progress Gate</th>
                        <th className="p-4">Partner Route</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {filteredLeads.map(lead => {
                        const stageInfo = getStageInfo(lead.score, lead.stage);
                        return (
                          <tr key={lead.leadId} className="hover:bg-slate-900/20 transition-colors">
                            <td className="p-4">
                              <span className="font-semibold text-white block">{lead.company || 'Private Business'}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">{lead.industry || 'Local Commercial Trades'}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-slate-200 block font-medium">{lead.name}</span>
                              <span className="text-[10px] text-slate-500 block mt-0.5">{lead.email}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1 text-[11px] text-slate-300">
                                <MapPin className="w-3 h-3 text-neonCyan shrink-0" />
                                <span className="truncate max-w-[150px]">{lead.serviceTerritories || lead.territory || 'Sydney (30-Mile Protected)'}</span>
                              </div>
                              {lead.isMismatch ? (
                                <span className="inline-flex items-center gap-1 text-[9px] text-neonRed font-bold mt-1 bg-neonRed/10 px-1.5 py-0.5 rounded border border-neonRed/20" title={lead.mismatchAlert}>
                                  🚩 IP Mismatch ({lead.ipCountry || 'Foreign'})
                                </span>
                              ) : lead.ipCountry ? (
                                <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                                  IP: {lead.ipCountry}
                                </span>
                              ) : null}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border font-mono ${stageInfo.badge}`}>
                                <span>{stageInfo.icon}</span>
                                <span>{lead.score || 50}/100</span>
                                <span className="font-sans font-semibold">({stageInfo.tierName})</span>
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                                {lead.status || 'Active'}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-[10px]">
                              {lead.assignedAffiliateId ? (
                                <span className="text-neonCyan font-bold">{lead.assignedAffiliateId}</span>
                              ) : (
                                <span className="text-slate-500">{lead.refId || 'Organic Search'}</span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <button 
                                onClick={() => navigate(`/admin/leads/${lead.leadId}`)}
                                className="px-3 py-1.5 bg-neonPurple/10 text-neonPurple hover:bg-neonPurple hover:text-white rounded-lg border border-neonPurple/20 transition-all font-bold text-[11px]"
                              >
                                Explore Detail →
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredLeads.length === 0 && (
                        <tr>
                          <td colSpan="7" className="p-10 text-center">
                            <div className="glass-card p-8 text-center rounded-2xl border-dashed border-slate-800 max-w-lg mx-auto space-y-3">
                              <div className="w-10 h-10 rounded-full bg-neonPurple/10 text-neonPurple flex items-center justify-center mx-auto border border-neonPurple/20">
                                <Users className="w-5 h-5" />
                              </div>
                              <h3 className="font-bold text-white text-sm">No Leads Match Your Selected Filters</h3>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                Leads completing the 7-video qualification funnel within their 30-mile protected territory will automatically stream in here via live WebSockets.
                              </p>
                              {(searchTerm || filterStage || filterIndustry || filterAffiliate) && (
                                <button
                                  onClick={() => {
                                    setSearchTerm('');
                                    setFilterStage('');
                                    setFilterIndustry('');
                                    setFilterAffiliate('');
                                  }}
                                  className="mt-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 rounded-lg text-xs font-bold transition-all"
                                >
                                  Reset All Filters
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── VIEW 3: LEAD DETAILS & ROUTING ─── */}
          {isLeadDetail && selectedLead && (
            <div className="space-y-6 animate-slide-in">
              <button 
                onClick={() => navigate('/admin/leads')} 
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2"
              >
                <span>← Back to Pipeline</span>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left 2 Cols: Lead details, timelines, answers */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* General Profile Card */}
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-900 pb-4 mb-4">
                      <div>
                        <h2 className="text-xl font-grotesk font-black text-white">{selectedLead.company || 'Private Business'}</h2>
                        <span className="text-xs text-slate-400">Industry Sector: <strong className="text-slate-200">{selectedLead.industry || 'Local Commercial Trades'}</strong></span>
                      </div>
                      <div className="text-left sm:text-right">
                        {(() => {
                          const info = getStageInfo(selectedLead.score, selectedLead.stage);
                          return (
                            <span className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1.5 rounded-full border ${info.badge}`}>
                              <span>{info.icon}</span>
                              <span>{selectedLead.score || 50}/100</span>
                              <span className="font-sans font-semibold">({info.label})</span>
                            </span>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                        <span className="text-slate-500 block mb-1">Contact Name & Title</span>
                        <strong className="text-white block">{selectedLead.name} ({selectedLead.role || 'CEO'})</strong>
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                        <span className="text-slate-500 block mb-1">Contact Business Email</span>
                        <strong className="text-white block">{selectedLead.email}</strong>
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                        <span className="text-slate-500 block mb-1">Monthly Marketing Budget</span>
                        <strong className="text-white block">{selectedLead.budget || 'Under $500'}</strong>
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                        <span className="text-slate-500 block mb-1">Company Fleet Size</span>
                        <strong className="text-white block">{selectedLead.fleetSize || 'None'}</strong>
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                        <span className="text-slate-500 block mb-1">Types of Vehicles Used</span>
                        <strong className="text-white block">
                          {selectedLead.vehicleTypes && selectedLead.vehicleTypes.length > 0 
                            ? (Array.isArray(selectedLead.vehicleTypes) ? selectedLead.vehicleTypes.join(', ') : selectedLead.vehicleTypes) 
                            : 'N/A'}
                        </strong>
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                        <span className="text-slate-500 block mb-1">Primary Service Territories</span>
                        <strong className="text-white block">{selectedLead.serviceTerritories || 'N/A'}</strong>
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                        <span className="text-slate-500 block mb-1">Vehicles Signage / Branding</span>
                        <strong className="text-white block">{selectedLead.hasBranding || 'N/A'}</strong>
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900 md:col-span-2">
                        <span className="text-slate-500 block mb-1">Rough Budget Allocation (%)</span>
                        <strong className="text-white block">
                          Digital: {selectedLead.allocDigital || '0%'} | Traditional: {selectedLead.allocTraditional || selectedLead.allocTrad || '0%'} | Other: {selectedLead.allocOther || '0%'}
                        </strong>
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                        <span className="text-slate-500 block mb-1">Decision Maker's Phone</span>
                        <strong className="text-white block">{selectedLead.phone || 'N/A'}</strong>
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                        <span className="text-slate-500 block mb-1">Reviewing Marketing Timeline</span>
                        <strong className="text-white block">{selectedLead.reviewTimeline || 'N/A'}</strong>
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                        <span className="text-slate-500 block mb-1">Preferred Consult Time</span>
                        <strong className="text-white block">{selectedLead.consultTime || 'N/A'}</strong>
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                        <span className="text-slate-500 block mb-1">Audit Request Status</span>
                        <strong className="text-white block">{selectedLead.auditRequest || 'N/A'}</strong>
                      </div>
                      {selectedLead.customGoals && (
                        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-900 md:col-span-2">
                          <span className="text-slate-500 block mb-1">Additional Notes / Comments</span>
                          <strong className="text-white block font-normal leading-relaxed">{selectedLead.customGoals}</strong>
                        </div>
                      )}
                    </div>

                    {selectedLead.goals && selectedLead.goals.length > 0 && (
                      <div className="mt-6 border-t border-slate-900 pt-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Campaign Goals</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedLead.goals.map((g, idx) => (
                            <span key={idx} className="bg-slate-950 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-900 text-[10px]">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* IP & Location Security Verification */}
                    <div className="mt-6 border-t border-slate-900 pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-neonCyan" />
                        <span>IP &amp; Territory Security Verification</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-900">
                          <span className="text-slate-500 text-[10px] block mb-0.5">Submitted Territory / Country</span>
                          <strong className="text-white block">{selectedLead.serviceTerritories || selectedLead.territory || selectedLead.country || 'Sydney, Australia'}</strong>
                        </div>
                        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-900">
                          <span className="text-slate-500 text-[10px] block mb-0.5">Detected IP Geolocation</span>
                          <strong className="text-white block">{selectedLead.ipCountry || 'Local Network'} {selectedLead.ipCity ? `(${selectedLead.ipCity})` : ''}</strong>
                        </div>
                      </div>

                      {selectedLead.isMismatch ? (
                        <div className="mt-3 p-3 rounded-lg bg-neonRed/15 border border-neonRed/30 text-xs text-neonRed flex items-start gap-2">
                          <span className="text-base">🚩</span>
                          <div>
                            <strong className="block font-bold">Location Mismatch Alert</strong>
                            <span className="text-[11px] text-slate-300 block mt-0.5 leading-relaxed">
                              {selectedLead.mismatchAlert || `User submitted local territory "${selectedLead.serviceTerritories || 'Australia'}", but their internet connection originated from ${selectedLead.ipCountry}.`}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 p-2.5 rounded-lg bg-neonGreen/10 border border-neonGreen/20 text-xs text-neonGreen flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-neonGreen shrink-0" />
                          <span className="text-[11px] font-medium">IP matches registered territory region. Zero security flags.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Funnel Timelines */}
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-900 pb-2">
                      Progressive Timeline Logs
                    </h3>
                    
                    <div className="space-y-4 relative border-l border-slate-800 ml-3 pl-6">
                      {(selectedLead.timeline || []).map((t, idx) => (
                        <div key={idx} className="relative">
                          <span className="absolute -left-[30px] top-0.5 w-2.5 h-2.5 rounded-full bg-neonPurple border-2 border-darkBg"></span>
                          <div className="text-xs">
                            <span className="text-white font-medium block">{t.event}</span>
                            <span className="text-[10px] text-slate-500">{new Date(t.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Col: Scoring Breakdown & Webhook routing */}
                <div className="space-y-6">
                  
                  {/* Lead Scoring Breakdown */}
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="font-grotesk font-bold text-white mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-neonPurple" />
                      <span>Qualification Breakdown</span>
                    </h3>
                    
                    {/* Score distribution grid */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Video Views completion (+40)</span>
                          <span className="font-semibold">{selectedLead.breakdown?.videoCompletion || 0} pts</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1">
                          <div className="bg-neonPurple h-full rounded-full" style={{ width: `${((selectedLead.breakdown?.videoCompletion || 0) / 40) * 100}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>High Marketing Budget (+20)</span>
                          <span className="font-semibold">{selectedLead.breakdown?.budget || 0} pts</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1">
                          <div className="bg-neonCyan h-full rounded-full" style={{ width: `${((selectedLead.breakdown?.budget || 0) / 20) * 100}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Fleet Size qualification (+15)</span>
                          <span className="font-semibold">{selectedLead.breakdown?.fleetSize || 0} pts</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1">
                          <div className="bg-neonBlue h-full rounded-full" style={{ width: `${((selectedLead.breakdown?.fleetSize || 0) / 15) * 100}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Verified Quiz accuracy (+15)</span>
                          <span className="font-semibold">{selectedLead.breakdown?.quizAnswers || 0} pts</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1">
                          <div className="bg-neonGreen h-full rounded-full" style={{ width: `${((selectedLead.breakdown?.quizAnswers || 0) / 15) * 100}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Affiliate attribution (+10)</span>
                          <span className="font-semibold">{selectedLead.breakdown?.affiliateSource || 0} pts</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1">
                          <div className="bg-neonPink h-full rounded-full" style={{ width: `${((selectedLead.breakdown?.affiliateSource || 0) / 10) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Manual Lead Routing Assignment */}
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="font-grotesk font-bold text-white mb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-neonRed" />
                      <span>Attribution Assignment</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 mb-4">Select the partner agency in charge of wrapping operations for this lead's region.</p>
                    
                    <select
                      value={selectedLead.assignedAffiliateId || ''}
                      onChange={e => handleAssignLead(selectedLead.leadId, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-900 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-neonPurple mb-4"
                    >
                      <option value="">Unassigned (Organic / Direct)</option>
                      {affiliates.map(a => (
                        <option key={a.code} value={a.code}>{a.company} ({a.territory})</option>
                      ))}
                    </select>

                    <div className="text-[10px] bg-slate-950/60 p-3 rounded-lg border border-slate-900 text-slate-400">
                      <span>Attributed Lead Referrer Code: </span>
                      <strong className="text-white font-mono">{selectedLead.refId || 'None'}</strong>
                    </div>
                  </div>

                  {/* Webhook Dispatch simulation */}
                  <div className="glass-card rounded-2xl p-6 border-neonPurple/20">
                    <h3 className="font-grotesk font-bold text-white mb-2 flex items-center gap-2">
                      <Send className="w-5 h-5 text-neonPurple" />
                      <span>Sync Partner Webhook</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 mb-4">Simulate posting lead JSON data to wrapping partner CRM API gateway.</p>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Partner Webhook URI</label>
                        <input
                          type="text"
                          value={webhookUrl}
                          onChange={e => setWebhookUrl(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-900 text-slate-200 text-xs font-mono rounded-lg p-2 focus:ring-1 focus:ring-neonPurple outline-none"
                        />
                      </div>

                      {simulatingWebhook ? (
                        <div className="w-full p-2.5 bg-slate-900 text-slate-400 font-semibold text-xs rounded-lg text-center animate-pulse">
                          Transmitting API payload...
                        </div>
                      ) : (
                        <button
                          onClick={handleTriggerWebhook}
                          className="w-full p-2.5 bg-neonPurple text-white font-bold text-xs rounded-lg flex justify-center items-center gap-2 hover:bg-neonPurple/90 transition-all"
                        >
                          <span>Simulate Webhook Post</span>
                        </button>
                      )}

                      {/* Display simulator logs */}
                      {webhookLogs.length > 0 && (
                        <div className="mt-4 border-t border-slate-900 pt-3 max-h-40 overflow-y-auto">
                          <h4 className="text-[9px] font-bold text-slate-500 uppercase mb-1.5">Simulation Execution Logs</h4>
                          {webhookLogs.map((log, idx) => (
                            <div key={idx} className="p-2 bg-slate-950/90 rounded border border-slate-900 font-mono text-[9px] text-slate-400 space-y-1 mb-1">
                              <div className="flex justify-between">
                                <span className={log.success ? 'text-neonGreen' : 'text-neonRed'}>HTTP {log.status}</span>
                                <span>{log.timestamp}</span>
                              </div>
                              <span className="block text-slate-500 truncate">POST &#8594; {log.url}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ─── VIEW 4: ROUTING & SIMULATIONS ─── */}
          {isRoutingView && (
            <div className="glass-card rounded-2xl p-6 animate-slide-in max-w-2xl mx-auto space-y-6">
              <h2 className="text-lg font-grotesk font-bold text-white mb-2">CRM Routing Webhook Logs</h2>
              <p className="text-xs text-slate-400 mb-6">Attribution routing events log showing API payload synchronizations between Rule7Media and local wrapping shops.</p>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900/80 font-mono text-xs text-slate-400 space-y-2">
                <span className="text-slate-500 font-bold block">// Rule7 Routing Engine Active</span>
                <span className="text-neonCyan block">webhook_listener: active</span>
                <span className="text-neonPurple block">routing_radius: matching_territory</span>
                <span className="text-white block mt-4 font-bold">Recent transmissions:</span>
                <div className="space-y-2 border-t border-slate-900 pt-3">
                  <div className="p-2 bg-slate-950 rounded border border-slate-900">
                    <span className="text-neonGreen block">HTTP 200 OK — 2026-06-15 23:35:12</span>
                    <span>Lead "Rome Fleet Logistics" successfully routed to RapidWrap Sydney CRM</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-900">
                    <span className="text-neonGreen block">HTTP 200 OK — 2026-06-15 23:20:04</span>
                    <span>Lead "Cyberdyne Transport" successfully routed to Apex Wraps CRM</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── VIEW 5: ANALYTICS REPORTS ─── */}
          {isReportsView && (
            <div className="space-y-6 animate-slide-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Conversion trends chart */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Lead Generation Volume (Weekly)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'Wk 1', count: 4 },
                        { name: 'Wk 2', count: 7 },
                        { name: 'Wk 3', count: 12 },
                        { name: 'Wk 4', count: 9 },
                        { name: 'Wk 5', count: 18 },
                        { name: 'Wk 6', count: totalLeads }
                      ]} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#0e1420" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip />
                        <Area type="monotone" dataKey="count" stroke="#00f0ff" fill="rgba(0, 240, 255, 0.05)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Affiliate conversions rank */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Conversion Count by Partner Affiliate</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={affiliates} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#0e1420" />
                        <XAxis dataKey="company" stroke="#64748b" fontSize={8} />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip />
                        <Bar dataKey="conversions" fill="#b55fe6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ─── VIEW 6: SCORING ENGINE SETTINGS ─── */}
          {isSettingsView && (
            <div className="glass-card rounded-2xl p-6 animate-slide-in max-w-lg mx-auto space-y-6">
              <h2 className="text-lg font-grotesk font-bold text-white mb-2">Lead Scoring engine weights</h2>
              <p className="text-xs text-slate-400 mb-6">Modify default coefficients and parameters used to evaluate lead heat scores.</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Video Completion weight</span>
                    <strong className="text-white">{scoringWeights.video}% max</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={scoringWeights.video}
                    onChange={e => setScoringWeights(prev => ({ ...prev, video: parseInt(e.target.value) }))}
                    className="w-full accent-neonPurple"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Budget Range weight</span>
                    <strong className="text-white">{scoringWeights.budget}% max</strong>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={scoringWeights.budget}
                    onChange={e => setScoringWeights(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                    className="w-full accent-neonPurple"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Fleet Size weight</span>
                    <strong className="text-white">{scoringWeights.fleet}% max</strong>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={scoringWeights.fleet}
                    onChange={e => setScoringWeights(prev => ({ ...prev, fleet: parseInt(e.target.value) }))}
                    className="w-full accent-neonPurple"
                  />
                </div>

                <div className="p-3 bg-neonPurple/5 border border-neonPurple/10 rounded-lg text-[10px] text-slate-400">
                  <span>Modifications applied directly to backend scoring controllers. System will calculate labels dynamically based on total aggregate score (0-100).</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
