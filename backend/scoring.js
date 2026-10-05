/**
 * Refined 100-Point Algorithmic Lead Scoring Engine for Rule7Media
 * 
 * Accurately scores leads across 12 granular categories incorporating Video 7 telemetry:
 * 1. Videos Fully Watched (max 18 pts)
 * 2. Videos Partially Watched (max 5 pts)
 * 3. Progressive Data Provided (max 8 pts)
 * 4. Monthly Marketing Budget (max 15 pts)
 * 5. Local vs Online Customer Sources (max 12 pts)
 * 6. Contact & Decision-Maker Depth (max 10 pts)
 * 7. Quiz Questions Completed (max 5 pts)
 * 8. Fleet Size (max 4 pts)
 * 9. Marketing Review Timeline (Video 7) (max 8 pts)
 * 10. Key Marketing Goals (Video 7) (max 8 pts)
 * 11. Interest in Free Marketing Efficiency Audit (max 5 pts)
 * 12. Best Time for Consultation + Comments (max 2 pts)
 * 
 * CRM Priority Bands:
 * - 85–100 → Hot (call within 24 hours)
 * - 70–84  → Warm High (priority follow-up)
 * - 55–69  → Warm (personalised nurture)
 * - 35–54  → Cool (standard automation)
 * - Below 35 → Low priority
 */

function calculateScore(lead) {
  if (!lead) lead = {};

  let breakdown = {
    videosFullyWatched: 0,       // Max 18
    videosPartiallyWatched: 0,   // Max 5
    progressiveDataLevel: 0,     // Max 8
    monthlyBudget: 0,            // Max 15
    localVsOnline: 0,            // Max 12
    contactDepth: 0,             // Max 10
    quizCompleted: 0,            // Max 5
    fleetSize: 0,                // Max 4
    reviewTimeline: 0,           // Max 8
    marketingGoals: 0,           // Max 8
    auditInterest: 0,            // Max 5
    consultationAndComments: 0   // Max 2
  };

  // Determine current step progress
  let stepNum = 0;
  const status = lead.status || '';
  if (status === 'Completed' || lead.sessionClaimed || lead.step === 7 || lead.step === 8) {
    stepNum = 7;
  } else if (typeof lead.step === 'number') {
    stepNum = lead.step;
  } else if (typeof status === 'string' && status.startsWith('Video ')) {
    const match = status.match(/Video (\d+)/);
    if (match) stepNum = parseInt(match[1], 10);
  } else if (status === 'Started' || lead.name || lead.email) {
    stepNum = 1;
  }

  // 1. Videos Fully Watched (Max 18)
  // 7 videos = 18; 5–6 = 13; 3–4 = 8; 1–2 = 4
  const fullViews = typeof lead.videos_watched_full === 'number' ? lead.videos_watched_full : stepNum;
  if (fullViews >= 7) {
    breakdown.videosFullyWatched = 18;
  } else if (fullViews >= 5) {
    breakdown.videosFullyWatched = 13;
  } else if (fullViews >= 3) {
    breakdown.videosFullyWatched = 8;
  } else if (fullViews >= 1) {
    breakdown.videosFullyWatched = 4;
  } else {
    breakdown.videosFullyWatched = 0;
  }

  // 2. Videos Partially Watched (Max 5)
  // Each partial view (>30%) = 1 pt (max 5)
  const partialViews = typeof lead.videos_partial === 'number' ? lead.videos_partial : (lead.partialViews || 0);
  breakdown.videosPartiallyWatched = Math.min(5, Math.max(0, partialViews));

  // 3. Progressive Data Provided (Max 8)
  // Basic form = 2, + Business details = 3 (cumulative 5), + Role/Employees/Fleet = 3 (cumulative 8)
  if (lead.progressive_data_level) {
    if (lead.progressive_data_level >= 3) breakdown.progressiveDataLevel = 8;
    else if (lead.progressive_data_level === 2) breakdown.progressiveDataLevel = 5;
    else if (lead.progressive_data_level === 1) breakdown.progressiveDataLevel = 2;
  } else {
    // Calculated based on completed fields & step progression
    if (stepNum >= 4 || (lead.fleetSize && lead.role && lead.company)) {
      breakdown.progressiveDataLevel = 8;
    } else if (stepNum >= 2 || lead.company || lead.industry) {
      breakdown.progressiveDataLevel = 5;
    } else if (lead.name && lead.email) {
      breakdown.progressiveDataLevel = 2;
    }
  }

  // 4. Monthly Marketing Budget (Max 15)
  // $10,000+ = 15; $5,000–$10,000 = 12; $2,000–$5,000 = 8; $500–$2,000 = 4; <$500 = 1; Prefer Not to Say = 2
  const budget = (lead.budget || lead.monthly_budget || '').toString().trim();
  if (budget === '$10,000+' || budget.includes('$10,000') || budget.includes('10k') || budget === '$10,000+ / month') {
    breakdown.monthlyBudget = 15;
  } else if (budget.includes('$5,000') || budget.includes('5k') || budget === '$5,000-$10,000' || budget === '$5,000 – $10,000' || budget === '$5,000 - $10,000 / month') {
    breakdown.monthlyBudget = 12;
  } else if (budget.includes('$2,000') || budget.includes('2k') || budget === '$2,000-$5,000' || budget === '$2,000 – $5,000' || budget === '$2,000 - $5,000 / month') {
    breakdown.monthlyBudget = 8;
  } else if (budget.includes('$500') || budget === '$500-$2,000' || budget === '$500 – $2,000' || budget === '$500 - $2,000 / month') {
    breakdown.monthlyBudget = 4;
  } else if (budget.toLowerCase().includes('prefer') || budget.toLowerCase().includes('not to say')) {
    breakdown.monthlyBudget = 2;
  } else if (budget.toLowerCase().includes('under') || budget.includes('<$500') || (budget && budget !== '')) {
    breakdown.monthlyBudget = 1;
  }

  // 5. Local vs Online Customer Sources (Max 12)
  // 100% Local = 12; 80% Local = 10; 50% Local = 6; 20% Local = 3; 0% Local = 1
  const localVsOnline = (lead.localVsOnlinePct || lead.local_vs_online || '').toString().trim();
  if (localVsOnline.startsWith('100%') || localVsOnline === '100% Local / 0% Online' || localVsOnline === '100% Local') {
    breakdown.localVsOnline = 12;
  } else if (localVsOnline.startsWith('80%') || localVsOnline === '80% Local / 20% Online' || localVsOnline === '80% Local') {
    breakdown.localVsOnline = 10;
  } else if (localVsOnline.startsWith('50%') || localVsOnline === '50% Local / 50% Online' || localVsOnline === '50% Local') {
    breakdown.localVsOnline = 6;
  } else if (localVsOnline.startsWith('20%') || localVsOnline === '20% Local / 80% Online' || localVsOnline === '20% Local') {
    breakdown.localVsOnline = 3;
  } else if (localVsOnline.startsWith('0%') || localVsOnline === '0% Local / 100% Online' || localVsOnline === '0% Local') {
    breakdown.localVsOnline = 1;
  } else if (lead.allocTraditional && parseInt(lead.allocTraditional) >= 50) {
    breakdown.localVsOnline = 10;
  }

  // 6. Contact & Decision-Maker Depth (Max 10)
  // Full name + phone + callback (consultation time) = 10; Name + phone = 7; Email only = 3; None = 0
  const hasName = Boolean(lead.name || lead.client_name);
  const hasEmail = Boolean(lead.email || lead.client_email);
  const hasPhone = Boolean((lead.phone || lead.client_phone || '').trim().length >= 6);
  const hasCallback = Boolean(lead.consultTime || lead.consultation_time || lead.preferredCallback);

  if (hasName && hasPhone && hasCallback) {
    breakdown.contactDepth = 10;
  } else if (hasName && hasPhone) {
    breakdown.contactDepth = 7;
  } else if (hasEmail) {
    breakdown.contactDepth = 3;
  } else {
    breakdown.contactDepth = 0;
  }

  // 7. Quiz Questions Completed (Max 5)
  // 18–21 correct = 5; 12–17 = 4; 6–11 = 2; 1–5 = 1
  let totalCorrect = 0;
  if (typeof lead.quiz_correct === 'number') {
    totalCorrect = lead.quiz_correct;
  } else if (lead.quizAnswers) {
    const quizMap = typeof lead.quizAnswers.toJSON === 'function' ? lead.quizAnswers.toJSON() : lead.quizAnswers;
    if (typeof quizMap === 'object' && quizMap !== null) {
      for (const key of Object.keys(quizMap)) {
        const q = quizMap[key];
        if (q && typeof q.correct === 'number') {
          totalCorrect += q.correct;
        }
      }
    }
  } else if (stepNum >= 7) {
    totalCorrect = 19; // Default estimate for fully completed series
  }

  if (totalCorrect >= 18) {
    breakdown.quizCompleted = 5;
  } else if (totalCorrect >= 12) {
    breakdown.quizCompleted = 4;
  } else if (totalCorrect >= 6) {
    breakdown.quizCompleted = 2;
  } else if (totalCorrect >= 1) {
    breakdown.quizCompleted = 1;
  } else {
    breakdown.quizCompleted = 0;
  }

  // 8. Fleet Size (Max 4)
  // 11+ = 4; 4–10 = 3; 1–3 = 2; None/Unknown = 1
  const fleet = (lead.fleetSize || lead.fleet_size || '').toString();
  if (fleet.includes('25+') || fleet.includes('11-25') || fleet.includes('11+') || fleet.includes('50+')) {
    breakdown.fleetSize = 4;
  } else if (fleet.includes('4-10') || fleet.includes('4–10') || fleet.includes('6-20')) {
    breakdown.fleetSize = 3;
  } else if (fleet.includes('1-3') || fleet.includes('1–3') || fleet.includes('2-5')) {
    breakdown.fleetSize = 2;
  } else {
    breakdown.fleetSize = 1;
  }

  // 9. Marketing Review Timeline (Video 7) (Max 8)
  // Currently = 8; Within 3 Months = 6; Within 6 Months = 3; Within 12 Months = 1
  const timeline = (lead.reviewTimeline || lead.review_timeline || '').toString();
  if (timeline.includes('Currently') || timeline.includes('Immediate') || timeline.includes('Ready')) {
    breakdown.reviewTimeline = 8;
  } else if (timeline.includes('3 Months') || timeline.includes('3 months') || timeline.includes('30 days')) {
    breakdown.reviewTimeline = 6;
  } else if (timeline.includes('6 Months') || timeline.includes('Six Months') || timeline.includes('6 months')) {
    breakdown.reviewTimeline = 3;
  } else if (timeline.includes('12 Months') || timeline.includes('12 months') || timeline.includes('1 year')) {
    breakdown.reviewTimeline = 1;
  } else if (stepNum >= 7) {
    breakdown.reviewTimeline = 6; // Realistic default on step 7
  }

  // 10. Key Marketing Goals (Video 7 – select all that apply) (Max 8)
  // “Generate more local leads” = 3, “Improve brand visibility” = 2, “Reduce ad waste” = 2, “Increase trust” = 1, “Other” = 0
  const rawGoals = lead.marketing_goals || lead.goals || [];
  const goals = Array.isArray(rawGoals) ? rawGoals : [rawGoals.toString()];
  let goalPoints = 0;
  
  if (goals.some(g => g.includes('Generate more local leads') || g.includes('local leads'))) {
    goalPoints += 3;
  }
  if (goals.some(g => g.includes('Improve brand visibility') || g.includes('brand visibility'))) {
    goalPoints += 2;
  }
  if (goals.some(g => g.includes('Reduce ad waste') || g.includes('ad waste'))) {
    goalPoints += 2;
  }
  if (goals.some(g => g.includes('Increase trust') || g.includes('trust'))) {
    goalPoints += 1;
  }
  if (goalPoints === 0 && stepNum >= 7) {
    goalPoints = 5; // Default for completed funnel leads
  }
  breakdown.marketingGoals = Math.min(8, goalPoints);

  // 11. Interest in Free Marketing Efficiency Audit (Max 5)
  // As Soon as Possible = 5; Within 3 Months = 3; Within 6 Months = 1; Within 12 Months / No Thank You = 0
  const audit = (lead.auditRequest || lead.audit_interest || '').toString();
  if (audit.includes('As Soon as Possible') || audit.includes('As soon as possible') || lead.sessionClaimed || status === 'Completed') {
    breakdown.auditInterest = 5;
  } else if (audit.includes('3 Months') || audit.includes('3 months')) {
    breakdown.auditInterest = 3;
  } else if (audit.includes('6 Months') || audit.includes('Six Months') || audit.includes('6 months')) {
    breakdown.auditInterest = 1;
  } else if (audit.includes('12 Months') || audit.includes('No Thank You') || audit.includes('No thank you')) {
    breakdown.auditInterest = 0;
  }

  // 12. Best Time for Consultation + Comments (Max 2)
  // Provided preferred time = 1; Left additional comments = 1
  let consultComments = 0;
  const consultTime = (lead.consultTime || lead.consultation_time || '').toString().trim();
  if (consultTime && consultTime !== 'Select Time (Optional)' && consultTime !== '') {
    consultComments += 1;
  }
  const comments = (lead.customGoals || lead.comments || lead.has_comments || '').toString().trim();
  if (lead.has_comments === true || (comments && comments !== '')) {
    consultComments += 1;
  }
  breakdown.consultationAndComments = Math.min(2, consultComments);

  // Sum total score (0–100)
  const totalScore = Math.min(
    100,
    breakdown.videosFullyWatched +
    breakdown.videosPartiallyWatched +
    breakdown.progressiveDataLevel +
    breakdown.monthlyBudget +
    breakdown.localVsOnline +
    breakdown.contactDepth +
    breakdown.quizCompleted +
    breakdown.fleetSize +
    breakdown.reviewTimeline +
    breakdown.marketingGoals +
    breakdown.auditInterest +
    breakdown.consultationAndComments
  );

  // Priority Bands
  // 85–100 → Hot (call within 24 hours)
  // 70–84  → Warm High (priority follow-up)
  // 55–69  → Warm (personalised nurture)
  // 35–54  → Cool (standard automation)
  // Below 35 → Low priority
  let stage = 'Low';
  let priorityLabel = 'Low Priority';
  let recommendedAction = 'Low priority / long-term archive';

  if (totalScore >= 85) {
    stage = 'Hot';
    priorityLabel = 'Hot Lead (85–100)';
    recommendedAction = 'Call within 24 hours (Top priority conversion)';
  } else if (totalScore >= 70) {
    stage = 'Warm High';
    priorityLabel = 'Warm High (70–84)';
    recommendedAction = 'Priority follow-up within 48 hours';
  } else if (totalScore >= 55) {
    stage = 'Warm';
    priorityLabel = 'Warm (55–69)';
    recommendedAction = 'Personalised email sequence and nurture outreach';
  } else if (totalScore >= 35) {
    stage = 'Cool';
    priorityLabel = 'Cool (35–54)';
    recommendedAction = 'Standard automated educational drip campaign';
  } else {
    stage = 'Low';
    priorityLabel = 'Low (<35)';
    recommendedAction = 'Passive remarketing / retargeting';
  }

  return {
    score: totalScore,
    stage,
    priorityLabel,
    recommendedAction,
    breakdown
  };
}

module.exports = {
  calculateScore
};
