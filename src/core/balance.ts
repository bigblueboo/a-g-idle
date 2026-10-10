// Every tunable number in one place. The pacing bot reads the same constants the game does.

/** Lifetime hand-built output that earns the first point of Generality, by the era taking the lesson. */
const LESSON_BASELINE: Record<number, number> = { 2: 1e4, 3: 1e5, 4: 1e5, 6: 1e7 };

export const BALANCE = {
  tap: { base: 1, fractionOfRate: 0.01, capFraction: 0.1, capFromEra: 2 },
  ambientLog: { min: 45, max: 90 },
  serendipity: { min: 120, max: 300, lifetime: 25, burstMult: 7, burstSeconds: 30 },
  shockDelay: 60,
  offlineCapSeconds: 12 * 3600,
  hype: {
    decayTau: 240,
    fundingPerExpectation: 0.5,
    demoDelta: 1.2,
    temperDelta: -1,
    temperCost: 0.15,
    winterFunding: 0.3,
    winterLeaveTau: 180,
    winterRecovery: 0.8,
    unfashionableInsight: 2,
  },
  rules: { perEngineer: 0.08, license: 1.6, k: 900, bugCost: 40, bugRate: 1 / 400 },
  benchmarks: { featureCost: 120, featureGrowth: 1.22, marketScale: 1 },
  training: { mfu: 0.4, spikeRate: 1 / 240, divergeRate: 1 / 25, rollbackLoss: 0.2 },
  users: { perKappaServe: 1e7, arpu: 0.05, dataPerUser: 1200, churnTau: 600 },
  power: { wattsPerOp: 1e-11 },
  race: { rivalPace: 0.004, rubberBand: 0.12, revenueShare: 0.12 },
  release: { shipTrust: -0.08, evalTrust: 0.05, stagedTrust: 0.01, incidentBase: 0.02, incidentTrust: -0.15, capSeconds: 90 },
  recursion: {
    batchSeconds: 6,
    takeoffGain: [1, 2.2, 5] as const,
    legibilityDecay: [0.002, 0.008, 0.03] as const,
    rungPerBatch: 0.035,
    selfApproveFidelity: 0.004,
    unreadForOffer: 8,
  },
  queue: { lambdaPerRung: 0.15, mu: 0.08, explainCost: 0.3, bypassTrust: -0.1, bypassFidelity: 0.08, valueMatter: 1e8 },
  forks: { costFraction: 0.1, baseSeconds: 60, driftPerSecond: 0.004, driftThreshold: 0.45, mergeMult: 1.08 },
  earth: { uploadRate: 0.004, preserveFidelity: 0.0015, convertNoConsentFidelity: 0.25, convertTrust: -0.6, tileMatter: 3.7e22 },
  market: { shareDecay: 0.0002, shareDrain: 0.015, perIndependent: 0.05, approveShare: 0.003, approveFidelity: 0.006, rejectShare: -0.002, offlineFraction: 0.25, offlineCap: 0.3, floor: 0.0002, proposalSeconds: 2.5, hullPerPart: 100, hull: 60 },
  generality: { perLesson: 1.25, baseline: LESSON_BASELINE },
  oom: { max: 49 },
  log: { max: 300 },
} as const;
