import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Send, Check } from 'lucide-react';
import { GlobalFooter } from '../components/GlobalFooter';

export const DoneForYou = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    fleetSize: '1 - 5 vehicles',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    localStorage.setItem('r7_last_inquiry', JSON.stringify({
      plan: 'Done-For-You',
      ...formData,
      date: new Date().toISOString()
    }));
  };

  const handleStripeCheckout = () => {
    localStorage.setItem('r7_selected_plan', 'Plan 4: Done-For-You');
    localStorage.setItem('r7_billing_email', formData.email || 'admin@rule7media.com');
    localStorage.setItem('r7_billing_business', formData.company || 'Greenfield Logistics');
    window.location.href = 'https://buy.stripe.com/mock_dfy_1499';
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-white flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-6 py-10 md:py-14">
        
        {/* Top Badges / Navigation */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700/60 hover:border-cyan-400/50 hover:text-cyan-400 transition-all text-slate-300 backdrop-blur-md shadow-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
          
          <span className="inline-flex items-center text-[11px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 backdrop-blur-md shadow-sm">
            DFY SERVICE
          </span>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Plan Information */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black font-grotesk tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 mb-3">
                Done-For-You Plan
              </h1>
              
              <div className="flex flex-wrap items-baseline gap-2 mb-5">
                <span className="text-3xl md:text-4xl font-black text-white font-grotesk">$1,499</span>
                <span className="text-slate-400 text-sm font-medium">/ wrap setup +</span>
                <span className="text-3xl md:text-4xl font-black text-white font-grotesk">$99</span>
                <span className="text-slate-400 text-sm font-medium">/ month</span>
              </div>

              <p className="text-slate-400 text-sm md:text-[15px] leading-relaxed">
                Get a completely built local wrap marketing machine. Our professional team designs your custom wrap concepts, structures your territory-protected landing funnel, configures the automated lead scoring dashboard, and integrates everything with your existing software stack.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Custom High-Converting Vinyl Wrap Designs</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Our premium vehicle wrap concepts are optimized visually to maximize offline scans and lead conversions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Geographical Funnel & Domain Setup</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    We host and customize your complete gated video training series targeted specifically to your local region.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Full CRM & Software Integration</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Leads are automatically pushed and categorized (Cold/Warm/Hot) directly to your Salesforce, HubSpot, or custom CRM.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Dedicated Campaign Manager & Monthly Reports</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Get a marketing expert reviewing your data monthly and sending detailed reports on CPC savings and ROI metrics.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Request Form Card */}
          <div className="lg:col-span-6">
            <div className="bg-[#0b101b]/85 border border-slate-800/90 rounded-2xl p-7 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

              {!submitted ? (
                <>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 font-grotesk">
                    Request Done-For-You Package
                  </h3>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Fill out the form below and one of our wrap strategy experts will contact you to map out your custom setup.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        CONTACT NAME
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full bg-[#050811]/90 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        BUSINESS EMAIL
                      </label>
                      <input
                        type="email"
                        placeholder="admin@rule7media.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full bg-[#050811]/90 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        PHONE NUMBER
                      </label>
                      <input
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="w-full bg-[#050811]/90 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        COMPANY NAME
                      </label>
                      <input
                        type="text"
                        placeholder="Greenfield Logistics"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                        className="w-full bg-[#050811]/90 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        ESTIMATED FLEET SIZE
                      </label>
                      <select
                        value={formData.fleetSize}
                        onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                        className="w-full bg-[#050811]/90 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all cursor-pointer"
                      >
                        <option value="1 - 5 vehicles">1 - 5 vehicles</option>
                        <option value="6 - 15 vehicles">6 - 15 vehicles</option>
                        <option value="16 - 50 vehicles">16 - 50 vehicles</option>
                        <option value="50+ vehicles">50+ vehicles</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        MESSAGE / SPECIFIC GOALS
                      </label>
                      <textarea
                        rows="3"
                        placeholder="Tell us about your business goals and service area..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-[#050811]/90 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl font-bold text-xs md:text-sm text-white bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 hover:opacity-95 shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    >
                      <span>Send Plan Request</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  <div className="text-center my-3 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    — OR —
                  </div>

                  <button
                    type="button"
                    onClick={handleStripeCheckout}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-xs md:text-sm text-white bg-[#635bff] hover:bg-[#736bff] shadow-lg shadow-[#635bff]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <span className="font-serif italic font-black text-base leading-none">stripe</span>
                    <span>Instant Stripe Checkout</span>
                  </button>
                </>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-grotesk">Request Received!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you. Your request for the <strong className="text-white">Done-For-You</strong> package has been securely submitted. Our wrap strategy team will contact you shortly.
                  </p>
                  <button
                    onClick={() => navigate('/partner/register')}
                    className="mt-4 py-3 px-6 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-400 to-purple-500 hover:opacity-95 transition-all shadow-lg inline-flex items-center gap-2"
                  >
                    <span>Create Owner Account &rarr;</span>
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Global Footer */}
      <GlobalFooter />
    </div>
  );
};
