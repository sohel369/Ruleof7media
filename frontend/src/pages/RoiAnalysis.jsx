import React, { useState, useEffect } from 'react';

export function RoiAnalysis() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        // Save original body styles
        const originalBgColor = document.body.style.backgroundColor;
        const originalBgImage = document.body.style.backgroundImage;
        const originalColor = document.body.style.color;

        // Force body to match the exact HTML specification to prevent global CSS interference
        document.body.style.backgroundColor = '#0f172a';
        document.body.style.backgroundImage = 'none';
        document.body.style.color = '#ffffff';

        return () => {
            // Restore original body styles when navigating away
            document.body.style.backgroundColor = originalBgColor;
            document.body.style.backgroundImage = originalBgImage;
            document.body.style.color = originalColor;
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleScroll = (e, targetId) => {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            setIsMenuOpen(false);
        }
    };

    return (
        <div id="roi-page" className="font-sans antialiased text-white bg-slate-900 min-h-screen overflow-x-hidden">
            <style dangerouslySetInnerHTML={{__html: `
                /* Glassmorphism Utilities scoped to #roi-page to override any global settings */
                #roi-page .glass-panel {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                }

                #roi-page .glass-card {
                    background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    transition: all 0.3s ease;
                }

                #roi-page .glass-card:hover {
                    border-color: #e11d48;
                    transform: translateY(-5px);
                    box-shadow: 0 10px 40px -10px rgba(225, 29, 72, 0.3);
                }

                /* Text Gradients & Glows */
                #roi-page .text-gradient {
                    background: linear-gradient(135deg, #ffffff 0%, #e11d48 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                #roi-page .glow-text {
                    text-shadow: 0 0 20px rgba(225, 29, 72, 0.5);
                }
            `}} />

            {/* Navigation */}
            <nav className="fixed w-full z-50 glass-panel border-b-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <span className="text-2xl font-bold tracking-tighter text-white">
                                RULE<span className="text-rose">7</span> MEDIA
                            </span>
                        </div>
                        
                        {/* Desktop Menu */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                <a href="#benefits" onClick={(e) => handleScroll(e, '#benefits')} className="hover:text-rose transition-colors duration-300">Why Now?</a>
                                <a href="#data" onClick={(e) => handleScroll(e, '#data')} className="hover:text-rose transition-colors duration-300">The Data</a>
                                <a href="#success" onClick={(e) => handleScroll(e, '#success')} className="hover:text-rose transition-colors duration-300">Success Stories</a>
                                <a href="#contact" onClick={(e) => handleScroll(e, '#contact')} className="bg-rose hover:bg-roseHover text-white px-6 py-2 rounded-lg font-bold transition-all duration-300 shadow-lg shadow-rose/30">
                                    Get Qualified Leads
                                </a>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-mr-2 flex md:hidden">
                            <button onClick={toggleMenu} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`fixed inset-y-0 right-0 w-64 bg-slate-900 border-l border-gray-800 z-50 flex flex-col p-6 space-y-6 md:hidden glass-panel transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <button onClick={toggleMenu} className="absolute top-6 right-6 text-gray-400 hover:text-white">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <a href="#benefits" className="text-lg font-medium hover:text-rose" onClick={(e) => handleScroll(e, '#benefits')}>Why Now?</a>
                    <a href="#data" className="text-lg font-medium hover:text-rose" onClick={(e) => handleScroll(e, '#data')}>The Data</a>
                    <a href="#success" className="text-lg font-medium hover:text-rose" onClick={(e) => handleScroll(e, '#success')}>Success Stories</a>
                    <a href="#contact" className="bg-rose text-white px-6 py-3 rounded-lg font-bold text-center" onClick={(e) => handleScroll(e, '#contact')}>Get Qualified Leads</a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Glow Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose/20 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        
                        {/* Hero Text */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center px-3 py-1 rounded-full border border-rose/30 bg-rose/10 text-rose text-sm font-semibold tracking-wide uppercase">
                                <span className="w-2 h-2 bg-rose rounded-full mr-2 animate-pulse"></span>
                                First-Mover Advantage Alert
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                                You Are Burning <span className="text-rose glow-text">$13 per 1,000</span> to Be Forgotten.
                            </h1>
                            
                            <p className="text-xl text-gray-300 font-medium leading-relaxed">
                                Digital ads deliver a <span className="text-gray-500 line-through">19% recall rate</span> that vanishes the moment a user scrolls. Meanwhile, <span className="text-white font-bold">75% of consumers</span> actively search for brands they see in the real world, and <span className="text-rose font-bold">97% remember</span> the message they couldn't ignore.
                            </p>
                            
                            <p className="text-lg text-gray-400">
                                Stop funding the "scroll" and start capturing the <span className="text-rose font-bold">62% purchase influence</span> that digital channels can't touch. The market is shifting. Are you leading the charge?
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <a href="#contact" onClick={(e) => handleScroll(e, '#contact')} className="bg-rose hover:bg-roseHover text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg shadow-rose/40 transition-all duration-300 transform hover:scale-105 text-center">
                                    Stop the Bleeding
                                </a>
                                <a href="#data" onClick={(e) => handleScroll(e, '#data')} className="glass-panel hover:bg-white/10 text-white text-lg font-bold py-4 px-8 rounded-xl transition-all duration-300 text-center border border-white/20">
                                    See the Data
                                </a>
                            </div>
                            
                            <div className="pt-6 border-t border-gray-800">
                                <p className="text-sm text-gray-500 italic">
                                    "Doing the same thing over and over again and expecting a different result is the definition of insanity."
                                </p>
                            </div>
                        </div>

                        {/* Visual Comparison Graphic */}
                        <div className="relative">
                            <div className="glass-panel rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                                {/* Background Glow inside card */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose/30 rounded-full blur-[60px]"></div>
                                
                                <div className="grid grid-cols-2 gap-8 relative z-10">
                                    {/* Digital Side (Fear) */}
                                    <div className="space-y-6 opacity-60">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Digital Ads</span>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="text-5xl font-extrabold text-gray-600">19%</div>
                                            <div className="text-xs text-gray-500 font-bold uppercase">Recall Rate</div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="text-4xl font-bold text-gray-600">&lt;15%</div>
                                            <div className="text-xs text-gray-500 font-bold uppercase">1-Week Retention</div>
                                        </div>

                                        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Sentiment</div>
                                            <div className="text-sm text-gray-400">Intrusive / Ignored</div>
                                        </div>
                                    </div>

                                    {/* Solution Side (Greed) */}
                                    <div className="space-y-6 relative">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-6 h-6 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                            <span className="text-sm font-bold text-rose uppercase tracking-widest">The Shift</span>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="text-6xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(225,29,72,0.6)]">97%</div>
                                            <div className="text-xs text-rose font-bold uppercase">Recall Rate (5x Higher)</div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="text-4xl font-bold text-white">75%</div>
                                            <div className="text-xs text-rose font-bold uppercase">Immediate Search Action</div>
                                        </div>

                                        {/* Key Stat Badge */}
                                        <div className="mt-4 bg-rose/20 border border-rose/40 rounded-xl p-4 transform scale-105 shadow-lg">
                                            <div className="text-xs text-rose uppercase font-bold mb-1">Purchase Influence</div>
                                            <div className="text-2xl font-bold text-white">62%</div>
                                            <div className="text-xs text-rose mt-1">Of passersby buy</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating Stat Card */}
                            <div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-xl shadow-xl border border-rose/30 animate-bounce" style={{animationDuration: '3s'}}>
                                <div className="flex items-center space-x-3">
                                    <div className="bg-rose/20 p-2 rounded-lg">
                                        <svg className="w-6 h-6 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase font-bold">Positive Sentiment</div>
                                        <div className="text-xl font-bold text-white">92%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Benefits / Fear & Greed Grid */}
            <section id="benefits" className="py-20 bg-slate-900 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Digital is <span className="text-rose">Failing</span> Your Growth</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            The gap between "spending" and "investing" has never been wider. While digital costs rise, your recall drops. Here is the reality of the market shift.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1: The Fear (Cost & Invisibility) */}
                        <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-800 rounded-bl-full transition-all group-hover:bg-gray-700"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">The Digital Trap</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    You are paying **$14+ CPMs** for impressions that vanish in a scroll. Digital recall has cratered to **19%**, and sentiment is often negative due to intrusive ads.
                                </p>
                                <div className="text-rose font-bold text-sm uppercase tracking-wider">Stop the Bleeding</div>
                            </div>
                        </div>

                        {/* Card 2: The Greed (Recall & Action) */}
                        <div className="glass-card p-8 rounded-2xl relative overflow-hidden group border-rose/30 shadow-lg shadow-rose/10">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-rose/20 rounded-bl-full transition-all group-hover:bg-rose/30"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-rose/20 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">The Offline Advantage</h3>
                                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                    Achieve **97% recall** and **75% immediate search action**. Your brand becomes a permanent, high-visibility asset that generates **62% purchase influence** 24/7.
                                </p>
                                <div className="text-rose font-bold text-sm uppercase tracking-wider">Capture the Market</div>
                            </div>
                        </div>

                        {/* Card 3: The Growth (First-Mover) */}
                        <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-800 rounded-bl-full transition-all group-hover:bg-gray-700"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">First-Mover Dominance</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    This emerging market is growing at **18.9% CAGR**. Early adopters are locking down local visibility before the market saturates.
                                </p>
                                <div className="text-rose font-bold text-sm uppercase tracking-wider">Secure Your Territory</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Comparison Section */}
            <section id="data" className="py-20 bg-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        
                        {/* Left: Context */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The <span className="text-rose">Data</span> Doesn't Lie</h2>
                            <p className="text-gray-300 mb-8 text-lg">
                                We aren't asking you to guess. We're showing you the math. The difference between a scroll and a stop, between an impression and a sale.
                            </p>
                            
                            <ul className="space-y-6">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose/20 flex items-center justify-center mt-1">
                                        <span className="text-rose font-bold">1</span>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold text-white">Recall is 5x Higher</h4>
                                        <p className="text-gray-400 text-sm">97% of people remember this form of advertising vs 19% for digital ads.</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose/20 flex items-center justify-center mt-1">
                                        <span className="text-rose font-bold">2</span>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold text-white">Search Action is 6x Higher</h4>
                                        <p className="text-gray-400 text-sm">75% of viewers look up the brand immediately after seeing these messages.</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose/20 flex items-center justify-center mt-1">
                                        <span className="text-rose font-bold">3</span>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold text-white">Sentiment is 92% Positive</h4>
                                        <p className="text-gray-400 text-sm">Unlike intrusive pop-ups, real world visibility builds trust and credibility.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Right: Visual Chart/Comparison */}
                        <div className="glass-panel p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-white mb-6 text-center">Channel Performance Comparison</h3>
                            
                            {/* Metric 1: Recall */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-gray-400 mb-2">
                                    <span>Digital Recall</span>
                                    <span>19%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-4">
                                    <div className="bg-gray-500 h-4 rounded-full" style={{width: '19%'}}></div>
                                </div>
                                
                                <div className="flex justify-between text-sm text-white font-bold mt-4 mb-2">
                                    <span>Physical Recall</span>
                                    <span className="text-rose">97%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-4 relative">
                                    <div className="bg-rose h-4 rounded-full shadow-[0_0_10px_#e11d48]" style={{width: '97%'}}></div>
                                </div>
                            </div>

                            {/* Metric 2: Action */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-gray-400 mb-2">
                                    <span>Digital Search Lift</span>
                                    <span>&lt;15%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-4">
                                    <div className="bg-gray-500 h-4 rounded-full" style={{width: '15%'}}></div>
                                </div>
                                
                                <div className="flex justify-between text-sm text-white font-bold mt-4 mb-2">
                                    <span> Offline Search Action</span>
                                    <span className="text-rose">75%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-4 relative">
                                    <div className="bg-rose h-4 rounded-full shadow-[0_0_10px_#e11d48]" style={{width: '75%'}}></div>
                                </div>
                            </div>

                            {/* Metric 3: Sentiment */}
                            <div>
                                <div className="flex justify-between text-sm text-gray-400 mb-2">
                                    <span>Digital Sentiment</span>
                                    <span>Negative/Neutral</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-4">
                                    <div className="bg-gray-500 h-4 rounded-full" style={{width: '40%'}}></div>
                                </div>
                                
                                <div className="flex justify-between text-sm text-white font-bold mt-4 mb-2">
                                    <span>Offline Sentiment</span>
                                    <span className="text-rose">92% Positive</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-4 relative">
                                    <div className="bg-rose h-4 rounded-full shadow-[0_0_10px_#e11d48]" style={{width: '92%'}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Success Stories / Social Proof */}
            <section id="success" className="py-20 bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Real Results, <span className="text-rose">Real Revenue</span></h2>
                        <p className="text-gray-400">Businesses that switched from digital-only to local visibility.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Case Study 1 */}
                        <div className="glass-card p-6 rounded-2xl">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                                    <span className="text-xl">🚛</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Local HVAC Co.</h4>
                                    <p className="text-xs text-gray-500">Service Business</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Lead Generation</span>
                                    <span className="text-rose font-bold text-lg">+400 Leads</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Investment</span>
                                    <span className="text-white font-bold">$4,000</span>
                                </div>
                                <div className="pt-3 border-t border-gray-700">
                                    <p className="text-xs text-gray-400 italic">"We got 400 qualified leads from a $4k real world investment. Digital ads were costing us $50 per lead."</p>
                                </div>
                            </div>
                        </div>

                        {/* Case Study 2 */}
                        <div className="glass-card p-6 rounded-2xl">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                                    <span className="text-xl">🍕</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Pizza Chain</h4>
                                    <p className="text-xs text-gray-500">Food & Bev</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Sales Lift</span>
                                    <span className="text-rose font-bold text-lg">+250%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Recall Rate</span>
                                    <span className="text-white font-bold">99%</span>
                                </div>
                                <div className="pt-3 border-t border-gray-700">
                                    <p className="text-xs text-gray-400 italic">"Our existing assets became our best ad channel. Sales tripled in 3 months."</p>
                                </div>
                            </div>
                        </div>

                        {/* Case Study 3 */}
                        <div className="glass-card p-6 rounded-2xl">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                                    <span className="text-xl">⚖️</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Law Firm</h4>
                                    <p className="text-xs text-gray-500">Professional Services</p>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-gray-700 mt-4">
                                <p className="text-xs text-gray-400 italic">"Consultations increased by 60% after our strategy change. The trust factor is unmatched."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Financial Data & Industry Growth */}
            <section className="py-20 bg-slate-800 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-900/20 via-transparent to-transparent"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The <span className="text-rose">Market Math</span> is Clear</h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            While social media growth slows, this industry industry is exploding. Don't bet your budget on a shrinking channel.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Stat 1 */}
                        <div className="glass-panel p-6 rounded-xl text-center hover:bg-white/5 transition">
                            <div className="text-4xl font-extrabold text-rose mb-2">18.9%</div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider font-bold">This Industry CAGR</div>
                            <div className="text-xs text-gray-500 mt-2">vs 9.75% Social Media</div>
                        </div>
                        {/* Stat 2 */}
                        <div className="glass-panel p-6 rounded-xl text-center hover:bg-white/5 transition">
                            <div className="text-4xl font-extrabold text-white mb-2">Achieve $0.35</div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider font-bold">Cost Per 1k Impressions</div>
                            <div className="text-xs text-gray-500 mt-2">vs $12.57 Digital Avg</div>
                        </div>
                        {/* Stat 3 */}
                        <div className="glass-panel p-6 rounded-xl text-center hover:bg-white/5 transition">
                            <div className="text-4xl font-extrabold text-rose mb-2">800%</div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider font-bold">Average ROI (3 Years)</div>
                            <div className="text-xs text-gray-500 mt-2">One-time investment</div>
                        </div>
                        {/* Stat 4 */}
                        <div className="glass-panel p-6 rounded-xl text-center hover:bg-white/5 transition">
                            <div className="text-4xl font-extrabold text-white mb-2">Achieve 70k+</div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider font-bold">Daily Impressions</div>
                            <div className="text-xs text-gray-500 mt-2">Per Placement</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lead Capture Form */}
            <section id="contact" className="py-20 bg-slate-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass-panel p-8 md:p-12 rounded-3xl shadow-2xl border border-rose/20 relative overflow-hidden">
                        {/* Decorative Glow */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose/10 rounded-full blur-[80px]"></div>
                        
                        <div className="relative z-10 text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stop Wasting Budget. <span className="text-rose">Start Owning the Territory.</span></h2>
                            <p className="text-gray-300 max-w-xl mx-auto">
                                Get a custom ROI analysis for your business. See exactly how much you could save and earn by switching strategy to improve visibility.
                            </p>
                        </div>

                        <form className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                    <input type="text" id="name" name="name" className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose focus:border-transparent transition" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Business Email</label>
                                    <input type="email" id="email" name="email" className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose focus:border-transparent transition" placeholder="john@company.com" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                                    <input type="text" id="company" name="company" className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose focus:border-transparent transition" placeholder="Your Business" />
                                </div>
                                <div>
                                    <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">Current Monthly Ad Spend</label>
                                    <select id="budget" name="budget" defaultValue="" className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-rose focus:border-transparent transition">
                                        <option value="" disabled>Select amount</option>
                                        <option value="1k-5k">$1,000 - $5,000</option>
                                        <option value="5k-10k">$5,000 - $10,000</option>
                                        <option value="10k+">$10,000+</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">How are you currently spending your budget?</label>
                                <textarea id="message" name="message" rows="4" className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose focus:border-transparent transition" placeholder="e.g. Google Ads, Facebook, Instagram..."></textarea>
                            </div>

                            <div className="bg-rose/10 border border-rose/20 rounded-lg p-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-rose mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <p className="text-sm text-gray-300 ml-3">
                                        By submitting, you agree to receive a custom ROI analysis showing how a strategy can reduce your CPM by up to <span className="text-white font-bold">97%</span> and increase recall by <span className="text-white font-bold">5x</span>.
                                    </p>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-rose hover:bg-roseHover text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-rose/30 transition-all duration-300 transform hover:scale-[1.02] text-lg tracking-wide">
                                Get My Free ROI Analysis
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 border-t border-gray-800 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <span className="text-2xl font-bold tracking-tighter text-white">
                                RULE<span className="text-rose"> 7 </span> MEDIA
                            </span>

                            <p className="text-gray-400 mt-4 max-w-md">
                                Empowering franchises and businesses with the first-mover advantage in strategic advertising. We turn your existing assets into your highest ROI channel.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#benefits" onClick={(e) => handleScroll(e, '#benefits')} className="hover:text-rose transition">Why Now?</a></li>
                                <li><a href="#data" onClick={(e) => handleScroll(e, '#data')} className="hover:text-rose transition">The Data</a></li>
                                <li><a href="#success" onClick={(e) => handleScroll(e, '#success')} className="hover:text-rose transition">Success Stories</a></li>
                                <li><a href="#contact" onClick={(e) => handleScroll(e, '#contact')} className="hover:text-rose transition">Get Started</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Contact</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>brandpartners@rule7media.com</li>
                                <li><a href="https://www.rule7media.com" className="text-gray-500 hover:text-rose transition">www.rule7media.com</a></li>
                                <li>New York, NY</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm">&copy; 2026 Rule 7 Media. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="https://www.rule7media.com/privacy-policy" className="text-gray-500 hover:text-rose transition">Privacy Policy</a>
                            <a href="https://www.rule7media.com/terms-conditions" className="text-gray-500 hover:text-rose transition">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
