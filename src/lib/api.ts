import type { ApiTopicsResponse, ApiMinutesResponse, ApiMembersResponse, Member, Bill } from '../types';

const BASE = 'https://asia-northeast1-civictec-saitama.cloudfunctions.net';
const MEMBERS_API_BASE = 'https://council-analyzer-api-6imaok55eq-an.a.run.app';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeBill(b: any): Bill {
  return {
    bill_id: b.bill_id ?? '',
    bill_title: b.bill_title ?? '',
    discussion: b.discussion ?? [],
    has_vote: b.has_vote ?? false,
    meeting_date: b.meeting_date ?? '',
    speakers: b.speakers ?? [],
    summary: b.summary ?? '',
    topics: b.topics ?? [],
    proposal_reason: b.proposal_reason ?? '',
    source_file: b.source_file,
    proponents_members: b.proponents_members ?? [],
    opponents_members: b.opponents_members ?? [],
    proponents_parties: b.proponents_parties ?? [],
    opponents_parties: b.opponents_parties ?? [],
  };
}

export async function fetchTopics(): Promise<ApiTopicsResponse> {
  const res = await fetch(`${BASE}/get-topics-api`);
  if (!res.ok) throw new Error(`Failed to fetch topics: ${res.status}`);
  return res.json();
}

export async function fetchBillsByTopic(topic: string): Promise<ApiMinutesResponse> {
  const res = await fetch(`${BASE}/get-minutes-api?topic=${encodeURIComponent(topic)}`);
  if (!res.ok) throw new Error(`Failed to fetch bills: ${res.status}`);
  const data = await res.json();
  return { bills: (data.bills ?? []).map(normalizeBill) };
}

export async function fetchBillsByMember(member: string): Promise<ApiMinutesResponse> {
  const res = await fetch(`${BASE}/get-minutes-api?member=${encodeURIComponent(member)}`);
  if (!res.ok) throw new Error(`Failed to fetch bills: ${res.status}`);
  const data = await res.json();
  return { bills: (data.bills ?? []).map(normalizeBill) };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeMember(m: any): Member {
  return {
    number: m.number ?? '',
    name: m.name ?? '',
    constituency: m.constituency ?? '',
    contact_address: m.contact_address ?? '',
    phone_number: m.phone_number ?? '',
    faction: m.faction ?? '',
    terms_served: m.terms_served ?? '',
    website: m.website ?? '',
    x_twitter: m.x_twitter ?? '',
    instagram: m.instagram ?? '',
    facebook: m.facebook ?? '',
    youtube: m.youtube ?? '',
    tiktok: m.tiktok ?? '',
    birth_year: m.birth_year ?? '',
    age_group: m.age_group ?? '',
    activity_topics: m.activity_topics ?? '',
    topic_sources: m.topic_sources ?? '',
    notes: m.notes ?? '',
    intention_to_run_2027: m.intention_to_run_2027 ?? '',
  };
}

export async function fetchMembers(): Promise<ApiMembersResponse> {
  const res = await fetch(`${MEMBERS_API_BASE}/v1/members`);
  if (!res.ok) throw new Error(`Failed to fetch members: ${res.status}`);
  const data = await res.json();
  return {
    status: data.status ?? '',
    count: data.count ?? 0,
    members: (data.members ?? []).map(normalizeMember),
  };
}
