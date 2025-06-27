export type CertificateResponse = {
  cert_data: {
    cert_data: string;
    cert_name: string;
    cert_num: string;
    president: string;
    stamp_img: string;
  };
  code: number;
  swimming_data: {
    depart: string;
    dq: string;
    gender: string;
    group: string;
    id: number;
    lane: number;
    play_num: number;
    player: string;
    rank: string;
    record: number;
    score_id: string;
    score_rank: number;
    score_value: number;
    swim_type: string;
    team: string;
  };
};