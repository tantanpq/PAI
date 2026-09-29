export type ContextProfile = 'repo-engineering' | 'product-build' | 'runtime-repair' | 'independent-qa' | 'native-domain';
export type ContextResolution = 'POINTER_ONLY' | 'EXACT_JIT';

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
  budget?: { maxSelectedSources?: number; maxMetadataBytes?: number; maxHydrationBytes?: number };
  sourceMap?: SourceDescriptor[];
}

export interface ContextPlan {
  schema: 'context-compiler-plan/v1';
  status: 'READY' | 'CONTEXT_MISS';
  contextPlanId: string;
  taskFingerprint: string;
  strategy: { id: string; version: string; profile: string | null };
  selectedSources: Array<Record<string, unknown>>;
  omissions: Array<Record<string, unknown>>;
  expansionRequests: Array<Record<string, unknown>>;
  missing: Array<Record<string, unknown>>;
  budgetDecision: Record<string, number>;
  protectedState: Record<string, unknown>;
  invariants: string[];
}

export function compileContextPlan(input: ContextPlanInput): ContextPlan;
export function recordContextOutcome(input: { plan: ContextPlan; result: Record<string, unknown> }): Record<string, unknown>;

export const PROFILE_CONTRACTS: Readonly<Record<string, Record<string, unknown>>>;
export const RESOLUTION: Readonly<{ POINTER_ONLY: 'POINTER_ONLY'; EXACT_JIT: 'EXACT_JIT' }>;

export * from './index';
