import React from 'react';
import { ShieldCheck, Lock, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

export const GlobalFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0F19] pt-12 pb-12 px-6 border-t border-slate-800 z-20 w-full font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div className="max-w-2xl text-left">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-neonRed rounded-xl flex items-center justify-center text-white shadow-lg shadow-neonRed/20">
                <span className="font-grotesk font-black text-lg">R</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">Rule7<span className="text-neonRed">Media</span></span>
            </div>
            <div className="space-y-6">
              <p className="text-xl font-bold text-white leading-tight">A global ecosystem for high end digital storytelling and operational excellence.</p>
              <p className="text-slate-400 leading-relaxed text-sm">Revolutionising the Advertising Landscape through strategic real-world visibility and transparent auction based pricing.</p>
              <p className="text-slate-300 font-medium border-l-4 border-neonRed pl-4 text-xs">Redefining Contextual Advertising Solutions. Driven by First Party Data. Powered by Human Curated Ad Channels</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
            <div>
              <h5 className="font-black text-slate-100 mb-6 uppercase tracking-widest text-[10px]">Navigation</h5>
              <ul className="space-y-3">
                <li><a href="https://rule7media.com/CaseStudies" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Case Studies</a></li>
                <li><a href="https://rule7media.com/whitepaper.pdf" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">White Paper</a></li>
                <li><a href="https://rule7media.com/Globaloffices" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Global Offices</a></li>
                <li><a href="https://rule7media.com/meetheteam" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Meet the Team</a></li>
                <li><a href="https://rule7media.com/howitworks" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">How it Works</a></li>
                <li><a href="https://rule7media.com/liveauction" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Live Auctions</a></li>
                <li><a href="https://rule7media.com/pricing" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Pricing Methodology</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-slate-100 mb-6 uppercase tracking-widest text-[10px]">Resources</h5>
              <ul className="space-y-3">
                <li><a href="https://rule7media.com/franchise" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Franchise Opportunities</a></li>
                <li><a href="https://rule7media.com/ancillary" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Advertise with Us</a></li>
                <li><a href="https://rule7media.com/affiliate" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Affiliate Program</a></li>
                <li><a href="https://rule7media.com/blog" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Industry News</a></li>
                <li><a href="https://rule7media.com/clientportal" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Client Portal</a></li>
                <li><a href="https://rule7media.com/liveauction" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Campaign Monitoring</a></li>
                <li><a href="https://rule7media.com/cpmrates" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Audience Targeting</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-slate-100 mb-6 uppercase tracking-widest text-[10px]">Protocol</h5>
              <ul className="space-y-3">
                <li><a href="https://rule7media.com/terms" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Terms of Use</a></li>
                <li><a href="https://rule7media.com/privacy" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Privacy Policy</a></li>
                <li><a href="https://rule7media.com/cookies" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Cookie Strategy</a></li>
                <li><a href="https://rule7media.com/careers" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Career Hub</a></li>
                <li><a href="https://rule7media.com/contact" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Contact Us</a></li>
                <li><a href="https://rule7media.com/support" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline">Help Centre</a></li>
                <li className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-4 pt-4 border-t border-slate-800"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> ISO 27001 Secure</li>
                <li className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter"><Lock className="w-3.5 h-3.5 text-emerald-500" /> AES 256 Encryption</li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-slate-100 mb-6 uppercase tracking-widest text-[10px]">Social Connect</h5>
              <ul className="space-y-3">
                <li><a href="https://www.facebook.com/profile.php?id=61578118663553" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline"><Facebook className="w-3.5 h-3.5" /> Facebook</a></li>
                <li><a href="https://www.instagram.com/rule.7media?igsh=aXNrbDVwZTlyYWhr" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline"><Instagram className="w-3.5 h-3.5" /> Instagram</a></li>
                <li><a href="https://www.youtube.com/@Rule7Media" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline"><Youtube className="w-3.5 h-3.5" /> YouTube</a></li>
                <li><a href="https://x.com/Rule7Media" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-neonRed text-xs transition-colors font-medium no-underline"><Twitter className="w-3.5 h-3.5" /> X</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-left">©Colt Telecom Pty Ltd. (EST. 2004) All Rights Reserved.</p>
          <div className="flex gap-8">
            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">Cinematic Quality</span>
            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">Digital Precision</span>
            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">Global Impact</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
