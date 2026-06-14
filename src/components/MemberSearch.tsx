import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { DUMMY_MEMBERS } from '../lib/dummyMembers';

export function MemberSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState<string | null>(null);

  const wards = Array.from(new Set(DUMMY_MEMBERS.map((m) => m.ward)));

  const filtered = DUMMY_MEMBERS.filter((m) => {
    const matchesQuery = m.name.includes(query);
    const matchesWard = !selectedWard || m.ward === selectedWard;
    return matchesQuery && matchesWard;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="議員名を検索（例：佐藤 一郎）"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 活動区フィルター */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedWard(null)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            selectedWard === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          すべて
        </button>
        {wards.map((ward) => (
          <button
            key={ward}
            onClick={() => setSelectedWard(selectedWard === ward ? null : ward)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              selectedWard === ward
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {ward}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((member) => (
          <Card
            key={member.name}
            onClick={() => navigate(`/member/${encodeURIComponent(member.name)}`)}
            className="cursor-pointer transition-all hover:border-blue-500"
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{member.name}</CardTitle>
                <Badge variant="info" className="shrink-0">{member.ward}</Badge>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          検索結果が見つかりませんでした
        </div>
      )}
    </div>
  );
}
