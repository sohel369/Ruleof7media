import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ChevronRight, 
  Shield, 
  Zap, 
  Star, 
  AlertCircle, 
  X, 
  Lock, 
  CreditCard, 
  ArrowRight, 
  ExternalLink, 
  HelpCircle, 
  ChevronDown, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Database, 
  Video, 
  Award, 
  DollarSign,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { GlobalFooter } from '../components/GlobalFooter';

const PLANS = [
  {
    id: 'starter',
    name: 'PLAN 1 – STARTER',
    shortName: 'Starter',
    badge: 'Local Priority',
    tagline: 'Best for Signwriters and Vehicle Wrapping Businesses getting started with local priority.',
    price: 297,
    commitmentText: '3-month commitment · Total $891',
    totalCommitment: 891,
    savingsText: '',
    period: '/ month',
    color: 'neonCyan',
    popular: false,
    recommended: false,
    hasAffiliate: false,
    features: [
      'Priority listing + 30-mile exclusive radius',
      'Manual QuickBooks / Xero export',
      'Email alerts & basic Prize Draw entries',
      'Access to the educated advertiser network'
    ],
    ctaText: 'Select Starter →'
  },
  {
    id: 'professional',
    name: 'PLAN 2 – PROFESSIONAL',
    shortName: 'Professional',
    badge: '★ Most Popular',
    tagline: 'The sweet spot for growing Signwriters and Vehicle Wrapping Businesses that want automation and earnings potential.',
    price: 247,
    commitmentText: '6-month commitment · Total $1,482 · Save 17%',
    totalCommitment: 1482,
    savingsText: 'Save 17%',
    period: '/ month',
    color: 'neonRed',
    popular: true,
    recommended: false,
    hasAffiliate: true,
    features: [
      'Everything in Starter',
      '30-mile exclusive radius',
      '2-way QuickBooks & Xero sync',
      'Automated invoicing & material cost entry',
      'Single auction bidding rights',
      'Full data collection + refined lead scores',
      '22% Affiliate Commission – earn while you work'
    ],
    ctaText: 'Select Professional →'
  },
  {
    id: 'growth',
    name: 'PLAN 3 – GROWTH',
    shortName: 'Growth',
    badge: '★ Recommended / Best Value',
    tagline: 'For Signwriters and Vehicle Wrapping Businesses that want maximum value, real-time profit visibility, and the highest affiliate upside.',
    price: 197,
    commitmentText: '12-month commitment · Total $2,364 · Save 34%',
    totalCommitment: 2364,
    savingsText: 'Save 34%',
    period: '/ month',
    color: 'neonGreen',
    popular: false,
    recommended: true,
    hasAffiliate: true,
    features: [
      'Everything in Professional',
      '30-mile exclusive radius',
      'Real-time P&L Job Costing & Margin Alerts',
      'Multiple auction bidding rights',
      'Priority placement in the educated advertiser feed',
      '22% Affiliate Commission – highest earning potential'
    ],
    ctaText: 'Select Growth →'
  },
  {
    id: 'dfy',
    name: 'PLAN 4 – DONE-FOR-YOU',
    shortName: 'Done-For-You',
    badge: 'Full Turnkey Setup',
    tagline: 'We design, integrate and manage the full education → auction → scoring ecosystem for your Signwriting or Vehicle Wrapping Business.',
    price: 149,
    setupFee: 1997,
    commitmentText: '$1,997 setup + $149 / month',
    period: '/ month',
    color: 'neonAmber',
    popular: false,
    recommended: false,
    hasAffiliate: true,
    features: [
      'Full custom setup & dedicated campaign management',
      'Turnkey CRM & 2-Way accounting integration',
      'Priority localized advertiser funnel',
      '30-mile exclusive radius protection',
      'Includes 22% Affiliate Commission'
    ],
    ctaText: 'Book Done-For-You →'
  }
];

const VIDEO_ADDONS = [
  {
    id: 'branded',
    name: 'Rule7 Branded',
    desc: 'Full series with Rule7 branding + your business listed as the local partner.',
    oneTimePrice: 347,
    monthlyPrice: 59,
    color: 'neonCyan'
  },
  {
    id: 'unbranded',
    name: 'Unbranded (White-Label)',
    desc: 'Clean version with no Rule7 logos — ready for your website and sales process.',
    oneTimePrice: 597,
    monthlyPrice: 89,
    color: 'neonRed'
  },
  {
    id: 'bespoke',
    name: 'Fully Bespoke',
    desc: 'Your logo, colours and business name on every video + custom intro/outro.',
    oneTimePrice: 1797,
    monthlyPrice: 179,
    color: 'neonGreen'
  }
];

const COMPARISON_ROWS = [
  { feature: 'Job management & basic CRM', crm: 'Yes', agency: 'Limited', rule7: 'Yes', highlight: false },
  { feature: 'QuickBooks / Xero integration', crm: 'Often one-way or add-on', agency: 'Rare', rule7: '2-way sync', highlight: false },
  { feature: 'Real-time job costing & P&L', crm: 'Rare', agency: 'No', rule7: 'Yes (Growth+)', highlight: true },
  { feature: 'Exclusive 30-mile radius / priority listing', crm: 'No', agency: 'Sometimes', rule7: 'Yes (All Plans)', highlight: false },
  { feature: 'Customer Education (7-video series)', crm: 'No', agency: 'No', rule7: 'Yes', highlight: true },
  { feature: 'Incremental Data Collection', crm: 'Minimal', agency: 'Minimal', rule7: 'Yes', highlight: true },
  { feature: 'Precise Lead Scoring in CRM', crm: 'Basic or none', agency: 'Basic', rule7: 'Yes – continuous', highlight: true },
  { feature: 'Reverse Auction Platform', crm: 'No', agency: 'No', rule7: 'Yes – opens 25 industries', highlight: true },
  { feature: 'Market limited to vehicle owners only', crm: 'Yes', agency: 'Yes', rule7: 'No – expanded market', highlight: true },
  { feature: '22% Affiliate Commission', crm: 'No', agency: 'Rare / low', rule7: 'Yes (Professional+)', highlight: true },
  { feature: 'Self-funding potential', crm: 'No', agency: 'No', rule7: 'Yes (Professional+)', highlight: true },
  { feature: 'Complete ecosystem', crm: 'No', agency: 'No', rule7: 'Yes', highlight: true }
];

const FAQS = [
  {
    q: 'Do I have to buy the video series to use the dashboard?',
    a: 'No. The series is completely optional. You can start with any plan and add the branded, unbranded or fully bespoke version later.'
  },
  {
    q: 'Which plans include the 22% Affiliate Commission?',
    a: 'Professional, Growth and Done-For-You plans only. This is a deliberate incentive for longer-term commitment.'
  },
  {
    q: 'How does the 22% affiliate commission work?',
    a: 'You recruit vehicle owners and advertisers to the Rule7 Reverse Auction Platform. You earn 22% on their subscriptions — enough for many businesses to cover their entire dashboard cost.'
  },
  {
    q: 'What is the Reverse Auction Platform?',
    a: 'It allows advertisers from 25 industries who do not own suitable vehicles to access vehicle-wrap advertising for the first time, dramatically expanding the addressable market.'
  },
  {
    q: 'Why is the exclusive radius limited to 30 miles?',
    a: 'A 30-mile radius prevents overlap between neighbouring Signwriters and Vehicle Wrapping Businesses while still giving you strong local priority.'
  },
  {
    q: 'How does the lead scoring actually work?',
    a: 'The education series and subsequent interactions collect structured data. That data continuously refines each lead’s score inside your CRM dashboard so you prioritise only the highest-intent opportunities.'
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. After the initial commitment period of your chosen plan you can cancel at any time. Monthly video add-ons can be cancelled immediately.'
  },
  {
    q: 'Where can I see the education system?',
    a: 'Click “See how we educate advertisers” at the top of the page — it opens in a new tab so you never leave the pricing flow.'
  }
];

export const Pricing = () => {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');

  // Step: 'plans' | 'details' | 'checkout'
  const [step, setStep] = useState('plans');
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Video add-on state in Step 1 & 2
  const [selectedAddon, setSelectedAddon] = useState(null); // 'branded' | 'unbranded' | 'bespoke' | null
  const [addonBillingType, setAddonBillingType] = useState('oneTime'); // 'oneTime' | 'monthly'

  // FAQ open states
  const [openFaq, setOpenFaq] = useState(null);

  // Billing details form
  const [billing, setBilling] = useState({
    businessName: '',
    contactName: '',
    email: '',
    territory: '',
    overnightFitting: 'Yes'
  });

  const scrollToPlans = () => {
    const el = document.getElementById('pricing-plans-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPlan = (plan) => {
    if (plan.id === 'dfy') {
      navigate('/done-for-you');
      return;
    }
    setSelectedPlan(plan);
    setStep('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAddon = (addonId) => {
    if (selectedAddon === addonId) {
      setSelectedAddon(null);
    } else {
      setSelectedAddon(addonId);
    }
  };

  // Direct checkout for Add-on (standalone or bundled)
  const handleCheckoutWithAddon = (addonId) => {
    setSelectedAddon(addonId);
    if (!selectedPlan) {
      // Default to standalone video education license if no plan was picked yet
      setSelectedPlan({
        id: 'standalone_addon',
        name: 'Video Education Series (Standalone)',
        shortName: 'Video Add-on',
        price: 0,
        commitmentText: 'Standalone Video License',
        period: '',
        color: 'neonCyan',
        features: [
          'Full 7-Video Education Series',
          'Cloud hosting & streaming included',
          'Full commercial & marketing usage rights',
          'Free updates when core content refreshes'
        ]
      });
    }
    setStep('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = async (e) => {
    e.preventDefault();
    setError('');

    if (!billing.businessName || !billing.email || !billing.territory) {
      setError('Please fill in all required fields before continuing.');
      return;
    }

    const planId = selectedPlan ? selectedPlan.id : 'standalone_addon';
    setLoadingPlan(planId);

    // Calculate final price with optional add-on
    let addonTotal = 0;
    if (selectedAddon) {
      const addonObj = VIDEO_ADDONS.find(a => a.id === selectedAddon);
      if (addonObj) {
        addonTotal = addonBillingType === 'oneTime' ? addonObj.oneTimePrice : addonObj.monthlyPrice;
      }
    }

    const basePlanPrice = selectedPlan ? selectedPlan.price : 0;
    const totalToPay = basePlanPrice + addonTotal;

    localStorage.setItem('r7_selected_plan', selectedPlan ? selectedPlan.name : 'Standalone Addon');
    localStorage.setItem('r7_selected_addon', selectedAddon || 'none');
    localStorage.setItem('r7_addon_billing', addonBillingType);
    localStorage.setItem('r7_billing_email', billing.email);
    localStorage.setItem('r7_billing_business', billing.businessName);
    localStorage.setItem('r7_billing_territory', billing.territory);

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalToPay,
          currency: 'usd',
          planName: selectedPlan ? selectedPlan.name : 'Video Education Series',
          addonName: selectedAddon,
          email: billing.email,
          businessName: billing.businessName
        })
      });

      const data = await res.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        localStorage.setItem('r7_payment_complete', 'true');
        navigate('/partner/register');
      }
    } catch (err) {
      localStorage.setItem('r7_payment_complete', 'true');
      navigate('/partner/register');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleBack = () => {
    if (step === 'details') setStep('plans');
    else if (step === 'checkout') setStep('details');
    setError('');
  };

  const activeAddonObj = selectedAddon ? VIDEO_ADDONS.find(a => a.id === selectedAddon) : null;
  const activeAddonPrice = activeAddonObj 
    ? (addonBillingType === 'oneTime' ? activeAddonObj.oneTimePrice : activeAddonObj.monthlyPrice)
    : 0;

  return (
    <div className="min-h-screen bg-darkBg text-white flex flex-col font-sans selection:bg-neonRed selection:text-white pb-16">

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 py-4 px-6 flex justify-between items-center bg-darkBg/90 backdrop-blur-md border-b border-slate-900">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-neonRed flex items-center justify-center font-black text-white shadow-lg">R</div>
          <span className="font-grotesk font-bold text-xl tracking-tight">Rule7<span className="text-neonRed">Media</span></span>
        </div>
        <div className="flex items-center gap-5 text-xs font-semibold">
          {step !== 'plans' && (
            <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              ← Back to Plans
            </button>
          )}
          <a 
            href="/funnel" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-slate-400 hover:text-neonCyan transition-colors hidden sm:flex items-center gap-1"
          >
            <span>Educate Advertisers</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a 
            href="/affiliate" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-slate-400 hover:text-neonGreen transition-colors hidden sm:flex items-center gap-1"
          >
            <span>22% Affiliate</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button onClick={() => navigate('/admin/login')} className="text-slate-300 hover:text-white transition-colors bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            Dashboard Login
          </button>
        </div>
      </nav>

      {/* STEP 1: Main Landing & Pricing Page */}
      {step === 'plans' && (
        <div className="pt-20">

          {/* Hero Section */}
          <section className="relative pt-12 pb-16 px-6 overflow-hidden border-b border-slate-900/80">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-neonRed/10 rounded-full filter blur-[100px] pointer-events-none"></div>
            <div className="absolute top-24 right-1/4 w-[400px] h-[250px] bg-neonCyan/10 rounded-full filter blur-[120px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neonRed/10 border border-neonRed/30 text-neonRed text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rule7 Dashboard for Signwriters & Vehicle Wrapping Businesses</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-grotesk font-black text-white tracking-tight leading-[1.15] mb-6">
                The complete ecosystem that educates the customer, scores the lead, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonRed via-rose-400 to-neonCyan">opens an entirely new market</span> of advertisers.
              </h1>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto mb-8">
                <p className="font-medium text-white/90">
                  Most platforms only help you manage jobs. Rule7 turns digital advertisers into pre-qualified buyers, expands the market beyond vehicle owners, and — on longer-term plans — lets you earn <strong className="text-neonGreen font-bold">22% affiliate commission</strong> that can cover your entire subscription.
                </p>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Rule7 systematically converts digital advertisers into vehicle-wrap buyers through our proprietary 7-video education series. When you subscribe, you gain access to a growing pool of advertisers who have already been walked through why internet advertising is burning their budget — and why vehicle wraps deliver dramatically lower CPM and higher local visibility.
                </p>
                <p className="text-slate-400 text-xs sm:text-sm">
                  You can also optionally white-label or fully brand that same education series so your shop becomes the trusted educator in your market.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <button
                  onClick={scrollToPlans}
                  className="w-full sm:w-auto px-8 py-4 bg-neonRed hover:bg-neonRed/90 text-white font-bold text-sm rounded-xl transition-all shadow-xl glow-pink flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  <span>Choose Your Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="/funnel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <span>See how we educate advertisers</span>
                  <ExternalLink className="w-4 h-4 text-neonCyan" />
                </a>
                <a
                  href="/affiliate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-4 bg-neonGreen/10 hover:bg-neonGreen/20 text-neonGreen font-bold text-sm rounded-xl border border-neonGreen/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Become an affiliate & earn 22%</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* Advantage Strip */}
              <div className="pt-6 border-t border-slate-800/80">
                <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                  <span className="text-white">Educate the Customer</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-white">Collect Incremental Data</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-white">Refine Lead Scores</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-white">Expand the Market</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-neonGreen font-bold">Earn 22% Commission (Professional+)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Why Rule7 is the Complete Ecosystem (5 Advantages) */}
          <section className="py-16 px-6 bg-slate-950/40 border-b border-slate-900">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-neonCyan px-3 py-1 bg-neonCyan/10 rounded-full border border-neonCyan/20">
                  Unrivalled Advantages
                </span>
                <h2 className="text-2xl sm:text-4xl font-grotesk font-black text-white mt-4 mb-3">
                  Five advantages no other platform delivers for Signwriters and Vehicle Wrapping Businesses
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Built specifically to elevate vehicle wrapping shops from reactive estimators to market-leading authorities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. Customer Education */}
                <div className="glass-card p-6 rounded-2xl relative group hover:border-neonCyan/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-neonCyan/10 border border-neonCyan/30 flex items-center justify-center text-neonCyan mb-4">
                    <Video className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">1. Customer Education</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Our 7-video series converts sceptical digital advertisers into vehicle-wrap buyers before they ever contact you.
                  </p>
                </div>

                {/* 2. Incremental Data Collection */}
                <div className="glass-card p-6 rounded-2xl relative group hover:border-neonRed/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-neonRed/10 border border-neonRed/30 flex items-center justify-center text-neonRed mb-4">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">2. Incremental Data Collection</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Every interaction adds structured data that continuously improves lead quality.
                  </p>
                </div>

                {/* 3. Precise Lead Scoring */}
                <div className="glass-card p-6 rounded-2xl relative group hover:border-neonAmber/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-neonAmber/10 border border-neonAmber/30 flex items-center justify-center text-neonAmber mb-4">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">3. Precise Lead Scoring</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your CRM dashboard refines the score in real time so you only speak to the highest-intent leads.
                  </p>
                </div>

                {/* 4. Reverse Auction Platform */}
                <div className="glass-card p-6 rounded-2xl relative group hover:border-purple-500/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">4. Reverse Auction Platform</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Opens the vehicle-wrap market to advertisers from 25 different industries who do not own suitable vehicles. For the first time the market is no longer limited to businesses that already have their own vehicles.
                  </p>
                </div>

                {/* 5. 22% Affiliate Commission */}
                <div className="glass-card p-6 rounded-2xl relative group hover:border-neonGreen/50 transition-all lg:col-span-2 bg-gradient-to-r from-neonGreen/5 to-transparent border-neonGreen/30">
                  <div className="w-10 h-10 rounded-xl bg-neonGreen/10 border border-neonGreen/30 flex items-center justify-center text-neonGreen mb-4">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">
                        5. 22% Affiliate Commission <span className="text-xs text-neonGreen font-normal ml-1">(Professional plans and above)</span>
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                        Recruit vehicle owners and advertisers to the auction platform and earn enough to cover (or exceed) your own dashboard subscription.
                      </p>
                    </div>
                    <a
                      href="/affiliate"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neonGreen/20 hover:bg-neonGreen/30 text-neonGreen text-xs font-bold whitespace-nowrap transition-all border border-neonGreen/40 self-start sm:self-center"
                    >
                      <span>Join the affiliate programme</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Section: Pricing Plans */}
          <section id="pricing-plans-grid" className="py-20 px-6 relative">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-14">
                <span className="text-xs font-bold uppercase tracking-widest text-neonRed px-3 py-1 bg-neonRed/10 rounded-full border border-neonRed/20">
                  Transparent Pricing
                </span>
                <h2 className="text-3xl sm:text-5xl font-grotesk font-black text-white mt-4 mb-3">
                  Pricing Plans
                </h2>
                <p className="text-sm text-slate-400">
                  Select the subscription plan that fits your business scale. Built exclusively for Signwriters and Vehicle Wrapping Businesses.
                </p>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {PLANS.map((plan) => {
                  const isPop = plan.popular;
                  const isRec = plan.recommended;
                  return (
                    <div
                      key={plan.id}
                      className={`glass-card rounded-2xl p-6 relative flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] ${
                        isPop
                          ? 'border-neonRed/60 bg-gradient-to-b from-neonRed/10 to-slate-900/60 shadow-2xl ring-1 ring-neonRed/40 z-10'
                          : isRec
                          ? 'border-neonGreen/60 bg-gradient-to-b from-neonGreen/10 to-slate-900/60 shadow-2xl ring-1 ring-neonGreen/40 z-10'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Badge */}
                      {plan.badge && (
                        <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 ${
                          isPop ? 'bg-neonRed text-white shadow-neonRed/40' : isRec ? 'bg-neonGreen text-black font-black shadow-neonGreen/40' : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {isPop && <Star className="w-3 h-3 fill-white" />}
                          {isRec && <Award className="w-3 h-3 fill-black" />}
                          <span>{plan.badge}</span>
                        </div>
                      )}

                      <div>
                        {/* Header */}
                        <div className="mb-4 pt-2">
                          <div className={`text-[11px] font-black uppercase tracking-widest text-${plan.color} mb-1.5`}>
                            {plan.name}
                          </div>
                          <div className="flex items-baseline gap-1">
                            {plan.id === 'dfy' ? (
                              <div className="flex flex-col">
                                <div className="text-2xl font-black font-grotesk text-white">${plan.setupFee} <span className="text-xs text-slate-400 font-normal">setup</span></div>
                                <div className="text-sm font-bold text-neonAmber">+ ${plan.price} / month</div>
                              </div>
                            ) : (
                              <>
                                <span className="text-4xl font-black font-grotesk text-white">${plan.price}</span>
                                <span className="text-slate-400 text-xs">{plan.period}</span>
                              </>
                            )}
                          </div>
                          <p className="text-[11px] font-semibold text-slate-400 mt-2 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            {plan.commitmentText}
                          </p>
                          <p className="text-xs text-slate-400 mt-3 leading-snug min-h-[36px]">
                            {plan.tagline}
                          </p>
                        </div>

                        {/* Feature List */}
                        <div className="border-t border-slate-800/80 pt-4 mb-6">
                          <ul className="space-y-2.5">
                            {plan.features.map((f, fi) => {
                              const isAffiliateLine = f.includes('22% Affiliate');
                              return (
                                <li key={fi} className="flex items-start gap-2 text-xs text-slate-300">
                                  <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                                    isAffiliateLine ? 'text-neonGreen font-bold' : `text-${plan.color}`
                                  }`} />
                                  <span className={isAffiliateLine ? 'text-neonGreen font-bold' : ''}>{f}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        className={`w-full py-3.5 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 ${
                          isPop
                            ? 'bg-neonRed hover:bg-neonRed/90 text-white shadow-lg glow-pink'
                            : isRec
                            ? 'bg-neonGreen hover:bg-neonGreen/90 text-black shadow-lg glow-green'
                            : plan.id === 'dfy'
                            ? 'bg-neonAmber hover:bg-neonAmber/90 text-black shadow-lg'
                            : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white'
                        }`}
                      >
                        <span>{plan.ctaText}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Exclusive Radius & Commitment Note */}
              <div className="mt-8 text-center text-xs text-slate-500 max-w-2xl mx-auto">
                🔒 All plans include a protected <strong className="text-slate-300">30-mile (48km) exclusive radius</strong> to safeguard your local market dominance.
              </div>
            </div>
          </section>

          {/* Section: Optional Add-On: Own the Education Series */}
          <section className="py-16 px-6 bg-slate-950/60 border-y border-slate-900">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="text-xs font-bold uppercase tracking-widest text-neonCyan px-3 py-1 bg-neonCyan/10 rounded-full border border-neonCyan/20">
                  Optional Add-On
                </span>
                <h2 className="text-2xl sm:text-4xl font-grotesk font-black text-white mt-4 mb-3">
                  Want to own the education that converts digital advertisers?
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  The same 7-video series is available as an optional add-on so your Signwriting or Vehicle Wrapping Business can educate local businesses and own the conversation.
                </p>

                {/* Billing Toggle (One-time vs Monthly) */}
                <div className="mt-6 inline-flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setAddonBillingType('oneTime')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      addonBillingType === 'oneTime'
                        ? 'bg-neonCyan text-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    One-Time Purchase
                  </button>
                  <button
                    onClick={() => setAddonBillingType('monthly')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      addonBillingType === 'monthly'
                        ? 'bg-neonCyan text-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monthly Subscription
                  </button>
                </div>
              </div>

              {/* 3 Add-on Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {VIDEO_ADDONS.map((addon) => {
                  const isSelected = selectedAddon === addon.id;
                  const price = addonBillingType === 'oneTime' ? addon.oneTimePrice : addon.monthlyPrice;
                  const period = addonBillingType === 'oneTime' ? 'one-time' : '/ month';

                  return (
                    <div
                      key={addon.id}
                      className={`glass-card rounded-2xl p-6 relative flex flex-col justify-between transition-all border ${
                        isSelected
                          ? 'border-neonCyan bg-neonCyan/10 ring-2 ring-neonCyan/50 shadow-2xl shadow-neonCyan/10'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-black uppercase tracking-widest text-${addon.color}`}>
                            {addon.name}
                          </span>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded bg-neonCyan text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Selected
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1 mb-3">
                          <span className="text-3xl font-black font-grotesk text-white">${price}</span>
                          <span className="text-slate-400 text-xs">{period}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-6">
                          {addon.desc}
                        </p>
                      </div>

                      <div className="space-y-2 mt-auto">
                        <button
                          onClick={() => handleCheckoutWithAddon(addon.id)}
                          className={`w-full py-3.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-neonCyan to-cyan-400 hover:from-cyan-300 hover:to-neonCyan text-black shadow-lg hover:shadow-cyan-500/20 active:scale-[0.99]`}
                        >
                          <span>Add {addon.name} &rarr;</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedAddon(addon.id);
                            scrollToPlans();
                          }}
                          className="w-full py-2 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-all flex items-center justify-center gap-1"
                        >
                          <span>Bundle with Dashboard Plan &uarr;</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Addon guarantee line */}
              <div className="mt-8 text-center text-xs text-slate-400 bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 max-w-3xl mx-auto">
                🛡️ All versions include hosting, basic analytics, and full commercial usage rights. Updates included when we refresh the core content.
              </div>
            </div>
          </section>

          {/* Floating Bottom Cart Bar when Addon is Selected */}
          {selectedAddon && activeAddonObj && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl bg-slate-900/95 backdrop-blur-xl border-2 border-neonCyan rounded-2xl p-4 shadow-2xl shadow-neonCyan/20 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-6 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neonCyan/20 border border-neonCyan/40 flex items-center justify-center text-neonCyan flex-shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{activeAddonObj.name}</span>
                    <span className="text-neonCyan font-black">${activeAddonPrice} ({addonBillingType === 'oneTime' ? 'one-time' : '/mo'})</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {selectedPlan ? `Bundled with ${selectedPlan.name}` : 'Ready to checkout as standalone or bundled'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedAddon(null)}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white rounded-lg"
                >
                  Remove
                </button>
                <button
                  onClick={() => handleCheckoutWithAddon(selectedAddon)}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-neonCyan hover:bg-cyan-300 text-black font-black text-xs transition-all shadow-lg flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          )}

          {/* Section: How Rule7 Compares (Comparison Table) */}
          <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-neonCyan px-3 py-1 bg-neonCyan/10 rounded-full border border-neonCyan/20">
                  Comprehensive Comparison
                </span>
                <h2 className="text-2xl sm:text-4xl font-grotesk font-black text-white mt-4 mb-3">
                  Why Signwriters and Vehicle Wrapping Businesses choose Rule7
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  See how Rule7 goes far beyond traditional shop software and pure lead generation agencies.
                </p>
              </div>

              {/* Table wrapper */}
              <div className="glass-card rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80">
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-300 w-2/5">
                          Feature / Advantage
                        </th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center w-1/5">
                          Typical CRM / Shop Software
                        </th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center w-1/5">
                          Pure Lead-Gen / DFY Agencies
                        </th>
                        <th className="p-4 text-xs font-black uppercase tracking-wider text-neonRed bg-neonRed/10 text-center w-1/5 border-l border-r border-neonRed/30">
                          Rule7 Dashboard
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs">
                      {COMPARISON_ROWS.map((row, idx) => (
                        <tr key={idx} className={`hover:bg-slate-900/40 transition-colors ${row.highlight ? 'bg-slate-900/20' : ''}`}>
                          <td className="p-4 font-semibold text-slate-200">
                            {row.feature}
                          </td>
                          <td className="p-4 text-slate-400 text-center">
                            {row.crm}
                          </td>
                          <td className="p-4 text-slate-400 text-center">
                            {row.agency}
                          </td>
                          <td className="p-4 font-bold text-neonCyan text-center bg-neonRed/5 border-l border-r border-neonRed/20">
                            {row.rule7}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Key Takeaway Card */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-neonRed/10 via-slate-900 to-neonCyan/10 border border-slate-800 relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neonRed/20 border border-neonRed/40 flex items-center justify-center text-neonRed flex-shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-white mb-1">Key Takeaway</div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Only Rule7 combines operations tools with customer education, continuous lead scoring, a Reverse Auction that opens an entirely new market, and — on Professional plans and above — a <strong>22% affiliate programme</strong> that can make your subscription self-funding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Frequently Asked Questions */}
          <section className="py-16 px-6 bg-slate-950/40 border-t border-slate-900">
            <div className="max-w-4xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-neonCyan px-3 py-1 bg-neonCyan/10 rounded-full border border-neonCyan/20">
                  Got Questions?
                </span>
                <h2 className="text-2xl sm:text-4xl font-grotesk font-black text-white mt-4 mb-2">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Everything you need to know about subscriptions, auction access, and affiliate earnings.
                </p>
              </div>

              <div className="space-y-3">
                {FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className={`glass-card rounded-xl border transition-all duration-200 overflow-hidden ${
                        isOpen ? 'border-neonCyan/50 bg-slate-900/60' : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-4 sm:p-5 text-left flex justify-between items-center gap-4 text-xs sm:text-sm font-bold text-white hover:text-neonCyan transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-neonCyan' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-5 sm:px-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Section: Why This Matters */}
          <section className="py-16 px-6 border-t border-slate-900 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neonRed/5 rounded-full filter blur-[100px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto glass-card p-8 sm:p-12 rounded-3xl border border-slate-800 relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neonCyan/10 border border-neonCyan/30 text-neonCyan text-[11px] font-bold uppercase tracking-wider mb-4">
                The Rule7 Difference
              </div>
              <h2 className="text-2xl sm:text-4xl font-grotesk font-black text-white mb-6">
                Why This Matters
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed text-left sm:text-center max-w-3xl mx-auto">
                <p>
                  Most software only helps Signwriters and Vehicle Wrapping Businesses manage the jobs they already have.
                </p>
                <p>
                  Rule7 is different. We educate digital advertisers, collect the data that scores them, open an entirely new market of advertisers who don’t own vehicles through our Reverse Auction Platform, and — on Professional plans and above — give you a <strong className="text-neonGreen">22% affiliate commission</strong> so your own subscription can effectively pay for itself.
                </p>
                <p className="text-slate-400">
                  When you add the education series (branded, unbranded or fully bespoke), you stop competing only on price and start owning the conversation in your market — while the auction platform and affiliate programme turn your business into both a service provider and a revenue-generating node in the complete Rule7 ecosystem.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={scrollToPlans}
                  className="px-8 py-3.5 bg-neonRed hover:bg-neonRed/90 text-white font-bold text-xs rounded-xl transition-all shadow-lg glow-pink flex items-center gap-2"
                >
                  <span>Get Started with Rule7</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Footer Trust Line */}
          <div className="py-8 px-6 text-center border-t border-slate-900 bg-slate-950">
            <p className="text-xs text-slate-400 font-medium">
              No hidden fees. Built exclusively for Signwriters and Vehicle Wrapping Businesses.
            </p>
            <p className="text-[11px] text-slate-600 mt-1 uppercase tracking-wider">
              The complete ecosystem: Educate · Collect · Score · Expand · Earn (Professional+).
            </p>
          </div>

        </div>
      )}

      {/* STEP 2: Subscription Details */}
      {step === 'details' && selectedPlan && (
        <div className="flex-1 max-w-4xl w-full mx-auto px-6 pb-16 pt-24">
          <div className="text-center mb-8">
            <span className={`text-xs font-bold uppercase tracking-widest text-${selectedPlan.color} px-3 py-1 bg-${selectedPlan.color}/10 rounded-full border border-${selectedPlan.color}/20`}>
              {selectedPlan.name}
            </span>
            <h2 className="text-3xl font-grotesk font-black text-white mt-4 mb-2">Subscription & Checkout Details</h2>
            <p className="text-xs sm:text-sm text-slate-400">Review your plan, optional video add-ons, and territory protection details before proceeding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* Order Summary */}
            <div className="md:col-span-2">
              <div className="glass-card rounded-2xl p-6 sticky top-24 border border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Order Summary</h3>
                
                {/* Plan line */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-sm font-bold text-white block">{selectedPlan.name}</span>
                    <span className="text-[10px] text-slate-400">{selectedPlan.commitmentText}</span>
                  </div>
                  <span className={`text-xs font-bold text-${selectedPlan.color} px-2 py-0.5 rounded bg-${selectedPlan.color}/10 whitespace-nowrap`}>
                    ${selectedPlan.price}/mo
                  </span>
                </div>

                {/* Add-on line if selected */}
                {activeAddonObj && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-neonCyan block">{activeAddonObj.name} (Add-on)</span>
                      <span className="text-[10px] text-slate-400">
                        {addonBillingType === 'oneTime' ? 'One-time license' : 'Monthly billing'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-neonCyan">
                      +${activeAddonPrice}{addonBillingType === 'monthly' ? '/mo' : ''}
                    </span>
                  </div>
                )}

                {/* Features */}
                <div className="border-t border-slate-800 pt-3 mt-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Included in this plan:</span>
                  <ul className="space-y-1.5 mb-4">
                    {selectedPlan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 className={`w-3 h-3 text-${selectedPlan.color} flex-shrink-0 mt-0.5`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Total */}
                <div className="border-t border-slate-800 pt-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Base monthly</span>
                    <span>${selectedPlan.price}.00</span>
                  </div>
                  {activeAddonObj && (
                    <div className="flex justify-between text-xs text-neonCyan mb-1">
                      <span>Video Add-on</span>
                      <span>+${activeAddonPrice}.00</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-white mt-3 pt-2 border-t border-slate-800">
                    <span>Total First Payment</span>
                    <span>${selectedPlan.price + activeAddonPrice}.00</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                    🔒 Includes 30-mile protected territory. Cancel anytime after the initial commitment period.
                  </p>
                </div>
              </div>
            </div>

            {/* Business & Billing Details Form */}
            <div className="md:col-span-3">
              <div className="glass-card rounded-2xl p-7 relative overflow-hidden border border-slate-800">
                <h3 className="text-sm font-bold text-white mb-5">Your Business Details</h3>

                <form onSubmit={handleProceedToCheckout} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                      Business / Shop Name <span className="text-neonRed">*</span>
                    </label>
                    <input
                      type="text"
                      value={billing.businessName}
                      onChange={e => setBilling(p => ({ ...p, businessName: e.target.value }))}
                      placeholder="e.g. Apex Signwriting & Vehicle Wraps"
                      required
                      className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={billing.contactName}
                      onChange={e => setBilling(p => ({ ...p, contactName: e.target.value }))}
                      placeholder="e.g. John Smith"
                      className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                      Business Email <span className="text-neonRed">*</span>
                    </label>
                    <input
                      type="email"
                      value={billing.email}
                      onChange={e => setBilling(p => ({ ...p, email: e.target.value }))}
                      placeholder="john@apexwraps.com"
                      required
                      className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                      Protected Territory / City (30-Mile Radius) <span className="text-neonRed">*</span>
                    </label>
                    <input
                      type="text"
                      value={billing.territory}
                      onChange={e => setBilling(p => ({ ...p, territory: e.target.value }))}
                      placeholder="e.g. Sydney, NSW"
                      required
                      className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Your 30-mile geographic protection will be locked upon activation.</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                      Do you offer Overnight or Weekend Fitting?
                    </label>
                    <select
                      value={billing.overnightFitting}
                      onChange={e => setBilling(p => ({ ...p, overnightFitting: e.target.value }))}
                      className="w-full glass-input rounded-lg p-3 text-slate-100 bg-slate-900 border border-slate-800 focus:ring-1 focus:ring-neonCyan text-xs"
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

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                    <Lock className="w-3.5 h-3.5 text-neonGreen flex-shrink-0" />
                    <span>Your information is encrypted with 256-bit SSL security.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loadingPlan !== null}
                    className="w-full py-4 bg-neonRed hover:bg-neonRed/90 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg glow-pink disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loadingPlan ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Proceed to Secure Checkout</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <GlobalFooter />
    </div>
  );
};

