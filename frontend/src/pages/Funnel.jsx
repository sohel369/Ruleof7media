import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Play, Check, AlertCircle, ChevronRight, Flame, Zap, Shield, HelpCircle, MapPin, Phone, ChevronDown } from 'lucide-react';
import { GlobalFooter } from '../components/GlobalFooter';

// Quiz definitions for each step
const QUIZZES = {
  1: {
    title: "Quiz 1: Why Digital Ads Keep Burning Budget",
    questions: [
      {
        question: "What is the typical CPM range for most social media advertising platforms in 2026?",
        options: ["$0.50 – $2.00", "$5 – $12+", "$0.10 – $0.50"],
        correct: 1,
        feedback: "Correct! Social media CPMs typically range from $5 to $12+."
      },
      {
        question: "In rising interest rate environments, what is one of the biggest risks for small businesses relying heavily on paid digital ads?",
        options: ["Lower interest rates on loans", "Rapidly increasing monthly ad costs with unpredictable ROI", "Free traffic surges"],
        correct: 1,
        feedback: "Correct! Rising competition and ad platform inflation lead to unpredictable monthly ROI."
      },
      {
        question: "What makes it harder for authentic business messages to cut through online today?",
        options: ["Too few advertisers", "Flood of AI-generated content creating digital noise", "Perfect algorithm targeting"],
        correct: 1,
        feedback: "Correct! Flood of AI-generated content creates immense digital noise, diluting authentic messages."
      }
    ]
  },
  2: {
    title: "Quiz 2: Local Exposure & Economic Hardiness",
    questions: [
      {
        question: "For local service businesses, what type of exposure often delivers the highest relevance to nearby customers?",
        options: [
          "International online campaigns",
          "Consistent, professional branding seen in everyday local traffic and commutes",
          "Seasonal social media boosts"
        ],
        correct: 1,
        feedback: "Correct! Local daily visibility builds top-of-mind community awareness."
      },
      {
        question: "During economic pressures like potential recessions, what marketing approach helps protect cash flow best?",
        options: [
          "Increasing monthly recurring ad spend",
          "One-time investments that generate impressions over multiple years",
          "Cutting all visibility efforts"
        ],
        correct: 1,
        feedback: "Correct! One-time physical investments (like wraps) produce long-term exposure without recurring monthly bills."
      },
      {
        question: "What is a major hidden cost of relying solely on digital channels?",
        options: [
          "Too much free organic reach",
          "Ad fatigue and being easily ignored or scrolled past",
          "Guaranteed high conversion rates"
        ],
        correct: 1,
        feedback: "Correct! Digital fatigue means prospects scroll past standard social ads easily."
      }
    ]
  },
  3: {
    title: "Quiz 3: AI Noise & Real-World Trust",
    questions: [
      {
        question: "Recent studies show many consumers feel what when encountering undisclosed AI-generated ads?",
        options: [
          "Increased trust and connection",
          "Manipulated or less authentic",
          "No difference from human-created ads"
        ],
        correct: 1,
        feedback: "Correct! Undisclosed AI ads often make consumers feel manipulated or find the brand less authentic."
      },
      {
        question: "What kind of branding tends to build faster customer confidence in competitive fields like professional services?",
        options: [
          "Anonymous online banners",
          "High-quality, professional appearances encountered in real-world settings",
          "Frequent pop-up digital retargeting"
        ],
        correct: 1,
        feedback: "Correct! Real-world physical presence and professional wrapping build long-term local trust."
      },
      {
        question: "How does AI saturation primarily hurt small-to-medium businesses?",
        options: [
          "Makes all ads more effective",
          "Increases competition and reduces standout ability on screens",
          "Lowers overall ad costs"
        ],
        correct: 1,
        feedback: "Correct! AI noise floods digital channels, making it harder for small businesses to stand out."
      }
    ]
  },
  4: {
    title: "Quiz 4: Recession Proofing & Cost Efficiency",
    questions: [
      {
        question: "Compared to traditional digital ads, what advantage do certain physical/mobile marketing methods offer in tough economies?",
        options: [
          "Higher ongoing monthly fees",
          "Much lower cost per thousand impressions (often under $1) with long-term results",
          "Less control over local targeting"
        ],
        correct: 1,
        feedback: "Correct! Mobile wraps offer extremely low CPM compared to online PPC channels."
      },
      {
        question: "With rising costs, what marketing trait becomes most valuable?",
        options: [
          "Short-term campaigns requiring constant renewal",
          "Assets that work 24/7 in your service area without repeated payments",
          "Highly complex targeting options"
        ],
        correct: 1,
        feedback: "Correct! Local assets that promote your brand 24/7 without recurring fees protect B2B margins."
      },
      {
        question: "What often happens when businesses cut marketing during downturns?",
        options: [
          "They gain massive market share",
          "Competitors who stay visible capture more customers",
          "Customers automatically return later"
        ],
        correct: 1,
        feedback: "Correct! Maintaining local visibility allows you to capture market share from retreating competitors."
      }
    ]
  },
  5: {
    title: "Quiz 5: Local Dominance & Mobility Assets",
    questions: [
      {
        question: "For businesses serving local clients (e.g., trades, retail, services), where do many buying decisions start?",
        options: [
          "Distant online searches only",
          "Everyday real-world encounters in the community",
          "Global social media feeds"
        ],
        correct: 1,
        feedback: "Correct! Daily visibility in the neighborhood builds immediate trust and starts client decisions."
      },
      {
        question: "What mobility-related advantage helps maximize impressions efficiently?",
        options: [
          "Stationary online ads",
          "Branding that moves through high-traffic areas daily",
          "Expensive geo-fenced digital ads"
        ],
        correct: 1,
        feedback: "Correct! Mobile fleet branding daily exposes your logo to high-traffic areas."
      },
      {
        question: "A key benefit of turning operational assets into marketing tools is:",
        options: [
          "Adding significant monthly expenses",
          "Generating thousands of impressions per day at very low effective cost",
          "Reducing professionalism"
        ],
        correct: 1,
        feedback: "Correct! Moving commercial vehicles get up to 70,000 views a day with no recurring ad fee."
      }
    ]
  },
  6: {
    title: "Quiz 6: Local Repetition & CAC Reduction",
    questions: [
      {
        question: "In industries like health, legal, and real estate, what often signals reliability to prospects?",
        options: [
          "Heavy reliance on flashy digital-only presence",
          "Consistent, premium professional branding in visible real settings",
          "Anonymous or budget-looking appearances"
        ],
        correct: 1,
        feedback: "Correct! Premium physical visibility signals high-end reliability and local dominance."
      },
      {
        question: "How does real-world repetition typically affect brand recall?",
        options: [
          "It decreases trust",
          "It significantly increases recognition and preference",
          "Has no impact compared to online"
        ],
        correct: 1,
        feedback: "Correct! Repetitive physical encounters dramatically boost brand memory and preference."
      },
      {
        question: "What is one powerful way to reduce customer acquisition costs long-term?",
        options: [
          "Only using pay-per-click models",
          "Creating always-on local visibility that drives referrals and direct inquiries",
          "Focusing exclusively on distant leads"
        ],
        correct: 1,
        feedback: "Correct! Permanent local visibility creates an inbound conversion funnel that reduces CAC."
      }
    ]
  },
  7: {
    title: "Quiz 7: Unlocking Local Monopoly",
    questions: [
      {
        question: "What is the main driver to build local wrap brand supremacy?",
        options: ["Relying solely on SEO", "Consistency, frequency, familiarity, and trust-building where your customers, live work and play.", "Lowering prices", "Newspaper print ads"],
        correct: 1,
        feedback: "Correct! Consistent physical wrapped impressions in a target area establish local visual dominance."
      }
    ]
  }
};

const VIDEOS_CONTENT = {
  1: {
    url: "https://cinema8.com/video/5J7zYBVX",
      title: "Video 1: Why Digital Ads May Increase Customer Acquisition Costs",
    duration: 12,
    description: "If your digital advertising budget keeps growing but results feel harder to predict, you're not alone. Many small businesses are watching money disappear into platforms that demand constant spend with no guarantee of return. In this video we break down exactly why internet advertising is burning budget right now — and what smarter options exist for businesses that need reliable visibility without the endless monthly drain.",
    points: ["Rising digital auction prices", "Ad blindness and banner fatigue", "The Rule of 7 in brand recall"]
  },
  2: {
    url: "https://cinema8.com/video/WD9Wb8VJ",
      title: "Video 2: The Hidden Costs of Staying Invisible in a Crowded Market",
    duration: 15,
    description: "You can spend thousands online and still be invisible to the customers driving past your door every day. This video reveals the hidden cost of staying invisible in your own local market — and why even large media companies invest in real-world presence to stay top-of-mind.",
    points: ["Bid bidding algorithms", "Why click quality is decreasing", "Controlling your acquisition channel"]
  },
  3: {
    url: "https://cinema8.com/video/AJE7vQgD",
      title: "Video 3: AI Noise vs. Real-World Trust – Why Digital Feels Broken",
    duration: 18,
    description: "Customers are scrolling past more ads than ever — and trusting them less. When every feed is filled with AI-generated content, authentic businesses struggle to stand out. This video examines why digital advertising feels broken and how real-world presence builds the trust that screens can no longer deliver.",
    points: ["Cost per thousand impressions comparison", "The visual density factor", "Fleet branding ROI"]
  },
  4: {
    url: "https://cinema8.com/video/YDpY5j0X",
      title: "Video 4: Recession-Proof Your Marketing: Stop Bleeding Cash on Unreliable Ads",
    duration: 20,
    description: "With costs rising and uncertainty in the economy, every marketing dollar must work harder. This video shows why continuing to pour money into unreliable digital ads is a risk — and how durable, low ongoing-cost approaches can protect your budget while still delivering consistent local visibility.",
    points: ["Mapping local service areas", "Routing logic and response times", "Dominating regional search offline"]
  },
  5: {
    title: "Video 5: Local Domination: Reaching Customers Where They Actually Are",
    duration: 33,
    durationText: "5 minutes 30 seconds",
    description: "Most of your best customers live and work within a short drive of your business. Yet digital campaigns often chase audiences far outside that zone. This video explores how to dominate your actual service area with high-frequency, relevant exposure — including groundbreaking practical options even if you don't own a fleet of vehicles.",
    points: ["Scale dynamics of fleet wraps", "Standardizing brand identity", "Resale value protection"]
  },
  6: {
    title: "Video 6: The Trust Factor – Why Physical Presence Builds Loyalty Faster",
    duration: 16,
    description: "Trust is the real currency in local business. This video reveals why professional physical presence builds credibility and loyalty faster than digital messages alone — and how the right real-world strategy creates daily recognition that turns into referrals and repeat business.",
    points: ["Designing scanning call-to-actions", "Cookie-less attribution", "Simulating instant CRM syncing"]
  },
  7: {
    title: "Video 7: Future-Proof Marketing: Low CPM Strategies That Deliver Real ROI",
    duration: 34.5,
    durationText: "5 minutes 45 seconds",
    description: "After exploring the problems with digital advertising, this final video delivers the complete solution. You'll see how to achieve dramatically lower cost-per-thousand impressions, consistent local reach, and a marketing approach that continues working Year after year — without the ongoing budget bleed of social media.",
    points: ["Selecting wrap designs that convert", "Activating your tracking dashboard", "Finalizing your Rule7 qualification score"]
  }
};


const PriorityBanner = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const endStr = localStorage.getItem('r7_priorityEnd');
      if (!endStr) return;
      const end = new Date(endStr);
      const now = new Date();
      const remainingMs = end - now;

      if (remainingMs <= 0) {
        setTimeLeft("Priority window closed");
        setIsUrgent(true);
        return;
      }

      const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days} day${days !== 1 ? 's' : ''} ${hours} hr${hours !== 1 ? 's' : ''}`);
      } else {
        setTimeLeft(`${hours} hr${hours !== 1 ? 's' : ''} ${minutes} min`);
      }

      setIsUrgent(days < 3);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className={`w-full py-2 px-4 text-center font-bold text-sm z-40 flex justify-center items-center gap-3 transition-colors duration-500 shadow-md ${isUrgent ? 'bg-gradient-to-r from-[#c53030] to-[#e53e3e] text-white' : 'bg-gradient-to-r from-[#1a365d] to-[#2b6cb0] text-white'}`}>
      <span className="opacity-90">Priority Access Remaining:</span>
      <span className={`bg-white/20 px-3 py-1 rounded-full tracking-wide ${isUrgent ? 'animate-pulse' : ''}`}>
        {timeLeft}
      </span>
    </div>
  );
};

export const Funnel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { stepId } = useParams();
  
  const currentStep = stepId ? parseInt(stepId.replace('video-', '')) : 0;
  const isCompletePage = location.pathname === '/funnel/complete';
  const isLandingPage = location.pathname === '/funnel' || location.pathname === '/funnel/';

  // State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    state: '',
    country: '',
    role: '',
    industry: '',
    otherIndustry: '',
    serviceArea: '',
    locations: '',
    employees: '',
    budget: '',
    fleetSize: '',
    vehicleTypes: [],
    serviceTerritories: '',
    hasBranding: '',
    allocDigital: '',
    allocTraditional: '',
    allocOther: '',
    localVsOnlinePct: '',
    goals: [],
    customGoals: '',
    phone: '',
    reviewTimeline: '',
    consultTime: '',
    auditRequest: ''
  });

  const [activeFaq, setActiveFaq] = useState(null);
  const [refId, setRefId] = useState('');
  const [leadId, setLeadId] = useState('');
  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
  const industryDropdownRef = useRef(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUnlocked, setVideoUnlocked] = useState(false);
  const [quizUnlocked, setQuizUnlocked] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({}); // { stepNum: { qIdx: selectedOptionIdx } }
  const [quizChecked, setQuizChecked] = useState(false);  // Has user clicked "Check Answers"?
  const [quizPassed, setQuizPassed] = useState(false);    // Did user pass ALL questions?
  const [scoreData, setScoreData] = useState({ score: 0, stage: 'Cold' });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Timer references for mock video player
  const videoInterval = useRef(null);

  // Load state from localStorage on mount
  useEffect(() => {
    // 1. Capture referral
    const params = new URLSearchParams(location.search);
    const urlRef = params.get('ref') || params.get('partner') || params.get('referrer');
    
    let activeRef = localStorage.getItem('r7_referrer_id') || '';
    if (urlRef) {
      activeRef = urlRef;
      localStorage.setItem('r7_referrer_id', urlRef);
      // Log click on backend
      fetch('/api/affiliates/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: urlRef })
      })
      .then(res => res.json())
      .then(data => console.log('Referral click registered:', data))
      .catch(err => console.error('Error logging click:', err));
    }
    setRefId(activeRef);

    // 2. Load leadId
    let activeLeadId = localStorage.getItem('r7_current_lead_id') || '';
    if (!activeLeadId && !isLandingPage) {
      activeLeadId = 'lead_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
      localStorage.setItem('r7_current_lead_id', activeLeadId);
    }
    setLeadId(activeLeadId);

    // 3. Load saved lead data if exists
    if (activeLeadId) {
      fetch(`/api/leads/${activeLeadId}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            const standardIndustries = [
              "Accounting & Tax Services", "Automotive Services", "Baby Clothes, Accessories & Toys", 
              "Beauty and Cosmetic Surgery", "Childcare & Aged Care Providers", "Department Stores and Electronics", 
              "Education & Tutoring", "Event & Wedding Services", "Financial and Insurance Services", 
              "Fitness & Personal Training", "Funeral and Bereavement Counselling", "Home & Garden", 
              "Health, Wellness & Medical", "IT & Tech Support Services", "Legal Services, Lawyers and Mediation", 
              "Lifestyle, Boutique, Apparel & Accessories", "Mobile Phone and Internet Services", 
              "Travel & Tourism", "Pets & Animals", "Professional Training & Certification", 
              "Radio and TV Stations", "Real Estate & Property Agents", "Restaurants, Food & Beverage", 
              "Storage, Logistics and Removalists", "Trades & Home Services"
            ];
            const isStandard = data.industry ? standardIndustries.includes(data.industry) : true;
            setFormData({
              name: data.name || '',
              email: data.email || '',
              company: data.company || '',
              state: data.state || '',
              country: data.country ? (['United States', 'United Kingdom', 'Australia', 'Canada', 'Eurozone (EU)'].includes(data.country) ? data.country : 'Other') : '',
              otherCountry: data.country && !['United States', 'United Kingdom', 'Australia', 'Canada', 'Eurozone (EU)'].includes(data.country) ? data.country : '',
              role: data.role || '',
              industry: data.industry ? (isStandard ? data.industry : 'Other') : '',
              otherIndustry: data.industry && !isStandard ? data.industry : '',
              serviceArea: data.serviceArea || '',
              locations: data.locations || '',
              employees: data.employees || '',
              budget: data.budget || '',
              fleetSize: data.fleetSize || '',
              vehicleTypes: data.vehicleTypes || [],
              serviceTerritories: data.serviceTerritories || '',
              hasBranding: data.hasBranding || '',
              allocDigital: data.allocDigital || '',
              allocTraditional: data.allocTraditional || '',
              allocOther: data.allocOther || '',
              localVsOnlinePct: data.localVsOnlinePct || '',
              goals: data.goals || [],
              customGoals: ''
            });
            if (data.quizAnswers) {
              setQuizAnswers(data.quizAnswers);
            }
            setScoreData({ score: data.score || 0, stage: data.stage || 'Cold' });
          }
        })
        .catch(err => console.error('Error loading lead state:', err));
    }

    // Gating check
    if (currentStep > 1) {
      const highestStepCompleted = parseInt(localStorage.getItem('r7_highest_step_completed') || '0');
      if (highestStepCompleted < currentStep - 1) {
        // User is skipping, redirect to their next available step
        navigate(`/funnel/video-${highestStepCompleted + 1}`);
      }
    }

    // Reset quiz state on every new step
    setQuizChecked(false);
    setQuizPassed(false);
    setErrorMsg('');
  }, [currentStep, location.pathname]);

  // Click outside listener for custom industry dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (industryDropdownRef.current && !industryDropdownRef.current.contains(event.target)) {
        setIsIndustryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  
  // Dynamic SEO and Title Update
  useEffect(() => {
    let pageTitle = "Marketing Mastery Journey | Rule7Media";
    let pageDescription = "Unlock the proven ROI frameworks of mobile transit branding.";
    
    if (isLandingPage) {
      pageTitle = "Premium Local Branding | Rule7Media";
    } else if (isCompletePage) {
      pageTitle = "Congratulations - Profile Finalized | Rule7Media";
    } else if (VIDEOS_CONTENT[currentStep]) {
      pageTitle = `${VIDEOS_CONTENT[currentStep].title} | Rule7Media`;
      pageDescription = VIDEOS_CONTENT[currentStep].description.substring(0, 150) + "...";
    }

    document.title = pageTitle;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = pageDescription;
  }, [currentStep, isLandingPage, isCompletePage]);
  // Video progress simulator
  useEffect(() => {
    if (isPlaying) {
      const videoLength = VIDEOS_CONTENT[currentStep]?.duration || 10;
      videoInterval.current = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            clearInterval(videoInterval.current);
            setIsPlaying(false);
            setQuizUnlocked(true);
            return 100;
          }
          return prev + (100 / videoLength);
        });
      }, 1000);
    } else {
      clearInterval(videoInterval.current);
    }

    return () => clearInterval(videoInterval.current);
  }, [isPlaying, currentStep]);

  // Handle Play/Pause
  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Skip video helper for testing
  const skipVideo = () => {
    setVideoProgress(100);
    setIsPlaying(false);
    setQuizUnlocked(true);
  };

  // Form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => {
      const isSelected = prev.goals.includes(goal);
      const goals = isSelected 
        ? prev.goals.filter(g => g !== goal) 
        : [...prev.goals, goal];
      return { ...prev, goals };
    });
  };

  const handleVehicleTypeToggle = (type) => {
    setFormData(prev => {
      const isSelected = prev.vehicleTypes.includes(type);
      const vehicleTypes = isSelected 
        ? prev.vehicleTypes.filter(t => t !== type) 
        : [...prev.vehicleTypes, type];
      return { ...prev, vehicleTypes };
    });
  };

  // Handle quiz option selection — only allowed on unanswered OR wrong questions
  const handleSelectOption = (questionIdx, optionIdx) => {
    if (quizChecked) {
      // After checking: only allow changing a WRONG answer
      const quiz = QUIZZES[currentStep];
      if (!quiz) return;
      const q = quiz.questions[questionIdx];
      const currentAnswer = quizAnswers[currentStep]?.[questionIdx];
      const wasCorrect = currentAnswer === q.correct;
      if (wasCorrect) return; // Correct answers are locked — can't change them
    }
    setQuizAnswers(prev => {
      const stepAnswers = prev[currentStep] || {};
      return {
        ...prev,
        [currentStep]: {
          ...stepAnswers,
          [questionIdx]: optionIdx
        }
      };
    });
    // If we were in checked mode, reset so user can re-check after fixing
    if (quizChecked) {
      setQuizChecked(false);
      setQuizPassed(false);
    }
  };

  // Check all quiz answers — show ✅/❌ per question
  const checkQuizAnswers = () => {
    const quiz = QUIZZES[currentStep];
    if (!quiz) return;
    const answers = quizAnswers[currentStep] || {};
    // Check all questions have been answered
    const allAnswered = quiz.questions.every((_, idx) => answers[idx] !== undefined);
    if (!allAnswered) {
      setErrorMsg('Please answer all questions before checking.');
      return;
    }
    setErrorMsg('');
    setQuizChecked(true);
    // Check if all correct
    const allCorrect = quiz.questions.every((q, idx) => answers[idx] === q.correct);
    setQuizPassed(allCorrect);
  };

  // Submit Step Data
  const submitStep = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSavedSuccess(false);

    // Validate fields for the current step
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.state || !formData.country) {
        setErrorMsg('Please fill in all details to proceed.');
        return;
      }
      // Initialize Priority Window for 14 days
      if (!localStorage.getItem('r7_priorityEnd')) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 14);
        localStorage.setItem('r7_priorityEnd', endDate.toISOString());
      }
    } else if (currentStep === 2) {
      if (!formData.company || !formData.industry || !formData.serviceArea) {
        setErrorMsg('Please fill in all details to proceed.');
        return;
      }
      if (formData.industry === 'Other' && !formData.otherIndustry) {
        setErrorMsg('Please specify your industry.');
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.role || !formData.locations) {
        setErrorMsg('Please fill in all details to proceed.');
        return;
      }
    } else if (currentStep === 4) {
      if (!formData.employees || !formData.fleetSize) {
        setErrorMsg('Please fill in all details to proceed.');
        return;
      }
    } else if (currentStep === 5) {
      if (formData.vehicleTypes.length === 0 || !formData.serviceTerritories || !formData.hasBranding) {
        setErrorMsg('Please fill in all details to proceed.');
        return;
      }
    } else if (currentStep === 6) {
      if (!formData.budget || !formData.localVsOnlinePct) {
        setErrorMsg('Please fill in all details to proceed.');
        return;
      }
    }

    // Submit progressive data to Express backend
    let activeLeadId = leadId;
    if (!activeLeadId) {
      activeLeadId = 'lead_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
      setLeadId(activeLeadId);
      localStorage.setItem('r7_current_lead_id', activeLeadId);
    }

    // Quiz score calculation for this step
    let correctCount = 0;
    let totalQuestions = 0;
    
    if (QUIZZES[currentStep]) {
      const stepQuiz = QUIZZES[currentStep];
      totalQuestions = stepQuiz.questions.length;
      stepQuiz.questions.forEach((q, idx) => {
        const selected = quizAnswers[currentStep]?.[idx];
        if (selected === q.correct) {
          correctCount++;
        }
      });
    }

    // Format quiz response payload
    const finalAnswersObj = { ...quizAnswers };
    if (totalQuestions > 0) {
      finalAnswersObj[currentStep] = {
        correct: correctCount,
        total: totalQuestions,
        selections: quizAnswers[currentStep] || {}
      };
    }

    const finalFormData = { ...formData };
    if (finalFormData.industry === 'Other' && finalFormData.otherIndustry) {
      finalFormData.industry = finalFormData.otherIndustry;
    }

    const payload = {
      leadId: activeLeadId,
      step: currentStep,
      data: {
        refId,
        ...finalFormData,
        quizAnswers: finalAnswersObj
      }
    };

    try {
      const res = await fetch('/api/leads/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resData = await res.json();
      
      if (resData.success) {
        setScoreData({ score: resData.score, stage: resData.stage });
        setSavedSuccess(true);
        localStorage.setItem('r7_highest_step_completed', String(currentStep));
        
        // Go to next step
        setTimeout(() => {
          setSavedSuccess(false);
          setVideoProgress(0);
          setQuizUnlocked(false);
          setQuizChecked(false);
          setQuizPassed(false);
          
          const refQuery = refId ? `?ref=${refId}` : '';
          if (currentStep === 7) {
            navigate(`/funnel/complete${refQuery}`);
          } else {
            navigate(`/funnel/video-${currentStep + 1}${refQuery}`);
          }
        }, 1500);
      } else {
        setErrorMsg(resData.error || 'Failed to submit data.');
      }
    } catch (err) {
      console.error('Error sending funnel progress:', err);
      setErrorMsg('Network error. Failed to connect to backend.');
    }
  };

  // Submit Landing Page (leads to Video 1)
  const submitLanding = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company) {
      setErrorMsg('All fields are required.');
      return;
    }
    
    // Save minimal data to start
    const activeLeadId = 'lead_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    setLeadId(activeLeadId);
    localStorage.setItem('r7_current_lead_id', activeLeadId);

    const payload = {
      leadId: activeLeadId,
      step: 1,
      data: {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        refId
      }
    };

    fetch('/api/leads/step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(data => {
      localStorage.setItem('r7_highest_step_completed', '1');
      navigate('/funnel/video-1');
    })
    .catch(err => {
      // Offline fallback
      localStorage.setItem('r7_highest_step_completed', '1');
      navigate('/funnel/video-1');
    });
  };

  const [isSessionClaimed, setIsSessionClaimed] = useState(false);

  const submitComplete = async (e) => {
    e.preventDefault();
    
    // Save final details
    const payload = {
      leadId: leadId || ('lead_' + Date.now()),
      step: 8,
      data: {
        ...formData,
        sessionClaimed: true
      }
    };

    try {
      await fetch('/api/leads/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setIsSessionClaimed(true);
    } catch (err) {
      console.error(err);
      setIsSessionClaimed(true); // Still show success for UX, even if offline
    }
  };

  // --- RENDERS ---

  if (isLandingPage) {
    // Premium Advertiser Landing Page (landing.html equivalent)
    return (
      <div className="min-h-screen relative overflow-x-hidden w-full max-w-[100vw] flex flex-col bg-darkBg text-slate-100 font-sans selection:bg-neonRed/30 selection:text-white">
        
        {/* Orbs background glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neonRed/5 rounded-full filter blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-neonCyan/5 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-10 w-[450px] h-[450px] bg-neonPurple/5 rounded-full filter blur-[110px] pointer-events-none"></div>

        {/* Sleek Premium Navigation Header */}
        <nav className="fixed top-0 inset-x-0 z-50 py-4 px-4 sm:px-6 md:px-12 flex justify-between items-center bg-[#040409]/95 backdrop-blur-md border-b border-slate-900/80 max-w-[100vw]">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-neonRed to-neonPink flex items-center justify-center font-black text-white shadow-lg shadow-neonRed/35 text-sm sm:text-lg">R</div>
            <span className="font-grotesk font-black text-lg sm:text-xl tracking-tight text-white">Rule7<span className="text-neonRed">Media</span></span>
          </div>

          {/* Central Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <a href="#benefits" className="hover:text-white transition-colors">Benefits</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#why-vehicle" className="hover:text-white transition-colors">Advantage</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {refId && (
              <div className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase bg-neonGreen/10 text-neonGreen px-3 py-1 rounded-full border border-neonGreen/20 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-neonGreen"></span>
                Partner
              </div>
            )}
            <button
              onClick={() => navigate(`/funnel/video-1${refId ? `?ref=${refId}` : ''}`)}
              className="px-3 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-neonCyan/20 to-neonPurple/20 border border-neonCyan/30 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-lg sm:rounded-xl hover:from-neonCyan/30 hover:to-neonPurple/30 transition-all duration-300 whitespace-nowrap"
            >
              Verify <span className="hidden sm:inline">Eligibility</span>
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="relative pt-44 pb-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Text copy & stats */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-neonCyan/10 text-neonCyan border border-neonCyan/25 shadow-inner w-fit">
              <span>✨</span> Grow Your Business With Vehicle Advertising
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black font-grotesk tracking-tight text-white leading-[1.08]">
              Reach Thousands of Local Customers <span className="bg-gradient-to-r from-neonCyan via-neonPurple to-neonPink bg-clip-text text-transparent">Every Single Day</span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl">
              Discover how your local business can generate massive brand supremacy and community trust through professionally wrapped vehicles. Watch our free 7-video series to unlock the proven ROI frameworks of mobile transit branding.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate(`/funnel/video-1${refId ? `?ref=${refId}` : ''}`)}
                className="px-8 py-4 bg-neonRed hover:bg-neonRed/90 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-neonRed/20 hover:scale-[1.02] transform duration-200"
              >
                <span>Watch Free Onboarding Series</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-900 max-w-lg">
              <div>
                <span className="text-2xl font-black text-white font-grotesk block mb-1">20,000+</span>
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Daily Views / Car</span>
              </div>
              <div>
                <span className="text-2xl font-black text-neonCyan font-grotesk block mb-1">50x - 100x</span>
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Lower CPM than CPC</span>
              </div>
              <div>
                <span className="text-2xl font-black text-neonPink font-grotesk block mb-1">97%</span>
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Brand Recall</span>
              </div>
            </div>
          </div>

          {/* Right: Premium wrapped vehicle mockup image */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-neonCyan/10 to-neonPurple/10 rounded-3xl filter blur-2xl opacity-60"></div>
            <div className="relative glass-card p-3 rounded-3xl border border-slate-900 shadow-2xl w-full max-w-sm hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="/assets/vehicle_wrap.png" 
                alt="Wrapped vehicle advertising mockup"
                className="w-full h-auto rounded-2xl object-cover shadow-lg"
              />
              <div className="p-4 text-center space-y-1.5">
                <span className="text-[10px] font-bold text-neonCyan uppercase tracking-widest block">Premium Out-Of-Home Ads</span>
                <p className="text-[10px] text-slate-400">Generate non-stop neighborhood visibility with wrapped local fleets.</p>
              </div>
            </div>
          </div>
        </header>

        {/* Brand Trust Logos Row */}
        <section className="py-10 bg-[#06060c] border-y border-slate-900/80 w-full overflow-hidden select-none">
          <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale hover:opacity-50 transition-opacity">
            <span className="font-grotesk font-black text-sm tracking-widest text-slate-400">METRO LOGISTICS</span>
            <span className="font-grotesk font-black text-sm tracking-widest text-slate-400">OUT-OF-HOME MEDIA</span>
            <span className="font-grotesk font-black text-sm tracking-widest text-slate-400">LOCAL BUSINESS UNION</span>
            <span className="font-grotesk font-black text-sm tracking-widest text-slate-400">FLEET BRAND NET</span>
          </div>
        </section>

        {/* Benefits of Vehicle Advertising */}
        <section id="benefits" className="py-24 px-6 max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-white font-grotesk tracking-tight">Why Out-of-Home Branding Outperforms</h2>
            <p className="text-xs text-slate-400">Avoid expensive online PPC auctions. Put your brand message directly where your local target market lives.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="glass-card p-6 border-l-2 border-l-neonCyan flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neonCyan/10 flex items-center justify-center text-lg flex-shrink-0">📈</div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">Reach Thousands of Local Customers</h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">Vehicles drive where your prospects live and work, capturing high-density community attention without relying on search boxes.</p>
              </div>
            </div>
            
            <div className="glass-card p-6 border-l-2 border-l-neonPurple flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neonPurple/10 flex items-center justify-center text-lg flex-shrink-0">💸</div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">Lower Customer Acquisition Cost</h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">Outdoor transit advertising costs pennies per thousand views (CPM) compared to skyrocketing digital CPC auction bids.</p>
              </div>
            </div>

            <div className="glass-card p-6 border-l-2 border-l-neonAmber flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neonAmber/10 flex items-center justify-center text-lg flex-shrink-0">🚗</div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">24/7 Mobile Exposure</h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">Your advertisement promotes your brand continuously. Your wraps work while driving, parked on job sites, or servicing clients.</p>
              </div>
            </div>

            <div className="glass-card p-6 border-l-2 border-l-neonRed flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neonRed/10 flex items-center justify-center text-lg flex-shrink-0">🎯</div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">Measurable Real-World ROI</h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">Custom QR scan codes and regional landing pages bridge physical wraps directly to digital conversion tracking engines.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Simulated Video Player Hook section */}
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <div 
            onClick={() => navigate(`/funnel/video-1${refId ? `?ref=${refId}` : ''}`)}
            className="group relative bg-slate-950/60 rounded-3xl border border-slate-900 overflow-hidden cursor-pointer hover:border-neonRed/40 transition-all duration-300 p-8 shadow-2xl text-center space-y-6"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10"></div>
            
            {/* Play Button Icon */}
            <div className="w-20 h-20 bg-neonRed/10 text-neonRed border border-neonRed/30 rounded-full flex items-center justify-center mx-auto relative z-20 group-hover:scale-115 transition-transform duration-300 shadow-lg shadow-neonRed/10">
              <Play className="w-8 h-8 fill-neonRed ml-1" />
            </div>

            <div className="relative z-20 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neonRed px-2.5 py-1 bg-neonRed/10 rounded-full border border-neonRed/20">Free Onboarding series</span>
              <h3 className="text-2xl font-black text-white font-grotesk tracking-tight">Why Internet Ads Keep Burning Budget</h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">Discover the metrics behind skyrocketing CPC auctions and how to establish a local branding monopoly in your territory.</p>
            </div>

            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block relative z-20 group-hover:text-neonRed transition-colors">Click to begin Video 1 (12 mins) →</span>
          </div>
        </section>

        {/* The Problem & Solution */}
        <section className="py-20 px-6 bg-slate-950/40 border-y border-slate-900/60">
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <span className="inline-block text-xs font-bold text-neonRed uppercase tracking-wider bg-neonRed/10 border border-neonRed/20 px-3.5 py-1.5 rounded-full">
              The Digital Ad Dilemma
            </span>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-grotesk font-semibold">
              "For decades, business owners across almost every industry have been led to believe that internet advertising is the only viable marketing solution, despite many campaigns failing to deliver a meaningful return on investment."
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl mx-auto">
              Rule 7 Media provides a two-tier solution: educating potential advertisers on the powerful benefits of offline campaigns while matching them with verified local wrapping partners in protected territory zones.
            </p>
          </div>
        </section>

        {/* How It Works Flow */}
        <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-white font-grotesk tracking-tight">The 4-Step Onboarding Flow</h2>
            <p className="text-xs text-slate-400">From digital education to high-impact physical wrapped vehicles.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-400">
            <div className="glass-card p-6 space-y-4 hover:border-slate-800 transition-all">
              <span className="text-neonCyan font-grotesk font-black text-lg block">01</span>
              <h4 className="font-bold text-white text-sm">Watch Video 1</h4>
              <p className="leading-relaxed">Access Video 1 and explore the CPM math exposing digital budget burn rates.</p>
            </div>
            
            <div className="glass-card p-6 space-y-4 hover:border-slate-800 transition-all">
              <span className="text-neonPurple font-grotesk font-black text-lg block">02</span>
              <h4 className="font-bold text-white text-sm">7-Video series</h4>
              <p className="leading-relaxed">Watch the complete free series outlining frequency recall rules and tracking.</p>
            </div>

            <div className="glass-card p-6 space-y-4 hover:border-slate-800 transition-all">
              <span className="text-neonAmber font-grotesk font-black text-lg block">03</span>
              <h4 className="font-bold text-white text-sm">Progressive Scoring</h4>
              <p className="leading-relaxed">Complete quick matching quizzes sharing your local target audience goals.</p>
            </div>

            <div className="glass-card p-6 space-y-4 hover:border-slate-800 transition-all">
              <span className="text-neonGreen font-grotesk font-black text-lg block">04</span>
              <h4 className="font-bold text-white text-sm">Wrapping Match</h4>
              <p className="leading-relaxed">Get routed to a certified wrapping shop partner to construct your wraps.</p>
            </div>
          </div>
        </section>

        {/* Why Businesses Choose Out-of-Home */}
        <section id="why-vehicle" className="py-24 px-6 bg-slate-950/20 border-t border-slate-900/60 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-3xl font-black text-white font-grotesk tracking-tight">Why Businesses Choose Vehicle Advertising</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-xl mx-auto text-left text-xs text-slate-300">
              <div className="flex items-center gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-900"><span className="text-neonGreen font-bold text-sm">✔</span> Lower CPM costs than search ads</div>
              <div className="flex items-center gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-900"><span className="text-neonGreen font-bold text-sm">✔</span> Hyperlocal target market reach</div>
              <div className="flex items-center gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-900"><span className="text-neonGreen font-bold text-sm">✔</span> 24/7 continuous visibility</div>
              <div className="flex items-center gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-900"><span className="text-neonGreen font-bold text-sm">✔</span> Long-term, durable outdoor branding</div>
              <div className="flex items-center gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-900"><span className="text-neonGreen font-bold text-sm">✔</span> Builds instant neighborhood trust</div>
              <div className="flex items-center gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-900"><span className="text-neonGreen font-bold text-sm">✔</span> Non-intrusive local ad format</div>
            </div>
            
            <div className="pt-6">
              <button
                onClick={() => navigate(`/funnel/video-1${refId ? `?ref=${refId}` : ''}`)}
                className="px-10 py-4 bg-neonRed hover:bg-neonRed/90 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-neonRed/20 hover:scale-[1.02] transform duration-200"
              >
                Start Onboarding Now
              </button>
            </div>
          </div>
        </section>

        {/* Premium Interactive FAQ Section */}
        <section id="faq" className="py-24 px-6 max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white font-grotesk tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Everything you need to know about vehicle advertising frameworks.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is the Rule of 7 in local advertising?",
                a: "The Rule of 7 states that a prospect needs to see your brand at least 7 times before taking action. Wrapped fleet vehicles provide these high-frequency views naturally as they circulate through your service radius."
              },
              {
                q: "How do QR codes work on mobile wraps?",
                a: "We integrate high-contrast QR scan tags into wrap designs. When prospects scan them, our system routes them to a local funnel page, registers their intent metrics, and attributes them to your area partner."
              },
              {
                q: "Why is vehicle advertising cheaper than Google or Facebook Ads?",
                a: "Google and Facebook use competitive bidding models where click prices increase daily. A single wrapped vehicle generates millions of impressions over years for a one-time wrapping cost, costing pennies per CPM."
              },
              {
                q: "How do I get matched with a wrapping partner?",
                a: "After completing the 7-video series, our engine profiles your fleet size, territory budget, and matches you with a certified, protected wrap shop partner in your area to construct and verify wraps."
              }
            ].map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="glass-card rounded-xl overflow-hidden border border-slate-900/60 hover:border-slate-800 transition-all duration-300"
                >
                  <button 
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left text-xs font-bold text-white flex justify-between items-center transition-colors duration-200 hover:text-neonCyan"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-neonCyan transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="px-5 pb-5 text-[11px] text-slate-400 leading-relaxed border-t border-slate-900/40 pt-3">
                      {item.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <GlobalFooter />
      </div>
    );
  }

  if (isCompletePage) {
    return (
      <div className="min-h-screen relative overflow-x-hidden w-full max-w-[100vw] bg-black text-slate-300 font-sans flex flex-col pt-24">
        <nav className="fixed top-0 inset-x-0 w-auto z-50 py-4 px-4 sm:px-6 flex justify-between items-center bg-darkBg/90 backdrop-blur-md border-b border-slate-900 max-w-[100vw]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neonRed flex items-center justify-center font-bold text-white shadow-lg glow-pink">R</div>
            <span className="font-grotesk font-bold text-xl tracking-tight text-white">Rule7<span className="text-neonRed">Media</span></span>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl w-full mx-auto px-6 pb-16 flex flex-col gap-10">
          
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-grotesk font-black text-white uppercase tracking-tight">
              Congratulations on Completing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonRed via-neonPink to-neonCyan">Marketing Mastery Journey</span>
            </h1>
            <p className="text-lg text-slate-400">You are one step away from the Real Game Changer by gamifying your marketing Strategy leading to Viral spread of your message.</p>
          </div>

          {/* Bonus Video */}
          <div className="glass-card rounded-2xl p-6 border border-neonCyan/30 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neonCyan bg-neonCyan/10 px-2 py-1 rounded border border-neonCyan/20">
                Bonus Video
              </span>
              <span className="text-xs text-slate-500">Duration: 7 minutes 24 seconds</span>
            </div>
            <h2 className="text-xl font-grotesk font-bold text-white mb-2">Expected Impact of Emerging Online Safety Legislation Requiring Digital ID</h2>
            <p className="text-sm text-slate-400 mb-6">New online safety laws in the USA, Eurozone, Australia, the UK, Canada and other countries are introducing stricter age verification and Digital ID requirements. For small businesses that rely on social media and digital advertising, this could mean reduced reach, higher costs, and more fragmented audiences.<br/><br/>This video examines what these changes are likely to mean for your advertising results — and why many businesses are already looking at reliable, privacy-friendly alternatives that deliver consistent local impressions without digital verification barriers.</p>
            
            <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl group mb-6">
               <img src="/assets/vehicle_wrap.png" alt="Bonus Video Thumbnail" className="w-full h-full object-cover opacity-30 group-hover:opacity-20 transition-opacity" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-16 h-16 rounded-full bg-neonCyan/20 flex items-center justify-center cursor-pointer hover:bg-neonCyan/40 transition-colors z-20 shadow-lg shadow-neonCyan/20">
                    <Play className="w-8 h-8 fill-neonCyan ml-1" />
                 </div>
               </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Lesson Takeaways</p>
              <ul className="space-y-2 text-xs text-slate-300 ml-1">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-neonCyan" /> Audience reach declines</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-neonCyan" /> CPM rises</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-neonCyan" /> Real-world visibility gains value</li>
              </ul>
            </div>
          </div>

          {/* Claim Strategy Session Form */}
          <div className="glass-card rounded-2xl p-8 border border-neonRed/30 relative overflow-hidden mt-4 min-h-[300px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neonRed/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            
            {isSessionClaimed ? (
              <div className="relative z-10 text-center space-y-6 animate-slide-in">
                <div className="w-20 h-20 bg-neonGreen/10 text-neonGreen rounded-full flex items-center justify-center mx-auto border border-neonGreen/30 shadow-[0_0_30px_rgba(0,255,128,0.2)]">
                  <Check className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-white font-grotesk tracking-tight">Profile Finalized!</h3>
                <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 text-left space-y-3 max-w-lg mx-auto">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-neonGreen flex-shrink-0" />
                    <span>Your request has been successfully recorded in our system.</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-neonGreen flex-shrink-0" />
                    <span>Our verified local wrapping partner has been notified.</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-neonGreen flex-shrink-0" />
                    <span>They will contact you shortly to begin your Marketing Efficiency Audit.</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 italic mt-6">You will receive an email notification once the CRM integration is activated.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Claim Your Strategy Session</h3>
                <p className="text-sm text-slate-400 mb-8 relative z-10">Fill out the form below to connect with our verified local partner and implement these strategies.</p>
                
                <form onSubmit={submitComplete} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Name</label>
                      <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full glass-input rounded-lg p-3 text-slate-100 bg-slate-900/80 text-sm focus:ring-1 focus:ring-neonCyan transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email</label>
                      <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full glass-input rounded-lg p-3 text-slate-100 bg-slate-900/80 text-sm focus:ring-1 focus:ring-neonCyan transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Company</label>
                      <input type="text" name="company" value={formData.company || ''} onChange={handleInputChange} className="w-full glass-input rounded-lg p-3 text-slate-100 bg-slate-900/80 text-sm focus:ring-1 focus:ring-neonCyan transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Industry Sector</label>
                      <select name="industry" value={formData.industry || ''} onChange={handleInputChange} className="w-full glass-input rounded-lg p-3 text-slate-100 bg-slate-900/80 text-sm focus:ring-1 focus:ring-neonCyan transition-all">
                        <option value="" disabled className="bg-darkBg text-slate-400">Select Industry</option>
                        <option value="Home Services / Trades" className="bg-darkBg">Home Services / Trades</option>
                        <option value="Real Estate" className="bg-darkBg">Real Estate</option>
                        <option value="Healthcare / Dental" className="bg-darkBg">Healthcare / Dental</option>
                        <option value="Professional Services" className="bg-darkBg">Professional Services</option>
                        <option value="Retail / Hospitality" className="bg-darkBg">Retail / Hospitality</option>
                        <option value="Logistics / Delivery" className="bg-darkBg">Logistics / Delivery</option>
                        <option value="Other" className="bg-darkBg">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Marketing Budget (Optional)</label>
                      <input type="text" placeholder="e.g. $5000/mo" className="w-full glass-input rounded-lg p-3 text-white focus:ring-1 focus:ring-neonRed text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Market Allocation (Optional)</label>
                      <input type="text" placeholder="e.g. 80% Digital / 20% Traditional" className="w-full glass-input rounded-lg p-3 text-white focus:ring-1 focus:ring-neonRed text-sm transition-all" />
                    </div>
                  </div>
                  
                  <button type="submit" className="w-full p-4 bg-neonRed hover:bg-neonRed/90 rounded-lg font-bold text-white text-sm transition-all duration-300 shadow-[0_0_20px_rgba(255,42,85,0.4)] flex items-center justify-center gap-2 mt-4 hover:scale-[1.02]">
                    <span>Submit Profile & Claim Session</span>
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Gotta Scan Them All Video */}
          <div className="glass-card rounded-2xl p-6 border border-neonPink/30 shadow-[0_0_30px_rgba(255,10,214,0.1)] mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neonPink bg-neonPink/10 px-2 py-1 rounded border border-neonPink/20">
                Next Steps
              </span>
            </div>
            <h2 className="text-xl font-grotesk font-bold text-white mb-2">Gotta Scan Them All™ – Gamify Your Local Marketing</h2>
            <div className="space-y-4 mb-6">
              <p className="text-sm text-slate-400"><strong className="text-slate-300">Pain Points Addressed:</strong> Marketing that feels flat and one-way, low customer engagement, difficulty standing out, and the desire for marketing that actually creates excitement and loyalty.</p>
              <p className="text-sm text-slate-400">This is gamification that works in the real world. Your brand becomes part of a daily local challenge that people actively look for, engage with, and remember. Higher recall. More referrals. Stronger loyalty. Marketing that feels exciting instead of invisible.</p>
              <p className="text-sm text-slate-400">Local businesses using this approach don’t just advertise — they create a game customers want to play. The result is attention, recognition, and growth that digital ads simply cannot match.</p>
              <p className="text-sm text-slate-400">Watch now and discover how to turn everyday visibility into a powerful, addictive system that puts your business ahead of the competition.</p>
            </div>
            
            <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl group">
               <div className="absolute inset-0 bg-gradient-to-tr from-neonPink/10 to-neonCyan/10"></div>
               <img src="/assets/vehicle_wrap.png" alt="Gamification" className="w-full h-full object-cover opacity-20 group-hover:opacity-10 transition-opacity" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-16 h-16 rounded-full bg-neonPink/20 flex items-center justify-center cursor-pointer hover:bg-neonPink/40 transition-colors z-20 shadow-lg shadow-neonPink/20">
                    <Play className="w-8 h-8 fill-neonPink ml-1" />
                 </div>
               </div>
            </div>
          </div>

        </main>
        <GlobalFooter />
      </div>
    );
  }

  if (!leadId && currentStep >= 1) {
    // Lead Gating form
    return (
      <div className="min-h-screen relative overflow-x-hidden w-full max-w-[100vw] flex flex-col bg-darkBg text-white">
        <nav className="fixed top-0 inset-x-0 w-auto z-50 py-4 px-4 sm:px-6 flex justify-between items-center bg-darkBg/90 backdrop-blur-md border-b border-slate-900 max-w-[100vw]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neonRed flex items-center justify-center font-bold text-white shadow-lg glow-pink">R</div>
            <span className="font-grotesk font-bold text-xl tracking-tight text-white">Rule7<span className="text-neonRed">Media</span></span>
          </div>
          {refId && (
            <div className="text-xs bg-neonGreen/10 text-neonGreen px-3 py-1 rounded-full border border-neonGreen/20">
              Referred by: {refId}
            </div>
          )}
        </nav>

        <div className="flex-1 flex items-center justify-center py-28 px-4">
          <div className="max-w-xl w-full glass-card rounded-2xl p-8 shadow-2xl relative overflow-hidden animate-slide-in">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neonRed/5 rounded-full filter blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-center gap-1.5 mb-6">
              {[1,2,3,4,5,6,7].map(n => (
                <div key={n} className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                    {n}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-neonRed px-3 py-1 bg-neonRed/10 rounded-full border border-neonRed/20">Free Education Series</span>
              <h1 className="text-2xl font-grotesk font-extrabold text-white mt-4 leading-snug">Why Internet Ads Keep Burning Budget</h1>
              <p className="text-sm text-slate-400 mt-2">Discover why 60-80% of local ad campaigns fail — and what the smartest local businesses are doing instead. Free 7-video series.</p>
            </div>

            <form onSubmit={submitLanding} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required
                  placeholder="e.g. John Doe"
                  className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Business Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required
                  placeholder="e.g. john@yourcompany.com"
                  className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Company Name</label>
                <input 
                  type="text" 
                  name="company" 
                  value={formData.company} 
                  onChange={handleInputChange} 
                  required
                  placeholder="e.g. Greenfield Logistics"
                  className="w-full glass-input rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-sm"
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-xs bg-neonRed/10 text-neonRed p-3 rounded-lg border border-neonRed/20">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full p-3.5 bg-neonRed hover:bg-neonRed/90 rounded-lg font-bold text-white text-sm transition-all duration-300 shadow-lg glow-pink flex items-center justify-center gap-2 mt-4"
              >
                <span>Watch Free Training — Video 1</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  // --- Funnel Video Pages ---
  const currentQuiz = QUIZZES[currentStep];
  const videoContent = VIDEOS_CONTENT[currentStep];

  // Read saved progress from localStorage
  const highestStepCompleted = parseInt(localStorage.getItem('r7_highest_step_completed') || '0');

  return (
    <div className="min-h-screen relative overflow-x-hidden w-full max-w-[100vw] flex flex-col">
      {/* Top Navbar with Progress bar */}
      <header className="glass-card border-x-0 border-t-0 fixed top-0 w-full z-50 bg-darkBg/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neonRed flex items-center justify-center font-bold text-white">R</div>
            <span className="font-grotesk font-bold text-lg">Rule7<span className="text-neonRed">Media</span></span>
          </div>

          {/* Step progress badges with connector lines */}
          <div className="hidden md:flex items-center gap-0 w-[45%] max-w-lg select-none mr-4">
            {[1, 2, 3, 4, 5, 6, 7].map((n, idx) => {
              const done = n < currentStep || highestStepCompleted >= n;
              const active = n === currentStep;
              const upcoming = n > currentStep && highestStepCompleted < n;
              return (
                <React.Fragment key={n}>
                  {/* Node */}
                  <div className="flex flex-col items-center relative group">
                    <button
                      disabled={upcoming}
                      onClick={() => navigate(`/funnel/video-${n}${refId ? `?ref=${refId}` : ''}`)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border transition-all duration-300 ${
                        done
                          ? 'bg-neonGreen/20 border-neonGreen/80 text-neonGreen cursor-pointer hover:bg-neonGreen/30'
                          : active
                          ? 'bg-neonRed border-neonRed text-white scale-110 shadow-lg shadow-neonRed/20'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      {done ? <Check className="w-3.5 h-3.5 text-neonGreen font-bold" /> : n}
                    </button>
                    {/* Always visible label underneath */}
                    <span className={`absolute -bottom-5 text-[8px] font-bold uppercase tracking-wider whitespace-nowrap pointer-events-none transition-all duration-300 ${
                      active ? 'text-neonRed font-black translate-y-0.5' : done ? 'text-neonGreen' : 'text-slate-500'
                    }`}>
                      Video {n}
                    </span>
                    {/* Hover Status Tooltip */}
                    <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-900 text-white border border-slate-800 px-2 py-0.5 rounded text-[9px] whitespace-nowrap font-semibold shadow-xl z-20 pointer-events-none">
                      {done ? `Video ${n}: Done (সম্পন্ন)` : active ? `Video ${n}: Playing (চলমান)` : `Video ${n}: Locked (পরবর্তী)`}
                    </span>
                  </div>

                  {/* Line connector */}
                  {idx < 6 && (
                    <div className="flex-1 h-[2px] relative min-w-[10px] mx-1">
                      <div className="absolute inset-0 bg-slate-800 rounded"></div>
                      <div 
                        className={`absolute inset-0 bg-gradient-to-r from-neonRed to-neonCyan rounded transition-all duration-500 ${
                          done ? 'w-full opacity-100' : 'w-0 opacity-0'
                        }`}
                      ></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
            <Flame className="w-4 h-4 text-neonAmber animate-pulse" />
            <span className="text-[11px] font-semibold">Video <strong>{currentStep}</strong> of 7 <span className="hidden sm:inline text-slate-500">· {videoContent?.title.split(':')[1]?.trim() || videoContent?.title}</span></span>
          </div>
        </div>

        {/* Global Funnel completion Bar */}
        <div className="w-full bg-slate-900 h-1">
          <div 
            className="h-full bg-gradient-to-r from-neonRed via-neonPink to-neonCyan transition-all duration-500" 
            style={{ width: `${(currentStep / 7) * 100}%` }}
          ></div>
        </div>
      </header>

      {/* Main gated body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pt-28 pb-16 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Video Content & Player */}
        <div className="flex-1 space-y-6">
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neonCyan bg-neonCyan/10 px-2 py-1 rounded border border-neonCyan/20">
                Gated Module {currentStep}
              </span>
              <span className="text-xs text-slate-500">Duration: {videoContent?.durationText || `~${videoContent?.duration * 10} seconds`}</span>
            </div>
            <h1 className="text-xl font-grotesk font-bold text-white mb-2">{videoContent?.title}</h1>
            <p className="text-sm text-slate-400 mb-6">{videoContent?.description}</p>

            {/* VIDEO PLAYER */}
            <div className="relative aspect-video rounded-xl bg-black border border-slate-800 flex flex-col justify-center items-center group overflow-hidden shadow-2xl">
              
              {videoContent?.url ? (
                // REAL VIDEO MODE
                <>
                  <iframe src={videoContent.url} className="w-full h-full absolute inset-0 border-0 z-0" allowFullScreen></iframe>
                  
                  {/* Overlay for unlocking quiz manually if they don't want to wait */}
                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    {videoProgress < 100 ? (
                      <button 
                        onClick={skipVideo}
                        className="text-xs bg-slate-900/80 hover:bg-slate-800 hover:text-white text-slate-300 px-3 py-1.5 rounded-md border border-slate-700/50 backdrop-blur-sm transition-all shadow-lg"
                      >
                        Unlock Quiz
                      </button>
                    ) : (
                      <div className="text-xs bg-neonGreen/90 text-black font-bold px-3 py-1.5 rounded-md shadow-lg flex items-center gap-2">
                        <Check className="w-4 h-4" /> Quiz Unlocked
                      </div>
                    )}
                  </div>
                  
                  {/* We auto-start the background timer so quiz unlocks eventually */}
                  {!isPlaying && videoProgress < 100 && (
                    <div className="absolute inset-0 pointer-events-none" ref={() => { if(!isPlaying) handlePlay(); }}></div>
                  )}
                </>
              ) : (
                // MOCK VIDEO MODE (For videos without URL yet)
                <>
                  {videoProgress < 100 ? (
                    <>
                      {/* Play Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-between p-4 z-10 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex justify-end">
                          <button 
                            onClick={skipVideo}
                            className="text-xs bg-slate-900/80 hover:bg-slate-800 hover:text-white text-slate-300 px-3 py-1.5 rounded-md border border-slate-700/50 backdrop-blur-sm transition-all shadow-lg"
                          >
                            Skip Video (Test Mode)
                          </button>
                        </div>
    
                        {!isPlaying && (
                          <div className="flex flex-col items-center justify-center absolute inset-0">
                            <button 
                              onClick={handlePlay}
                              className="w-16 h-16 bg-neonRed hover:bg-neonRed/90 hover:scale-105 active:scale-95 text-white rounded-full flex items-center justify-center transition-all shadow-xl glow-pink z-20"
                            >
                              <Play className="w-6 h-6 fill-white ml-1" />
                            </button>
                            <span className="text-xs font-semibold text-slate-300 mt-4 tracking-wider uppercase bg-slate-950/70 py-1 px-3 rounded-full backdrop-blur-sm">
                              Click to Watch Lesson
                            </span>
                          </div>
                        )}
                        {isPlaying && (
                          <div className="flex flex-col items-center justify-center absolute inset-0">
                            <div className="w-16 h-16 bg-neonRed rounded-full flex items-center justify-center transition-all shadow-xl glow-pink z-20">
                              <div className="flex gap-1.5 items-center">
                                <span className="w-1.5 h-6 bg-white rounded-full animate-pulse"></span>
                                <span className="w-1.5 h-6 bg-white rounded-full animate-pulse"></span>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-slate-300 mt-4 tracking-wider uppercase bg-slate-950/70 py-1 px-3 rounded-full backdrop-blur-sm">
                              Streaming Session Live...
                            </span>
                          </div>
                        )}
    
                        {/* Bottom Progress Bar */}
                        <div className="space-y-1 z-20">
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>{Math.round((videoProgress / 100) * (videoContent?.duration * 10))}s</span>
                            <span>{videoContent?.duration * 10}s</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="h-full bg-neonRed transition-all duration-300"
                              style={{ width: `${videoProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-black/80 absolute inset-0 z-10 backdrop-blur-sm">
                      <div className="w-16 h-16 bg-neonGreen/20 rounded-full flex items-center justify-center mb-4">
                        <Check className="w-8 h-8 text-neonGreen font-bold" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Module Completed</h3>
                      <p className="text-sm text-slate-300">Video lesson completed. Please complete the quiz on the right to proceed.</p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Key Takeaways list */}
            <div className="mt-6 border-t border-slate-800/80 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Lesson takeaways:</h4>
              <ul className="space-y-2">
                {videoContent?.points.map((pt, idx) => (
                  <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                    <Shield className="w-4 h-4 text-neonCyan flex-shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side: Progressive Form Gating & Quizzes */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="glass-card rounded-2xl p-6 relative">
            <h2 className="text-lg font-grotesk font-bold text-white mb-4 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-neonRed" />
              <span>Step {currentStep} Data Validation</span>
            </h2>

            {/* Progressive form group */}
            <form onSubmit={submitStep} className="space-y-4">
              
              {currentStep === 1 && (
                <div className="space-y-4 text-left">
                  <div className="text-[11px] text-slate-400 bg-slate-950/60 p-4 rounded-xl border border-slate-900 leading-relaxed space-y-2">
                    <p className="font-semibold text-white">Thank you for watching Video 1: 'Why is my internet advertising burning budget?'</p>
                    <p>To unlock the full 7-video series and receive personalized insights on smarter marketing strategies, please provide the following details. This limited information allows us to deliver the complete series securely and ensures the content remains relevant to your location and needs.</p>
                    
                    <div className="border-t border-slate-900 pt-2.5 mt-2 space-y-1">
                      <p className="font-bold uppercase tracking-wider text-[9px] text-neonCyan">What you'll gain access to:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-400">
                        <li>Video 2: Hidden Costs of Staying Invisible</li>
                        <li>Video 3: AI Noise vs. Real-World Trust</li>
                        <li>Video 4: Recession-Proof Your Marketing</li>
                        <li>Video 5: Local Domination</li>
                        <li>Video 6: The Trust Factor</li>
                        <li>Video 7: Future-Proof Marketing ROI</li>
                      </ul>
                    </div>

                    <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/40">
                      These videos address the real pain points of rising ad costs, digital noise from AI content, economic uncertainty, and the fear of losing local customers.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      required
                      placeholder="e.g. John Doe"
                      className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Business Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      required
                      placeholder="e.g. john@company.com"
                      className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">State / Region</label>
                      <input 
                        type="text" 
                        name="state" 
                        value={formData.state} 
                        onChange={handleInputChange} 
                        required
                        placeholder="e.g. NSW"
                        className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Country</label>
                      <input 
                        type="text" 
                        name="country" 
                        value={formData.country} 
                        onChange={handleInputChange} 
                        required
                        placeholder="e.g. Australia"
                        className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                      />
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 text-center italic mt-2 border-t border-slate-900 pt-2">
                    🔒 Your information helps us deliver better insights and is never shared with third parties.
                  </div>
                </div>
              )}

              {/* Step fields */}
              {currentStep === 2 && (
                <div className="space-y-4 text-left">
                  <div className="text-[11px] text-slate-400 bg-slate-950/60 p-4 rounded-xl border border-slate-900 leading-relaxed space-y-2">
                    <p className="font-semibold text-white">To help us tailor the upcoming videos with more relevant local examples, could you share a bit more about your business?</p>
                    <p>This takes less than 30 seconds and allows us to highlight strategies that best match your market.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Company / Business Name</label>
                    <input 
                      type="text" 
                      name="company" 
                      value={formData.company} 
                      onChange={handleInputChange} 
                      required
                      placeholder="e.g. Greenfield Logistics"
                      className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    />
                  </div>

                  <div className="relative text-left" ref={industryDropdownRef}>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Industry / Sector</label>
                    <button
                      type="button"
                      onClick={() => setIsIndustryDropdownOpen(!isIndustryDropdownOpen)}
                      className="w-full glass-input rounded-lg p-2.5 text-slate-100 text-left focus:ring-1 focus:ring-neonCyan text-xs flex justify-between items-center"
                    >
                      <span className={formData.industry ? 'text-slate-100' : 'text-slate-500'}>
                        {formData.industry || "Select your industry"}
                      </span>
                      <span className="text-slate-500 text-[9px]">▼</span>
                    </button>

                    {isIndustryDropdownOpen && (
                      <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-slate-850 bg-[#0B0F19] shadow-2xl animate-slide-in">
                        {[
                          "Accounting & Tax Services", "Automotive Services", "Baby Clothes, Accessories & Toys", 
                          "Beauty and Cosmetic Surgery", "Childcare & Aged Care Providers", "Department Stores and Electronics", 
                          "Education & Tutoring", "Event & Wedding Services", "Financial and Insurance Services", 
                          "Fitness & Personal Training", "Funeral and Bereavement Counselling", "Home & Garden", 
                          "Health, Wellness & Medical", "IT & Tech Support Services", "Legal Services, Lawyers and Mediation", 
                          "Lifestyle, Boutique, Apparel & Accessories", "Mobile Phone and Internet Services", 
                          "Travel & Tourism", "Pets & Animals", "Professional Training & Certification", 
                          "Radio and TV Stations", "Real Estate & Property Agents", "Restaurants, Food & Beverage", 
                          "Storage, Logistics and Removalists", "Trades & Home Services", "Other"
                        ].map((ind) => (
                          <button
                            key={ind}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, industry: ind }));
                              setIsIndustryDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2 px-3 text-xs transition-colors hover:bg-neonCyan/10 hover:text-white ${
                              formData.industry === ind ? 'bg-neonCyan/10 text-neonCyan font-semibold' : 'text-slate-300'
                            }`}
                          >
                            {ind}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {formData.industry === 'Other' && (
                    <div className="animate-slide-in">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Please Specify Industry</label>
                      <input 
                        type="text" 
                        name="otherIndustry" 
                        value={formData.otherIndustry || ''} 
                        onChange={handleInputChange} 
                        required
                        placeholder="Your industry name"
                        className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Main Service Area / City</label>
                    <input 
                      type="text" 
                      name="serviceArea" 
                      value={formData.serviceArea} 
                      onChange={handleInputChange} 
                      required
                      placeholder="e.g. Sydney"
                      className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    />
                  </div>

                  <div className="text-[10px] text-slate-500 text-center italic mt-2 border-t border-slate-900 pt-2">
                    🔒 Your information helps us deliver better insights and is never shared with third parties.
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4 text-left">
                  <div className="text-[11px] text-slate-400 bg-slate-950/60 p-4 rounded-xl border border-slate-900 leading-relaxed space-y-2">
                    <p className="font-semibold text-white">As we dive deeper into building trust and visibility, knowing your role and business structure helps us focus on the challenges and opportunities most relevant to decision-makers like yourself.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Your Role / Title</label>
                    <input 
                      type="text" 
                      name="role" 
                      value={formData.role} 
                      onChange={handleInputChange} 
                      required
                      placeholder="e.g., Owner, Marketing Manager, Decision Maker"
                      className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Number of Locations / Branches</label>
                    <select 
                      name="locations" 
                      value={formData.locations} 
                      onChange={handleInputChange} 
                      required
                      className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    >
                      <option value="" disabled className="bg-darkBg">Select number of locations</option>
                      <option value="1" className="bg-darkBg">1 location</option>
                      <option value="2-5" className="bg-darkBg">2 - 5 locations</option>
                      <option value="6-10" className="bg-darkBg">6 - 10 locations</option>
                      <option value="10+" className="bg-darkBg">10+ locations</option>
                    </select>
                  </div>

                  <div className="text-[10px] text-slate-500 text-center italic mt-2 border-t border-slate-900 pt-2">
                    🔒 Your information helps us deliver better insights and is never shared with third parties.
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4 text-left">
                  <div className="text-[11px] text-slate-400 bg-slate-950/60 p-4 rounded-xl border border-slate-900 leading-relaxed space-y-2">
                    <p className="font-semibold text-white">Understanding the scale of your operations allows us to share more precise examples of how efficient marketing strategies scale with businesses of your size. This insight is especially useful for the industry specific focused tactics covered in later videos.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Approximate Number of Employees</label>
                    <select 
                      name="employees" 
                      value={formData.employees} 
                      onChange={handleInputChange} 
                      required
                      className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    >
                      <option value="" disabled className="bg-darkBg">Select employee range</option>
                      <option value="1-5" className="bg-darkBg">1 - 5 employees</option>
                      <option value="6-20" className="bg-darkBg">6 - 20 employees</option>
                      <option value="21-50" className="bg-darkBg">21 - 50 employees</option>
                      <option value="51+" className="bg-darkBg">51+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Number of Vehicles in Your Fleet / Regular Use</label>
                    <select 
                      name="fleetSize" 
                      value={formData.fleetSize} 
                      onChange={handleInputChange} 
                      required
                      className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    >
                      <option value="" disabled className="bg-darkBg">Select vehicle count</option>
                      <option value="None" className="bg-darkBg">None (Personal Vehicle only)</option>
                      <option value="1-3" className="bg-darkBg">1 - 3 vehicles</option>
                      <option value="4-10" className="bg-darkBg">4 - 10 vehicles</option>
                      <option value="11-25" className="bg-darkBg">11 - 25 vehicles</option>
                      <option value="25+" className="bg-darkBg">25+ vehicles (Commercial Fleet)</option>
                    </select>
                  </div>

                  <div className="text-[10px] text-slate-500 text-center italic mt-2 border-t border-slate-900 pt-2">
                    🔒 Your information helps us deliver better insights and is never shared with third parties.
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4 text-left">
                  <div className="text-[11px] text-slate-400 bg-slate-950/60 p-4 rounded-xl border border-slate-900 leading-relaxed space-y-2">
                    <p className="font-semibold text-white">To make the local domination strategies in the next videos even more actionable for your specific operations, please tell us a little about the vehicles and areas where your team is active.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Types of Vehicles Used</label>
                    <div className="space-y-2">
                      {["Cars/Sedans", "Vans", "Trucks", "Trailers", "Other"].map((type, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleVehicleTypeToggle(type)}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex justify-between items-center ${
                            formData.vehicleTypes.includes(type)
                              ? 'bg-neonCyan/10 border-neonCyan text-neonCyan font-semibold'
                              : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span>{type}</span>
                          {formData.vehicleTypes.includes(type) && <Check className="w-3.5 h-3.5" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Primary Service Territories / Areas</label>
                    <input 
                      type="text" 
                      name="serviceTerritories" 
                      value={formData.serviceTerritories} 
                      onChange={handleInputChange} 
                      required
                      placeholder="e.g. Western Suburbs, Chicago Metro Area"
                      className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Do your vehicles currently feature professional branding or signage?</label>
                    <select 
                      name="hasBranding" 
                      value={formData.hasBranding} 
                      onChange={handleInputChange} 
                      required
                      className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    >
                      <option value="" disabled className="bg-darkBg">Select Option</option>
                      <option value="Yes" className="bg-darkBg">Yes</option>
                      <option value="No" className="bg-darkBg">No</option>
                      <option value="Partially" className="bg-darkBg">Partially</option>
                    </select>
                  </div>

                  <div className="text-[10px] text-slate-500 text-center italic mt-2 border-t border-slate-900 pt-2">
                    🔒 Your information helps us deliver better insights and is never shared with third parties.
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-4 text-left">
                  <div className="text-[11px] text-slate-400 bg-slate-950/60 p-4 rounded-xl border border-slate-900 leading-relaxed space-y-2">
                    <p className="font-semibold text-white">Many businesses are reassessing their marketing spend in the current environment. Sharing your current budget and allocation (even approximately) helps us demonstrate exactly how the low-CPM approaches discussed in Video 7 could impact your bottom line. All information is kept confidential.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Current Monthly Marketing Budget</label>
                    <select 
                      name="budget" 
                      value={formData.budget} 
                      onChange={handleInputChange} 
                      required
                      className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    >
                      <option value="" disabled className="bg-darkBg">Select budget range</option>
                      <option value="Under $500" className="bg-darkBg">Under $500 / month</option>
                      <option value="$500-$2,000" className="bg-darkBg">$500 - $2,000 / month</option>
                      <option value="$2,000-$5,000" className="bg-darkBg">$2,000 - $5,000 / month</option>
                      <option value="$5,000-$10,000" className="bg-darkBg">$5,000 - $10,000 / month</option>
                      <option value="$10,000+" className="bg-darkBg">$10,000+ / month</option>
                      <option value="Prefer not to say" className="bg-darkBg">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Rough Allocation % (Optional)</label>
                    <div className="space-y-2 bg-slate-950/40 p-3 rounded-lg border border-slate-900/60 text-xs">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[10.5px] text-slate-400">Digital / Social Media</span>
                        <input 
                          type="text" 
                          name="allocDigital" 
                          value={formData.allocDigital} 
                          onChange={handleInputChange} 
                          placeholder="e.g. 60%" 
                          className="w-16 glass-input rounded p-1 text-center text-slate-100 text-xs focus:ring-1 focus:ring-neonCyan"
                        />
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[10.5px] text-slate-400">Traditional / Print</span>
                        <input 
                          type="text" 
                          name="allocTraditional" 
                          value={formData.allocTraditional} 
                          onChange={handleInputChange} 
                          placeholder="e.g. 20%" 
                          className="w-16 glass-input rounded p-1 text-center text-slate-100 text-xs focus:ring-1 focus:ring-neonCyan"
                        />
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[10.5px] text-slate-400">Other (e.g., signage, vehicles, events)</span>
                        <input 
                          type="text" 
                          name="allocOther" 
                          value={formData.allocOther} 
                          onChange={handleInputChange} 
                          placeholder="e.g. 20%" 
                          className="w-16 glass-input rounded p-1 text-center text-slate-100 text-xs focus:ring-1 focus:ring-neonCyan"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">What percentage of your new customers come from local vs. online sources?</label>
                    <select 
                      name="localVsOnlinePct" 
                      value={formData.localVsOnlinePct} 
                      onChange={handleInputChange} 
                      required
                      className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                    >
                      <option value="" disabled className="bg-darkBg">Select ratio</option>
                      <option value="100% Local / 0% Online" className="bg-darkBg">100% Local / 0% Online</option>
                      <option value="80% Local / 20% Online" className="bg-darkBg">80% Local / 20% Online</option>
                      <option value="50% Local / 50% Online" className="bg-darkBg">50% Local / 50% Online</option>
                      <option value="20% Local / 80% Online" className="bg-darkBg">20% Local / 80% Online</option>
                      <option value="0% Local / 100% Online" className="bg-darkBg">0% Local / 100% Online</option>
                    </select>
                  </div>

                  <div className="text-[10px] text-slate-500 text-center italic mt-2 border-t border-slate-900 pt-2">
                    🔒 Your information helps us deliver better insights and is never shared with third parties.
                  </div>
                </div>
              )}

              {currentStep === 7 && (
                <div className="space-y-4 text-left">
                  <div className="text-[11px] text-slate-400 bg-slate-950/60 p-4 rounded-xl border border-slate-900 leading-relaxed space-y-2">
                    <p className="font-semibold text-white">Congratulations on completing the full series! To provide truly customized recommendations for your business — including projected ROI for efficient visibility solutions — we’d appreciate these final details. This will allow our team to prepare specific ideas tailored to your situation before any conversation.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">When are you next reviewing marketing options? *</label>
                      <select 
                        name="reviewTimeline" 
                        value={formData.reviewTimeline} 
                        onChange={handleInputChange} 
                        required
                        className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                      >
                        <option value="" disabled className="bg-darkBg">Select Timeline</option>
                        <option value="Currently" className="bg-darkBg">Currently</option>
                        <option value="Within 3 Months" className="bg-darkBg">Within 3 Months</option>
                        <option value="Within 6 Months" className="bg-darkBg">Within 6 Months</option>
                        <option value="Within 12 Months" className="bg-darkBg">Within 12 Months</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Decision Maker's Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        placeholder="+1 (555) 000-0000"
                        className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Key Marketing Goals / Challenges (Select all that apply)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        "Generate more local leads",
                        "Improve brand visibility",
                        "Reduce ad waste",
                        "Increase trust",
                        "Other"
                      ].map((goal, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleGoalToggle(goal)}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex justify-between items-center ${
                            formData.goals.includes(goal)
                              ? 'bg-neonCyan/10 border-neonCyan text-neonCyan font-semibold'
                              : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span>{goal}</span>
                          {formData.goals.includes(goal) && <Check className="w-3.5 h-3.5" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Best Time for a Consultation</label>
                      <select 
                        name="consultTime" 
                        value={formData.consultTime} 
                        onChange={handleInputChange} 
                        className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                      >
                        <option value="" className="bg-darkBg">Select Time (Optional)</option>
                        <option value="Morning" className="bg-darkBg">Morning</option>
                        <option value="Afternoon" className="bg-darkBg">Afternoon</option>
                        <option value="Evening" className="bg-darkBg">Evening</option>
                        <option value="Anytime" className="bg-darkBg">Anytime</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Would you like a free “Marketing Efficiency Audit”? *</label>
                      <select 
                        name="auditRequest" 
                        value={formData.auditRequest} 
                        onChange={handleInputChange} 
                        required
                        className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs"
                      >
                        <option value="" disabled className="bg-darkBg">Select Option</option>
                        <option value="As soon as possible" className="bg-darkBg">As soon as possible</option>
                        <option value="Within 3 months" className="bg-darkBg">Within 3 months</option>
                        <option value="Within Six Months" className="bg-darkBg">Within Six Months</option>
                        <option value="Within 12 months" className="bg-darkBg">Within 12 months</option>
                        <option value="No Thank You" className="bg-darkBg">No Thank You</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Additional Notes / Comments</label>
                    <textarea 
                      name="customGoals"
                      value={formData.customGoals}
                      onChange={handleInputChange}
                      placeholder="Specify any localized marketing requirements..."
                      className="w-full glass-input rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-neonCyan text-xs h-16 resize-none"
                    ></textarea>
                  </div>

                  <div className="text-[10px] text-slate-500 text-center italic mt-2 border-t border-slate-900 pt-2">
                    🔒 Your information helps us deliver better insights and is never shared with third parties.
                  </div>
                </div>
              )}

              {/* QUIZ SECTION (GATED BY VIDEO COMPLETION) */}
              {quizUnlocked && currentQuiz && (
                <div className="mt-6 border-t border-slate-800 pt-4 animate-slide-in">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neonCyan mb-3 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    <span>Verification Quiz</span>
                  </h3>

                  {currentQuiz.questions.map((q, qIdx) => {
                    const selected = quizAnswers[currentStep]?.[qIdx];
                    const isCorrect = selected === q.correct;
                    const isWrong = quizChecked && selected !== undefined && !isCorrect;
                    const isLocked = quizChecked && isCorrect; // Correct answers are frozen

                    return (
                      <div key={qIdx} className={`mb-4 rounded-xl border p-4 transition-all ${
                        quizChecked
                          ? isCorrect
                            ? 'bg-neonGreen/5 border-neonGreen/30'
                            : 'bg-neonRed/5 border-neonRed/30'
                          : 'bg-slate-950/80 border-slate-900'
                      }`}>
                        {/* Question header with result badge */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <p className="text-xs font-medium text-slate-200 flex-1">{qIdx + 1}. {q.question}</p>
                          {quizChecked && (
                            <span className={`flex-shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              isCorrect
                                ? 'bg-neonGreen/20 text-neonGreen border border-neonGreen/30'
                                : 'bg-neonRed/20 text-neonRed border border-neonRed/30'
                            }`}>
                              {isCorrect ? '✓ Correct' : '✗ Wrong — try again'}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selected === optIdx;
                            const isTheCorrect = optIdx === q.correct;

                            // Styling logic
                            let btnClass = 'bg-slate-900/40 border-slate-900/80 text-slate-400 hover:border-slate-700 cursor-pointer';
                            let suffix = null;

                            if (quizChecked) {
                              if (isSelected && isCorrect && isTheCorrect) {
                                // Selected AND correct
                                btnClass = 'bg-neonGreen/15 border-neonGreen text-neonGreen cursor-default';
                                suffix = <span className="text-neonGreen font-bold">✓</span>;
                              } else if (isSelected && !isCorrect) {
                                // Selected but WRONG
                                btnClass = 'bg-neonRed/15 border-neonRed text-neonRed cursor-pointer';
                                suffix = <span className="text-neonRed font-bold">✗</span>;
                              } else if (!isSelected && isLocked) {
                                // Unselected, question is locked (already correct)
                                btnClass = 'bg-slate-900/20 border-slate-900/40 text-slate-600 cursor-default';
                              } else if (!isSelected && !isCorrect) {
                                // Unselected, question needs retry — allow picking
                                btnClass = 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-neonCyan/50 cursor-pointer';
                              }
                            } else if (isSelected) {
                              // Before checking — just highlight selected
                              btnClass = 'bg-neonCyan/10 border-neonCyan text-neonCyan cursor-pointer';
                            }

                            return (
                              <button
                                type="button"
                                key={optIdx}
                                onClick={() => handleSelectOption(qIdx, optIdx)}
                                disabled={quizChecked && isLocked}
                                className={`w-full text-left p-2.5 rounded-lg text-xs transition-all border flex items-center justify-between ${btnClass}`}
                              >
                                <span>{opt}</span>
                                {suffix}
                              </button>
                            );
                          })}
                        </div>

                        {/* Feedback message for wrong answers */}
                        {quizChecked && isWrong && (
                          <p className="text-[10px] text-neonRed mt-2 flex items-center gap-1">
                            <span>↳</span>
                            <span>Select the correct answer above to continue.</span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* BUTTON SUBMIT GATES */}
              <div className="pt-4 border-t border-slate-800/80 mt-6">
                {!quizUnlocked ? (
                  <div className="p-3 bg-slate-950 text-slate-500 rounded-lg text-xs text-center border border-slate-900">
                    🔒 Watch full video to unlock quiz
                  </div>
                ) : (
                  <>
                    {errorMsg && (
                      <div className="text-xs text-neonRed flex gap-1.5 items-center mb-3">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {savedSuccess ? (
                      <div className="w-full p-3.5 bg-neonGreen text-darkBg font-bold text-sm rounded-lg flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>{currentStep === 7 ? 'Completing...' : `Unlocking Video ${currentStep + 1}...`}</span>
                      </div>
                    ) : !currentQuiz ? (
                      // No quiz for this step — show direct submit
                      <button
                        type="submit"
                        className="w-full p-3.5 bg-neonCyan text-darkBg hover:bg-neonCyan/90 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg glow-cyan"
                      >
                        <span>Save & Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : !quizChecked ? (
                      // Quiz not checked yet — show "Check Answers" button
                      <button
                        type="button"
                        onClick={checkQuizAnswers}
                        className="w-full p-3.5 bg-neonCyan text-darkBg hover:bg-neonCyan/90 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg glow-cyan"
                      >
                        <span>Check My Answers</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : !quizPassed ? (
                      // Some answers are wrong — prompt to fix them
                      <div className="space-y-3">
                        <div className="p-3 bg-neonRed/10 border border-neonRed/20 rounded-lg text-xs text-neonRed flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>Some answers need correcting. Fix the highlighted questions above, then check again.</span>
                        </div>
                        <button
                          type="button"
                          onClick={checkQuizAnswers}
                          className="w-full p-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all border border-slate-700"
                        >
                          <span>Check Again</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      // All correct — show proceed button
                      <div className="space-y-3">
                        <div className="p-3 bg-neonGreen/10 border border-neonGreen/20 rounded-lg text-xs text-neonGreen flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          <span>All answers correct! You can now proceed.</span>
                        </div>
                        <button
                          type="submit"
                          className="w-full p-3.5 bg-neonCyan text-darkBg hover:bg-neonCyan/90 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg glow-cyan"
                        >
                          <span>{currentStep === 7 ? 'Complete Training' : `Unlock Video ${currentStep + 1}`}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
      <GlobalFooter />
    </div>
  );
};
