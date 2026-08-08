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

export interface Member {
  number: string;
  name: string;
  constituency: string;
  contact_address: string;
  phone_number: string;
  faction: string;
  terms_served: string;
  website: string;
  x_twitter: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  birth_year: string;
  age_group: string;
  activity_topics: string;
  topic_sources: string;
  notes: string;
  intention_to_run_2027: string;
}

export interface ApiMembersResponse {
  status: string;
  count: number;
  members: Member[];
}
