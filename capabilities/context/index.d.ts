export type ContextProfile = 'repo-engineering' | 'product-build' | 'runtime-repair' | 'independent-qa' | 'native-domain';
export type ContextResolution = 'POINTER_ONLY' | 'EXACT_JIT';
export type ContextVolatility = 'STABLE' | 'SESSION' | 'LIVE';

export class ContextCapsuleError extends Error {
  code: string;
}

export const PROFILES: Readonly<Record<string, Record<string, unknown>>>;
export function canonical(value: unknown): string;
export function compile(request: Record<string, unknown>, options?: Record<string, unknown>): {
  capsule: Record<string, unknown>;
  canonical: string;
  sha256: string;
};

export function planRetrieval(input: Record<string, unknown>): Record<string, unknown>;
export function resolveExactArtifact(input: Record<string, unknown>): Record<string, unknown>;
export function convergeLifecycleProjection(input: Record<string, unknown>): Record<string, unknown>;
export function sha256(value: string | Uint8Array): string;

export function buildContinuityCarrier(input: Record<string, unknown>): Record<string, unknown>;
export function buildSuccessorCheckpoint(input: Record<string, unknown>): Record<string, unknown>;

export interface SourceDescriptor {
  id: string;
  ref: string;
  roles: string[];
  name?: string;
  tags?: string[];
  required?: boolean;
  priority?: number;
  available?: boolean;
  hash?: string;
  sizeBytes?: number;
  maxBytes?: number;
  authorityClass?: string;
  truthClass?: string;
  freshness?: string;
  volatility?: ContextVolatility;
  resolution?: ContextResolution;
}

export interface ContextPlanInput {
  profile?: ContextProfile;
  strategy?: {
    id: string;
    version: string;
    requiredRoles?: string[];
    exactRoles?: string[];
    optionalRoles?: string[];
    maxSelectedSources?: number;
  };
  task: { id?: string; objective: string; class?: string; projectRef?: string; checkpointRef?: string };
  query?: string;
  constraints?: string[];
  acceptedDecisions?: string[];
  acceptance?: string[];
  authority?: string;
  effectClass?: string;
  privacyClass?: string;
  scopes?: { read?: string[]; write?: string[]; effect?: string };
  outputContract?: string;
  truthState?: string;
  sourceStatus?: string;
  negations?: string[];
  contradictions?: string[];
  supersessionRefs?: string[];
  budget?: { maxSelectedSources?: number; maxMetadataBytes?: number; maxHydrationBytes?: number };
  sourceMap?: SourceDescriptor[];
}

export interface ContextPlan {
  readonly schema: 'context-compiler-plan/v1';
  readonly status: 'READY' | 'CONTEXT_MISS';
  readonly contextPlanId: string;
  readonly taskFingerprint: string;
  readonly strategy: Readonly<{ id: string; version: string; profile: string | null; contractDigest: string }>;
  readonly selectedSources: ReadonlyArray<Readonly<Record<string, unknown>>>;
  readonly omissions: ReadonlyArray<Readonly<Record<string, unknown>>>;
  readonly expansionRequests: ReadonlyArray<Readonly<Record<string, unknown>>>;
  readonly missing: ReadonlyArray<Readonly<Record<string, unknown>>>;
  readonly budgetDecision: Readonly<Record<string, number>>;
  readonly cachePlan: Readonly<Record<string, unknown>>;
  readonly protectedState: Readonly<Record<string, unknown>>;
  readonly invariants: ReadonlyArray<string>;
}

export function compileContextPlan(input: ContextPlanInput): ContextPlan;
export function assertPlanIntegrity(plan: ContextPlan): true;
export interface ContextOutcomeInput {
  resultId: string;
  disposition: 'ACCEPTED' | 'REJECTED' | 'NEEDS_REVISION' | 'UNKNOWN';
  accepted?: boolean;
  verificationRef?: string;
  acceptanceContractRef?: string;
  baselinePlanId?: string;
  provider?: string;
  model?: string;
  tokenizer?: string;
  falseSuccess?: boolean;
  correctionCount?: number;
  restatementCount?: number;
  contextMissCount?: number;
  toolCallCount?: number;
  latencyMs?: number;
  inputTokens?: number;
  outputTokens?: number;
  inputBytes?: number;
  outputBytes?: number;
  hydratedBytes?: number;
  costUsd?: number;
}

export function recordContextOutcome(input: { plan: ContextPlan; result: ContextOutcomeInput }): Record<string, unknown>;

export interface ContextProfileContract {
  readonly id: string;
  readonly version: string;
  readonly requiredRoles: ReadonlyArray<string>;
  readonly exactRoles: ReadonlyArray<string>;
  readonly optionalRoles: ReadonlyArray<string>;
  readonly maxSelectedSources: number;
}
export const PROFILE_CONTRACTS: Readonly<Record<string, Readonly<ContextProfileContract>>>;
export const RESOLUTION: Readonly<{ POINTER_ONLY: 'POINTER_ONLY'; EXACT_JIT: 'EXACT_JIT' }>;
export const VOLATILITY: Readonly<{ STABLE: 'STABLE'; SESSION: 'SESSION'; LIVE: 'LIVE' }>;
