
export type VictorBetStatus = {
  success: boolean;
  errorCode: number,
  extraInfo: Record<string, any>;
};

export type VictorBetResult = {
  transitions_pgate_path: string;
  total_number_of_events: number;
  sports: Sport[];
};

export type VictorBetResponse = {
  status: VictorBetStatus;
  result: VictorBetResult;
};

export type MartketType = {
  mtId: number;
  pos: number;
  desc: string;
  mtDesc: string;
  coupon_name: string;
  headers: string[];
  periods: any[];
  pId: number;
  pDesc: string;
  sport_id: number;
};

export type GameEvent = {
  id: number;
  event_type: string;
  event_path_id: number;
  sport_id: number;
  desc: string;
  oppADesc: string;
  oppAId: number;
  oppBDesc: string;
  oppBId: number;
  american: any;
  inPlay: boolean;
  time: any;
  pos: number;
  markets: any[];
  eventPathTree: any;
  metadata: any;
  has_stream: boolean;
  scoreboard: any;
};

export type Comp = {
  id: number;
  desc: string;
  pos: number;
  events: GameEvent[];
};

export type Sport = {
  id: number;
  epId: number;
  desc: string;
  pos: number;
  ne: number;
  eic: number;
  v: boolean;
  mc: boolean;
  ncmc: number;
  nemc: number;
  hasInplayEvents: boolean;
  hasUpcomingEvents: boolean;
  marketTypes: MartketType[];
  comp: Comp[];
};
