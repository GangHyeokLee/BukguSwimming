export interface LaneListType {
  id: number;
  dq: string;
  play_num: number;
  player: string;
  record: string;
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