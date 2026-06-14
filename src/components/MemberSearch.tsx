import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface DummyMember {
  name: string;
  ward: string;
}

const DUMMY_MEMBERS: DummyMember[] = [
  { name: '佐藤 一郎', ward: '大宮区' },
  { name: '鈴木 花子', ward: '浦和区' },
  { name: '高橋 健太', ward: '中央区' },
  { name: '田中 美咲', ward: '西区' },
  { name: '伊藤 大輔', ward: '北区' },
  { name: '渡辺 さくら', ward: '見沼区' },
  { name: '山本 翔太', ward: '桜区' },
  { name: '中村 優子', ward: '南区' },
  { name: '小林 誠', ward: '緑区' },
  { name: '加藤 真央', ward: '岩槻区' },
  { name: '吉田 健一', ward: '大宮区' },
  { name: '山田 直樹', ward: '浦和区' },
];

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
