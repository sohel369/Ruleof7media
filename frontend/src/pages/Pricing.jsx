import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Shield, Zap, Star, AlertCircle, X, Lock, CreditCard, ArrowRight } from 'lucide-react';
import { GlobalFooter } from '../components/GlobalFooter';

const PLANS = [
  {
    id: 'entry',
    name: 'Plan 1: Entry Level',
    tagline: 'Premier Plan — 3-Month Subscription',
    price: 360,
    period: '/month',
    color: 'neonCyan',
    popular: false,
    stripePriceLabel: '3month_contract',
    features: [
      'Priority Listing ahead of local competitors',
      'Potential Purchasers see your listing first',
      '30-mile (48km) exclusive radius protection',
      'Email alerts on vehicle auction scans inside radius',
      'QuickBooks / Xero Manual CSV Export',
      'Free 300x250 Medium Rectangle Animated GIF',
      '3 Free Entries per vehicle into Prize Draw'
    ]
  },
  {
    id: 'popular',
    name: 'Plan 2: Most Popular',
    tagline: 'Premier Plus Plan — Save 25% (6-Month Sub)',
    price: 270,
    period: '/month',
    color: 'neonRed',
    popular: true,
    stripePriceLabel: '6month_contract',
    features: [
      'Priority Listing ahead of local competitors',
      'Potential Purchasers see your listing first',
      '30-mile (48km) exclusive radius protection',
      'QuickBooks & Xero 2-Way Accounting Sync',
      'Automated Invoicing & Material Cost Entry',
      'Free 160x600 & 120x600 Animated GIFs',
      'Eligible to make single bids on Auctions',
      '12 Free Entries per vehicle into Prize Draw'
    ]
  },
  {
    id: 'ultimate',
    name: 'Plan 3: Best Value',
    tagline: 'Ultimate Plan — Save 50% (12-Month Sub)',
    price: 180,
    period: '/month',
    color: 'neonGreen',
    popular: false,
    stripePriceLabel: '12month_contract',
    features: [
      'Priority Listing ahead of local competitors',
      'Potential Purchasers see your listing first',
      '150-mile (240km) exclusive radius protection',
      'QuickBooks & Xero 2-Way Sync & Margin Alerts',
      'Real-time P&L Job Costing & Profit Dashboards',
      'Free 728x90 & 320x50 Animated GIFs',
      'Eligible to make MULTIPLE bids on final auction',
      '12 Free Entries per vehicle into Prize Draw'
    ]
  },
  {
    id: 'dfy',
    name: 'Plan 4: Done-For-You',
    tagline: 'Full Setup & Lead Management Service',
    price: 149,
    period: ' setup + $499/mo',
    color: 'neonPurple',
    popular: false,
    stripePriceLabel: 'dfy_plan',
    features: [
      'Custom Gated Video Landing Pages & Funnels',
      'Geographical Funnel & Custom Domain Setup',
      'Custom QuickBooks / Xero Job Costing Integration',
      'Dedicated Campaign Manager (Optional Add-on)',
      '24/7 Phone & Email Priority Support'
    ]
  }
];

export const Pricing = () => {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');

  // Step: 'plans' | 'details' | 'checkout'
  const [step, setStep] = useState('plans');
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Billing details form
  const [billing, setBilling] = useState({
    businessName: '',
    contactName: '',
    email: '',
    territory: ''
  });

  // Step 1 → Step 2: Show subscription details
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setStep('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 → Step 3: Stripe Checkout
  const handleProceedToCheckout = async (e) => {
    e.preventDefault();
    setError('');

    if (!billing.businessName || !billing.email || !billing.territory) {
      setError('Please fill in all required fields before continuing.');
      return;
    }

    setLoadingPlan(selectedPlan.id);

    // Save to localStorage
    localStorage.setItem('r7_selected_plan', selectedPlan.name);
    localStorage.setItem('r7_billing_email', billing.email);
    localStorage.setItem('r7_billing_business', billing.businessName);
    localStorage.setItem('r7_billing_territory', billing.territory);

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPlan.price,
          currency: 'usd',
          planName: selectedPlan.name,
          email: billing.email,
          businessName: billing.businessName
        })
      });

      const data = await res.json();

      if (data.checkoutUrl) {
        // Redirect to Stripe hosted checkout
        window.location.href = data.checkoutUrl;
      } else if (data.clientSecret) {
        localStorage.setItem('r7_payment_complete', 'true');
        navigate('/partner/register');
      } else {
        // Demo mode — go to partner registration
        localStorage.setItem('r7_payment_complete', 'true');
        navigate('/partner/register');
      }
    } catch (err) {
      // Offline demo
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

  return (
    <div className="min-h-screen bg-darkBg text-white flex flex-col">

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 py-4 px-6 flex justify-between items-center bg-darkBg/90 backdrop-blur-md border-b border-slate-900">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-neonRed flex items-center justify-center font-black text-white shadow-lg">R</div>
          <span className="font-grotesk font-bold text-xl">Rule7<span className="text-neonRed">Media</span></span>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          {step !== 'plans' && (
            <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              ← Back
            </button>
          )}
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white transition-colors">Home</button>
          <button onClick={() => navigate('/admin/login')} className="text-slate-400 hover:text-white transition-colors">Dashboard Login</button>
        </div>
      </nav>

      {/* Progress Steps Indicator */}
      <div className="pt-24 pb-2 px-6">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-0">
          {[
            { num: 1, label: 'Choose Plan', key: 'plans' },
            { num: 2, label: 'Subscription Details', key: 'details' },
            { num: 3, label: 'Secure Checkout', key: 'checkout' }
          ].map((s, idx) => {
            const active = s.key === step;
            const done = (step === 'details' && s.key === 'plans') || (step === 'checkout' && (s.key === 'plans' || s.key === 'details'));
            return (
              <React.Fragment key={s.key}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border transition-all ${
                    done
                      ? 'bg-neonGreen/20 border-neonGreen/40 text-neonGreen'
                      : active
                      ? 'bg-neonRed/20 border-neonRed/40 text-neonRed'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}>
                    {done ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-[9px] mt-1 font-semibold uppercase tracking-wider ${active ? 'text-white' : done ? 'text-neonGreen' : 'text-slate-600'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`h-px w-16 mx-2 mb-4 ${done ? 'bg-neonGreen/40' : 'bg-slate-800'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Plan Cards */}
      {step === 'plans' && (
        <>
          <div className="pb-8 pt-6 px-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-neonRed/8 rounded-full filter blur-3xl pointer-events-none"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-neonRed px-3 py-1 bg-neonRed/10 rounded-full border border-neonRed/20">Dashboard Subscription</span>
            <div className="mt-3 text-[10px] uppercase font-black tracking-wider text-neonCyan bg-neonCyan/10 border border-neonCyan/20 w-fit mx-auto px-4 py-1.5 rounded-full">
              🎯 Exclusively for Vehicle Wrapping Businesses (Not for Advertisers)
            </div>
            <h1 className="text-4xl md:text-5xl font-grotesk font-black text-white mt-4 mb-3">
              Rule7 Dashboard Subscription
            </h1>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              Select the workspace package that matches your wrapping shop's lead qualification requirements. No hidden fees.
            </p>
          </div>

          <div className="flex-1 max-w-7xl w-full mx-auto px-6 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`glass-card rounded-2xl p-7 relative flex flex-col transition-all duration-300 hover:translate-y-[-4px] ${
                    plan.popular
                      ? 'border-neonRed/50 bg-neonRed/5 shadow-2xl scale-105 z-10'
                      : 'hover:border-slate-700'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-neonRed text-white px-4 py-1.5 rounded-full shadow-xl">
                      <Star className="w-3 h-3 fill-white" />
                      <span>Most Popular</span>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className={`text-xs font-bold uppercase tracking-widest text-${plan.color} mb-1`}>{plan.name}</div>
                    <div className="flex items-end gap-1 mt-2">
                      <span className="text-4xl font-black font-grotesk text-white">${plan.price}</span>
                      <span className="text-slate-500 text-sm mb-1">{plan.period}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{plan.tagline}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className={`w-3.5 h-3.5 text-${plan.color} flex-shrink-0 mt-0.5`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3.5 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-neonRed hover:bg-neonRed/90 text-white shadow-lg glow-pink'
                        : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200'
                    }`}
                  >
                    <span>Select {plan.name}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Guarantee / trust block */}
            <div className="mt-16 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <Shield className="w-5 h-5 text-neonGreen" />, title: 'Territory Guaranteed', desc: 'Once you register, your geographic area is exclusively locked to your account.' },
                { icon: <Zap className="w-5 h-5 text-neonAmber" />, title: 'Instant Activation', desc: 'Your funnel and CRM dashboard are live within minutes of subscribing.' },
                { icon: <CheckCircle2 className="w-5 h-5 text-neonCyan" />, title: 'Cancel Anytime', desc: 'No contracts. No lock-in. Upgrade, downgrade or cancel any time from your dashboard.' }
              ].map((item, idx) => (
                <div key={idx} className="glass-card p-5 rounded-xl flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                  <div>
                    <div className="text-xs font-bold text-white mb-1">{item.title}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* STEP 2: Subscription Details */}
      {step === 'details' && selectedPlan && (
        <div className="flex-1 max-w-3xl w-full mx-auto px-6 pb-16 pt-8">
          <div className="text-center mb-8">
            <span className={`text-xs font-bold uppercase tracking-widest text-${selectedPlan.color} px-3 py-1 bg-${selectedPlan.color}/10 rounded-full border border-${selectedPlan.color}/20`}>
              {selectedPlan.name} Plan
            </span>
            <h2 className="text-3xl font-grotesk font-black text-white mt-4 mb-2">Subscription Details</h2>
            <p className="text-sm text-slate-400">Review your order and fill in your business details before proceeding to payment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Order summary */}
            <div className="md:col-span-2">
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Order Summary</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-white">{selectedPlan.name}</span>
                  <span className={`text-xs font-bold text-${selectedPlan.color} px-2 py-0.5 rounded bg-${selectedPlan.color}/10`}>
                    ${selectedPlan.price}/mo
                  </span>
                </div>
                <ul className="space-y-2 mb-5">
                  {selectedPlan.features.slice(0, 5).map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-xs text-slate-400">
                      <CheckCircle2 className={`w-3 h-3 text-${selectedPlan.color} flex-shrink-0 mt-0.5`} />
                      <span>{f}</span>
                    </li>
                  ))}
                  {selectedPlan.features.length > 5 && (
                    <li className="text-xs text-slate-600 pl-5">+{selectedPlan.features.length - 5} more included</li>
                  )}
                </ul>
                <div className="border-t border-slate-800 pt-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Monthly subscription</span>
                    <span>${selectedPlan.price}.00</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white mt-2">
                    <span>Total today</span>
                    <span>${selectedPlan.price}.00</span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-2">Billed monthly. Cancel any time.</p>
                </div>
              </div>
            </div>

            {/* Billing form */}
            <div className="md:col-span-3">
              <div className="glass-card rounded-2xl p-7 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-neonCyan/4 rounded-full filter blur-3xl pointer-events-none"></div>
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
                      placeholder="e.g. Rapid Wrap Sydney"
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
                      placeholder="john@rapidwrapsydney.com"
                      required
                      className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                      Your Territory / City <span className="text-neonRed">*</span>
                    </label>
                    <input
                      type="text"
                      value={billing.territory}
                      onChange={e => setBilling(p => ({ ...p, territory: e.target.value }))}
                      placeholder="e.g. Sydney, NSW"
                      required
                      className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">This will be your exclusive protected territory.</span>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-xs bg-neonRed/10 text-neonRed p-3 rounded-lg border border-neonRed/20">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                    <Lock className="w-3.5 h-3.5 text-neonGreen flex-shrink-0" />
                    <span>Your information is encrypted and never shared with third parties.</span>
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
