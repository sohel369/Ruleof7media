import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';

// Owner-facing pages
import { Landing } from './pages/Landing';
import { Pricing } from './pages/Pricing';
import { Partner } from './pages/Partner';
import { Admin } from './pages/Admin';
import { Register } from './pages/Register';

// Affiliate page
import { Affiliate } from './pages/Affiliate';

// Customer-facing funnel
import { Funnel } from './pages/Funnel';
import { RoiAnalysis } from './pages/RoiAnalysis';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlRef = params.get('ref') || params.get('partner') || params.get('referrer');

    if (urlRef) {
      localStorage.setItem('r7_referrer_id', urlRef);
      localStorage.setItem('affiliate_ref', urlRef);
    } else {
      const savedRef = localStorage.getItem('r7_referrer_id');
      if (savedRef) {
        params.set('ref', savedRef);
        navigate({
          pathname: location.pathname,
          search: params.toString()
        }, { replace: true });
      }
    }
  }, [location.pathname, location.search, navigate]);

  return (
    <Routes>

      {/* ── OWNER / MARKETING ROUTES ── */}
      {/* Main landing page for Wrapping Shop Owners */}
      <Route path="/" element={<Landing />} />

      {/* Subscription / Pricing page */}
      <Route path="/pricing" element={<Pricing />} />

      {/* ReferrQ Affiliate Registration */}
      <Route path="/register" element={<Register />} />

      {/* Affiliate Portal */}
      <Route path="/affiliate" element={<Affiliate />} />
      <Route path="/affiliate/login" element={<Affiliate />} />
      <Route path="/affiliate/apply" element={<Affiliate />} />
      <Route path="/affiliate/dashboard" element={<Affiliate />} />
      <Route path="/affiliate/links" element={<Affiliate />} />
      <Route path="/affiliate/earnings" element={<Affiliate />} />
      <Route path="/affiliate/assets" element={<Affiliate />} />

      {/* Partner portal: registration, dashboard entry */}
      <Route path="/partner" element={<Partner />} />
      <Route path="/partner/login" element={<Partner />} />
      <Route path="/partner/register" element={<Partner />} />
      <Route path="/partner/apply" element={<Partner />} />
      <Route path="/partner/dashboard" element={<Partner />} />

      {/* CRM Admin Dashboard — Wrapping Shop Owner only */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/login" element={<Admin />} />
      <Route path="/admin/dashboard" element={<Admin />} />
      <Route path="/admin/leads" element={<Admin />} />
      <Route path="/admin/leads/:id" element={<Admin />} />
      <Route path="/admin/routing" element={<Admin />} />
      <Route path="/admin/reports" element={<Admin />} />
      <Route path="/admin/settings" element={<Admin />} />

      {/* ── CUSTOMER FUNNEL ROUTES ── */}
      <Route path="/roi-analysis" element={<RoiAnalysis />} />
      
      {/* Entry point: /funnel or /funnel?ref=partner-code */}
      <Route path="/funnel" element={<Funnel />} />

      {/* Video steps */}
      <Route path="/funnel/:stepId" element={<Funnel />} />

      {/* Completion thank-you page */}
      <Route path="/funnel/complete" element={<Funnel />} />

      {/* Legacy redirect — old /?ref= links still work by going to /funnel */}
      <Route path="/landing.html" element={<Navigate to="/funnel" replace />} />
      <Route path="/training/video-1.html" element={<Navigate to="/funnel/video-1" replace />} />
      <Route path="/video-1" element={<Navigate to="/funnel/video-1" replace />} />
      <Route path="/video-2" element={<Navigate to="/funnel/video-2" replace />} />
      <Route path="/video-3" element={<Navigate to="/funnel/video-3" replace />} />
      <Route path="/video-4" element={<Navigate to="/funnel/video-4" replace />} />
      <Route path="/video-5" element={<Navigate to="/funnel/video-5" replace />} />
      <Route path="/video-6" element={<Navigate to="/funnel/video-6" replace />} />
      <Route path="/video-7" element={<Navigate to="/funnel/video-7" replace />} />
      <Route path="/complete" element={<Navigate to="/funnel/complete" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

function App() {
  return (
    <SocketProvider>
      <Router>
        <AppContent />
      </Router>
    </SocketProvider>
  );
}

export default App;
