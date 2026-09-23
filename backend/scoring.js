/**
 * 100-Point Algorithmic Lead Scoring Engine for Rule7Media
 * 
 * Scores prospective leads across 12 behavioral, qualification, 
 * and intent signals into 5 priority tiers:
 * 1. 🔥 Hot Priority (85-100 pts)
 * 2. ⚡ Warm High (70-84 pts)
 * 3. 🌿 Warm (55-69 pts)
 * 4. ❄️ Cool (35-54 pts)
 * 5. ⚪ Low (<35 pts)
 */

function calculateScore(lead) {
  let scoreBreakdown = {
    videoCompletion: 0,
    budget: 0,
    fleetSize: 0,
    quizAnswers: 0,
    intentSignals: 0
  };

  // 1. Video Funnel Progress (up to 35 pts)
  let stepNum = 0;
  const status = lead.status || 'Started';
  if (status === 'Completed') stepNum = 7;
  else if (status.startsWith('Video ')) {
    const match = status.match(/Video (\d+)/);
    if (match) {
      stepNum = parseInt(match[1]);
    }
  } else if (status === 'Started') {
    stepNum = 1;
  }
  scoreBreakdown.videoCompletion = Math.min(35, Math.round((stepNum / 7) * 35));

  // 2. Budget Allocation Range (up to 20 pts)
  const budget = lead.budget || '';
  if (budget === '$10,000+' || budget.includes('$10,000') || budget.includes('10k')) {
    scoreBreakdown.budget = 20;
  } else if (budget === '$5,000-$10,000' || budget.includes('$5,000') || budget.includes('5k')) {
    scoreBreakdown.budget = 16;
  } else if (budget === '$2,000-$5,000' || budget.includes('$2,000') || budget.includes('2k')) {
    scoreBreakdown.budget = 12;
  } else if (budget === '$500-$2,000' || budget.includes('$500')) {
    scoreBreakdown.budget = 6;
  } else if (budget) {
    scoreBreakdown.budget = 2;
  }

  // 3. Fleet Size & Operational Assets (up to 15 pts)
  const fleet = lead.fleetSize || '';
  if (fleet === '25+ Vehicles' || fleet === '25+' || fleet === '50+') {
    scoreBreakdown.fleetSize = 15;
  } else if (fleet === '11-25 Vehicles' || fleet === '11-25' || fleet === '21-50') {
    scoreBreakdown.fleetSize = 12;
  } else if (fleet === '4-10 Vehicles' || fleet === '4-10' || fleet === '6-20') {
    scoreBreakdown.fleetSize = 8;
  } else if (fleet === '1-3 Vehicles' || fleet === '1-3' || fleet === '2-5') {
    scoreBreakdown.fleetSize = 4;
  }

  // 4. Verified Quiz Answers & Comprehension (up to 15 pts)
  let totalCorrect = 0;
  let totalQuestions = 0;
  
  if (lead.quizAnswers) {
    const quizMap = typeof lead.quizAnswers.toJSON === 'function' ? lead.quizAnswers.toJSON() : lead.quizAnswers;
    if (typeof quizMap === 'object' && quizMap !== null) {
      for (const key of Object.keys(quizMap)) {
        const q = quizMap[key];
        if (q && typeof q.correct === 'number' && typeof q.total === 'number') {
          totalCorrect += q.correct;
          totalQuestions += q.total;
        }
      }
    }
  }

  if (totalQuestions > 0) {
    scoreBreakdown.quizAnswers = Math.min(15, Math.round((totalCorrect / totalQuestions) * 15));
  } else if (stepNum >= 4) {
    scoreBreakdown.quizAnswers = 8; // Partial estimate for progressed leads
  }

  // 5. Intent Signals & High-Value Telemetry (up to 15 pts)
  let intentScore = 0;
  
  // A. Claimed Audit / Strategy Session (+5 pts)
  if (lead.sessionClaimed || lead.auditRequest === 'Yes' || lead.auditRequest === 'Requested' || status === 'Completed') {
    intentScore += 5;
  }
  
  // B. Immediate or Near-Term Marketing Review Timeline (+3 pts)
  const timeline = lead.reviewTimeline || '';
  if (timeline.includes('Immediate') || timeline.includes('30 days') || timeline.includes('1-3 months') || timeline.includes('Ready')) {
    intentScore += 3;
  }

  // C. Phone / Direct Decision-Maker Contact Provided (+3 pts)
  if (lead.phone && lead.phone.trim().length >= 6) {
    intentScore += 3;
  }

  // D. Partner Referral / Protected Territory Attribution (+4 pts)
  if (lead.refId || lead.assignedAffiliateId || lead.assigned_affiliate_id || lead.sourcePartner) {
    intentScore += 4;
  }

  scoreBreakdown.intentSignals = Math.min(15, intentScore);

  // Total Aggregate Score (0-100 pts)
  const score = Math.min(
    100,
    scoreBreakdown.videoCompletion +
    scoreBreakdown.budget +
    scoreBreakdown.fleetSize +
    scoreBreakdown.quizAnswers +
    scoreBreakdown.intentSignals
  );

  // Determine 5-Tier Stage
  let stage = 'Low';
  if (score >= 85) {
    stage = 'Hot';
  } else if (score >= 70) {
    stage = 'Warm High';
  } else if (score >= 55) {
    stage = 'Warm';
  } else if (score >= 35) {
    stage = 'Cool';
  } else {
    stage = 'Low';
  }

  return {
    score,
    stage,
    breakdown: scoreBreakdown
  };
}

module.exports = {
  calculateScore
};
