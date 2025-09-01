export type TeamScoreStatus = "success" | "error" | string;

export interface TeamScoreItem {
  team: string;
  total_score: string; // API에서 문자열로 제공됨
}

export interface TeamScoresResponse {
  count: number;
  data: TeamScoreItem[];
  status: TeamScoreStatus;
}
