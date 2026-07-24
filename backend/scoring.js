/**
 * Lead Scoring Engine for Rule7Media
 */

function calculateScore(lead) {
  let scoreBreakdown = {
    videoCompletion: 0,
    budget: 0,
    fleetSize: 0,
    quizAnswers: 0,
    affiliateSource: 0
  };

  // 1. Video Completion (+40% max)
  // Determine video step based on status or step number
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
  scoreBreakdown.videoCompletion = Math.round((stepNum / 7) * 40);

  // 2. Budget Range (+20% max)
  const budget = lead.budget || '';
  if (budget === '$10,000+' || budget.includes('$10,000')) {
    scoreBreakdown.budget = 20;
  } else if (budget === '$5,000-$10,000' || budget.includes('$5,000')) {
    scoreBreakdown.budget = 15;
  } else if (budget === '$2,000-$5,000' || budget.includes('$2,000')) {
    scoreBreakdown.budget = 10;
  } else if (budget === '$500-$2,000' || budget.includes('$500')) {
    scoreBreakdown.budget = 5;
  } else {
    scoreBreakdown.budget = 0;
  }

  // 3. Fleet Size (+15% max)
  const fleet = lead.fleetSize || '';
  if (fleet === '25+ Vehicles' || fleet === '25+' || fleet === '50+') {
    scoreBreakdown.fleetSize = 15;
  } else if (fleet === '11-25 Vehicles' || fleet === '11-25' || fleet === '21-50') {
    scoreBreakdown.fleetSize = 12;
  } else if (fleet === '4-10 Vehicles' || fleet === '4-10' || fleet === '6-20') {
    scoreBreakdown.fleetSize = 8;
  } else if (fleet === '1-3 Vehicles' || fleet === '1-3' || fleet === '2-5') {
    scoreBreakdown.fleetSize = 4;
  } else {
    scoreBreakdown.fleetSize = 0;
  }

  // 4. Verified Answers (+15% max)
  // quizAnswers looks like: { "1": { correct: 2, total: 3 }, "2": { correct: 1, total: 2 } }
  let totalCorrect = 0;
  let totalQuestions = 0;
  
  if (lead.quizAnswers) {
    const quizMap = typeof lead.quizAnswers.toJSON === 'function' ? lead.quizAnswers.toJSON() : lead.quizAnswers;
    for (const key of Object.keys(quizMap)) {
      const q = quizMap[key];
      if (q && typeof q.correct === 'number' && typeof q.total === 'number') {
        totalCorrect += q.correct;
        totalQuestions += q.total;
      }
    }
  }

  if (totalQuestions > 0) {
    scoreBreakdown.quizAnswers = Math.round((totalCorrect / totalQuestions) * 15);
  } else {
    // If no quizzes completed yet, check if there are answers stored as fields
    scoreBreakdown.quizAnswers = 0;
  }

  // 5. Affiliate Source (+10% max)
  if (lead.refId || lead.sourcePartner) {
    scoreBreakdown.affiliateSource = 10;
  }

  // Calculate total score
  const score = Math.min(
    100,
    scoreBreakdown.videoCompletion +
    scoreBreakdown.budget +
    scoreBreakdown.fleetSize +
    scoreBreakdown.quizAnswers +
    scoreBreakdown.affiliateSource
  );

  // Determine stage label
  let stage = 'Cold';
  if (score >= 71) stage = 'Hot';
  else if (score >= 41) stage = 'Warm';

  return {
    score,
    stage,
    breakdown: scoreBreakdown
  };
}

module.exports = {
  calculateScore
};
