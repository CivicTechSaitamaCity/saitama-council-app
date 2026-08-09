import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { fetchMembers } from '../lib/api';
import type { Member } from '../types';

export function MemberSearch() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers()
      .then((res) => setMembers(res.members))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const constituencies = useMemo(
    () =>
      Array.from(new Set(members.map((m) => m.constituency).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b, 'ja')
      ),
    [members]
  );

  const filtered = members.filter((m) => {
    const matchesQuery = query === '' || m.name.includes(query);
    const matchesConstituency = !selectedConstituency || m.constituency === selectedConstituency;
    return matchesQuery && matchesConstituency;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="議員名を検索（例：佐藤）"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 活動区フィルター */}
      {constituencies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedConstituency(null)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              selectedConstituency === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            すべて
          </button>
          {constituencies.map((constituency) => (
            <button
              key={constituency}
              onClick={() =>
                setSelectedConstituency(selectedConstituency === constituency ? null : constituency)
              }
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selectedConstituency === constituency
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {constituency}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="py-12 text-center text-gray-500">読み込み中...</div>
      )}

      {error && (
        <div className="py-12 text-center text-red-500">エラー: {error}</div>
      )}

      {!loading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((member) => (
              <Card
                key={member.number}
                onClick={() => navigate(`/member/${encodeURIComponent(member.number)}`)}
                className="cursor-pointer transition-all hover:border-blue-500"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    <Badge variant="info" className="shrink-0">{member.constituency}</Badge>
                  </div>
                  <CardDescription>
                    {member.faction || '会派不明'}
                    {member.terms_served && ` ・ 当選${member.terms_served}回`}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              検索結果が見つかりませんでした
            </div>
          )}
        </>
      )}
    </div>
  );
}
