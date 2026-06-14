import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { fetchBillsByMember } from '../lib/api';
import { DUMMY_MEMBERS } from '../lib/dummyMembers';
import type { Bill } from '../types';

export function MemberProfile() {
  const { memberName } = useParams<{ memberName: string }>();
  const navigate = useNavigate();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const decoded = memberName ? decodeURIComponent(memberName) : '';
  const member = DUMMY_MEMBERS.find((m) => m.name === decoded);

  useEffect(() => {
    if (!decoded) return;
    fetchBillsByMember(decoded)
      .then((res) => setBills(res.bills))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [decoded]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          戻る
        </Button>
        <h2 className="text-xl font-bold text-gray-900">{decoded}</h2>
      </div>

      {member && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">プロフィール</CardTitle>
              <Badge variant="info" className="shrink-0">{member.ward}</Badge>
            </div>
            <CardDescription>{member.profile}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {member && member.activities.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">活動実績</h3>
          <div className="space-y-3">
            {member.activities.map((activity) => (
              <Card key={`${activity.date}-${activity.title}`}>
                <CardHeader>
                  <CardTitle className="text-base">{activity.title}</CardTitle>
                  <CardDescription>{activity.description}</CardDescription>
                  <span className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {activity.date}
                  </span>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-900">関連する議案</h3>

      {loading && (
        <div className="py-12 text-center text-gray-500">読み込み中...</div>
      )}

      {error && (
        <div className="py-12 text-center text-red-500">エラー: {error}</div>
      )}

      {!loading && !error && bills.length === 0 && (
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
    </div>
  );
}
