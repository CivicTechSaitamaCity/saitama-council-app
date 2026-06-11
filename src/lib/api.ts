import type { ApiTopicsResponse, ApiMinutesResponse, Bill } from '../types';

const BASE = 'https://asia-northeast1-civictec-saitama.cloudfunctions.net';

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
