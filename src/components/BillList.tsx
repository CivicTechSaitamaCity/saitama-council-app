import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, CheckSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { fetchBillsByTopic } from '../lib/api';
import type { Bill } from '../types';

export function BillList() {
  const { topicName } = useParams<{ topicName: string }>();
  const navigate = useNavigate();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const decoded = topicName ? decodeURIComponent(topicName) : '';

  useEffect(() => {
    if (!decoded) return;
    fetchBillsByTopic(decoded)
      .then((res) => setBills(res.bills))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [decoded]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          戻る
        </Button>
        <h2 className="text-lg font-semibold text-gray-900">{decoded}</h2>
      </div>

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
        {bills.map((bill) => (
          <Card
            key={bill.bill_id}
            onClick={() =>
              navigate(`/topic/${topicName}/bill/${encodeURIComponent(bill.bill_id)}`)
            }
            className="cursor-pointer transition-all hover:border-blue-500"
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{bill.bill_title}</CardTitle>
                {bill.has_vote && (
                  <Badge variant="default" className="shrink-0 bg-green-600">
                    <CheckSquare className="mr-1 h-3 w-3" />
                    採決済
                  </Badge>
                )}
              </div>
              <CardDescription className="line-clamp-2">{bill.summary}</CardDescription>
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {bill.meeting_date}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  発言者 {bill.speakers.length}名
                </span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
