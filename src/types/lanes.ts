export interface LaneListType {
  id: number;
  dq: string;
  play_num: number;
  player: string;
  record: number;
  swimming_name: string;
  team: string;
}

export interface LaneDetailType {
  id: number;
  lane: number;
  play_num: number;
  dq: string;
  team: string;
  player: string;
  swimming_name: string;
  record: string;
  prev: number | null;
  next: number | null;
}

export interface PlayerListType{
   dq: string;
  id: number;
  lane: number;
  player: string;
  rank: string;
  record: number;
  score_id: string;
  score_rank: number | null;
  score_value: number | null;
  swimming_id: number;
  swimming_name: string;
  team: string;
}