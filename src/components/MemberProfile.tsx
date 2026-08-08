import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Phone, ExternalLink, Vote } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { fetchBillsByMember, fetchMembers } from '../lib/api';
import { extractUrl, hasValue } from '../lib/memberUtils';
import type { Bill, Member } from '../types';

const SNS_FIELDS: { key: keyof Member; label: string }[] = [
  { key: 'website', label: '公式サイト' },
  { key: 'x_twitter', label: 'X (Twitter)' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'tiktok', label: 'TikTok' },
];

export function MemberProfile() {
  const { memberNumber } = useParams<{ memberNumber: string }>();
  const navigate = useNavigate();

  const [member, setMember] = useState<Member | null>(null);
  const [memberLoading, setMemberLoading] = useState(true);
  const [memberError, setMemberError] = useState<string | null>(null);

  const [bills, setBills] = useState<Bill[]>([]);
  const [billsLoading, setBillsLoading] = useState(false);
  const [billsError, setBillsError] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers()
      .then((res) => {
        const found = res.members.find((m) => m.number === memberNumber) ?? null;
        setMember(found);
      })
      .catch((e: Error) => setMemberError(e.message))
      .finally(() => setMemberLoading(false));
  }, [memberNumber]);

  useEffect(() => {
    if (!member) return;
    setBillsLoading(true);
    fetchBillsByMember(member.name)
      .then((res) => setBills(res.bills))
      .catch((e: Error) => setBillsError(e.message))
      .finally(() => setBillsLoading(false));
  }, [member]);

  const snsLinks = member
    ? SNS_FIELDS.map(({ key, label }) => {
        const raw = member[key];
        if (!hasValue(raw)) return null;
        const url = extractUrl(raw);
        return { label, raw, url };
      }).filter((v): v is { label: string; raw: string; url: string | null } => v !== null)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          戻る
        </Button>
        {member && <h2 className="text-xl font-bold text-gray-900">{member.name}</h2>}
      </div>

      {memberLoading && (
        <div className="py-12 text-center text-gray-500">読み込み中...</div>
      )}

      {memberError && (
        <div className="py-12 text-center text-red-500">エラー: {memberError}</div>
      )}

      {!memberLoading && !memberError && !member && (
        <div className="py-12 text-center text-gray-500">
          議員情報が見つかりませんでした
        </div>
      )}

      {member && (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="info">{member.constituency}</Badge>
                {member.faction && <Badge variant="default">{member.faction}</Badge>}
                {member.terms_served && (
                  <Badge variant="default">当選{member.terms_served}回</Badge>
                )}
                {hasValue(member.age_group) && (
                  <Badge variant="default">{member.age_group}</Badge>
                )}
              </div>

              {member.intention_to_run_2027 && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                  <Vote className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>2027年選挙: {member.intention_to_run_2027}</span>
                </div>
              )}

              <div className="mt-4 space-y-2 text-sm text-gray-700">
                {hasValue(member.contact_address) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <span>{member.contact_address}</span>
                  </div>
                )}
                {hasValue(member.phone_number) && (
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <span>{member.phone_number}</span>
                  </div>
                )}
              </div>

              {snsLinks.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {snsLinks.map(({ label, raw, url }) =>
                    url ? (
                      <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      >
                        {label}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span
                        key={label}
                        title={raw}
                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                      >
                        {label}
                      </span>
                    )
                  )}
                </div>
              )}
            </CardHeader>
          </Card>

          {hasValue(member.activity_topics) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">主な活動テーマ</CardTitle>
                <CardDescription>{member.activity_topics}</CardDescription>
                {hasValue(member.topic_sources) && (
                  <p className="mt-2 text-xs text-gray-400">出典: {member.topic_sources}</p>
                )}
              </CardHeader>
            </Card>
          )}

          {hasValue(member.notes) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">備考</CardTitle>
                <CardDescription>{member.notes}</CardDescription>
              </CardHeader>
            </Card>
          )}
        </>
      )}

      {member && (
        <>
          <h3 className="text-lg font-semibold text-gray-900">関連する議案</h3>

          {billsLoading && (
            <div className="py-12 text-center text-gray-500">読み込み中...</div>
          )}

          {billsError && (
            <div className="py-12 text-center text-red-500">エラー: {billsError}</div>
          )}

          {!billsLoading && !billsError && bills.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              関連する議案が見つかりませんでした
            </div>
          )}

          <div className="space-y-3">
            {bills.map((bill) => {
              const topicParam =
                bill.topics.length > 0
                  ? encodeURIComponent(bill.topics[0])
                  : encodeURIComponent('');
              return (
                <Card
                  key={bill.bill_id}
                  onClick={() =>
                    navigate(
                      `/topic/${topicParam}/bill/${encodeURIComponent(bill.bill_id)}`
                    )
                  }
                  className="cursor-pointer transition-all hover:border-blue-500"
                >
                  <CardHeader>
                    <CardTitle className="text-base">{bill.bill_title}</CardTitle>
                    <CardDescription className="line-clamp-2">{bill.summary}</CardDescription>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {bill.meeting_date}
                      </span>
                      {bill.topics.slice(0, 3).map((t) => (
                        <Badge key={t} variant="default" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
