export interface ApiTopicsResponse {
  grouped: Record<string, string[]>;
  topics: string[];
}

export interface Bill {
  bill_id: string;
  bill_title: string;
  discussion: string[];
  has_vote: boolean;
  meeting_date: string;
  speakers: string[];
  summary: string;
  topics: string[];
  proposal_reason: string;
  source_file?: string;
  proponents_members?: string[];
  opponents_members?: string[];
  proponents_parties?: string[];
  opponents_parties?: string[];
}

export interface ApiMinutesResponse {
  bills: Bill[];
}
