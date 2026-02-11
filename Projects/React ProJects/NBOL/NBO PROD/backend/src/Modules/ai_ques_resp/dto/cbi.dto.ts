export class SubmitAnswerDto {
  conversation: {
    role: 'assistant' | 'user';
    text: string;
    id: string;
  }[];
  competency_name: string;
  remaining_time: number;
  probe_count: number;
  expected_behaviors: string[];
  participant_id: string;
  questionnaire_id: string;
}

export class AiResponseDto {
  status: 'inprogress' | 'complete';
  probe: string | null;
  behavior_alignment: {
    alignment_score: number;
    aligned_behaviors: string[];
    missing_behaviors: string[];
    evidence_by_behavior: {
      'Uses data to inform decisions': string;
      'Implements scalable solutions': string;
    };
  };
  reasoning: string;
  competency_name: string;
}

export class AiScoreResponseDto {
  key: string;
  rating: 4;
  rationale: string;
  evidence: any;
  behavior_alignment: any;
  question_id: string;
}

export class AiReportResponseDto {
  overall: {
    score: number;
    scale: string;
  };
  strengths: CompetencyEvaluation[];
  development_areas: CompetencyEvaluation[];
  development_suggestions: {
    day30: string[];
    day60: string[];
    day90: string[];
  };
  overall_strength: string;
  overall_development: string;
}

export class CompetencyEvaluation {
  competency: string;
  rating: number;
  rationale: string;
  evidence: Evidence;
}

export class Evidence {
  situation?: string;
  task?: string;
  action?: string;
  result?: string;
  metrics?: string[];
  reflection?: string;
  risks_or_redflags?: string[];
  behavior_alignment?: BehaviorAlignment;
}

export class BehaviorAlignment {
  score: number;
  aligned_behaviors: string[];
  missing_behaviors: string[];
  evidence_by_behavior: Record<string, string>;
}
