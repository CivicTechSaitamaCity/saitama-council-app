import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { fetchBillsByTopic } from '../lib/api';
import type { Bill } from '../types';

export function BillDetail() {
  const { topicName, billId } = useParams<{ topicName: string; billId: string }>();
  const navigate = useNavigate();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllDiscussion, setShowAllDiscussion] = useState(false);

  const decodedTopic = topicName ? decodeURIComponent(topicName) : '';
  const decodedBillId = billId ? decodeURIComponent(billId) : '';

  useEffect(() => {
    if (!decodedTopic) return;
    fetchBillsByTopic(decodedTopic)
      .then((res) => {
        const found = res.bills.find((b) => b.bill_id === decodedBillId);
        setBill(found ?? null);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [decodedTopic, decodedBillId]);

  if (loading) {
    return <div className="py-12 text-center text-gray-500">読み込み中...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-500">エラー: {error}</div>;
  }

  if (!bill) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/topic/${topicName}`)}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          戻る
        </Button>
        <div className="py-12 text-center text-gray-500">議案が見つかりませんでした</div>
      </div>
    );
  }

  const visibleDiscussion = showAllDiscussion
    ? bill.discussion
    : bill.discussion.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/topic/${topicName}`)}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          戻る
        </Button>
      </div>

      {/* 概要 */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">{bill.bill_title}</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {bill.meeting_date}
          </span>
          {bill.has_vote && (
            <Badge variant="default" className="bg-green-600">採決済</Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {bill.topics.map((t) => (
            <Badge key={t} variant="default">{t}</Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* 提案理由 */}
      {bill.proposal_reason && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">提案理由</h3>
          <p className="text-sm leading-relaxed text-gray-700">{bill.proposal_reason}</p>
        </div>
      )}

      {/* 概要説明 */}
      {bill.summary && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">概要</h3>
          <p className="text-sm leading-relaxed text-gray-700">{bill.summary}</p>
        </div>
      )}

      <Separator />

      {/* 発言者 */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">発言者</h3>
        <div className="flex flex-wrap gap-2">
          {bill.speakers.map((name) => (
            <button
              key={name}
              onClick={() => navigate(`/member/${encodeURIComponent(name)}`)}
              className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 hover:bg-blue-100"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* 審議内容 */}
      {bill.discussion.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">審議内容</h3>
          <div className="space-y-2">
            {visibleDiscussion.map((text, i) => (
              <blockquote
                key={i}
                className="border-l-4 border-gray-200 pl-4 text-sm text-gray-700"
              >
                {text}
              </blockquote>
            ))}
          </div>
          {bill.discussion.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllDiscussion((v) => !v)}
            >
              {showAllDiscussion ? (
                <>
                  <ChevronUp className="mr-1 h-4 w-4" />
                  折りたたむ
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-4 w-4" />
                  全て表示 ({bill.discussion.length}件)
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* 採決結果 */}
      {bill.has_vote && (
        <>
          <Separator />
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">採決結果</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* 賛成 */}
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="mb-2 flex items-center gap-2 font-medium text-green-700">
                  <ThumbsUp className="h-4 w-4" />
                  賛成
                </div>
                {bill.proponents_parties && bill.proponents_parties.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {bill.proponents_parties.map((p) => (
                      <Badge key={p} variant="success">
                        {p}
                      </Badge>
                    ))}
                  </div>
                )}
                {bill.proponents_members && bill.proponents_members.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {bill.proponents_members.map((name) => (
                      <button
                        key={name}
                        onClick={() => navigate(`/member/${encodeURIComponent(name)}`)}
                        className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 hover:bg-green-200"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 反対 */}
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="mb-2 flex items-center gap-2 font-medium text-red-700">
                  <ThumbsDown className="h-4 w-4" />
                  反対
                </div>
                {bill.opponents_parties && bill.opponents_parties.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {bill.opponents_parties.map((p) => (
                      <Badge key={p} variant="danger">
                        {p}
                      </Badge>
                    ))}
                  </div>
                )}
                {bill.opponents_members && bill.opponents_members.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {bill.opponents_members.map((name) => (
                      <button
                        key={name}
                        onClick={() => navigate(`/member/${encodeURIComponent(name)}`)}
                        className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800 hover:bg-red-200"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
