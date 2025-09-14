export type RubricId = 1|2|3|4|5|6;
export type Evidence = { rubric: RubricId; text: string; start: number; end: number; confidence: number };
export type RubricScore = { rubric: RubricId; score: 0|1|2|3|4; evidences: Evidence[] };
export type Analysis = {
  charCount: number;
  sentences: string[];
  kanjiRatio: number;
  repetitionRate: number;
  style: { politenessMixed: boolean; longSentenceIndices: number[] };
  structure: { pastChars: number; presentChars: number; futureChars: number };
  rubric: RubricScore[];
  inconsistencies: string[];
  namedEntities: string[];
};

