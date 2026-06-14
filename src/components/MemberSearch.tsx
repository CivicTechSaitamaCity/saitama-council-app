import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface DummyMember {
  name: string;
  faction: string;
}

const DUMMY_MEMBERS: DummyMember[] = [
  { name: '佐藤 一郎', faction: '自由民主党' },
  { name: '鈴木 花子', faction: '公明党' },
  { name: '高橋 健太', faction: '日本共産党' },
  { name: '田中 美咲', faction: '無所属' },
  { name: '伊藤 大輔', faction: '自由民主党' },
  { name: '渡辺 さくら', faction: '民主フォーラム' },
  { name: '山本 翔太', faction: '公明党' },
  { name: '中村 優子', faction: '自由民主党' },
  { name: '小林 誠', faction: '日本共産党' },
  { name: '加藤 真央', faction: '民主フォーラム' },
  { name: '吉田 健一', faction: '無所属' },
  { name: '山田 直樹', faction: '自由民主党' },
];

export function MemberSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);

  const factions = Array.from(new Set(DUMMY_MEMBERS.map((m) => m.faction)));

  const filtered = DUMMY_MEMBERS.filter((m) => {
    const matchesQuery = m.name.includes(query);
    const matchesFaction = !selectedFaction || m.faction === selectedFaction;
    return matchesQuery && matchesFaction;
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

      {/* 会派フィルター */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedFaction(null)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            selectedFaction === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          すべて
        </button>
        {factions.map((faction) => (
          <button
            key={faction}
            onClick={() => setSelectedFaction(selectedFaction === faction ? null : faction)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              selectedFaction === faction
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {faction}
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
                <Badge variant="info" className="shrink-0">{member.faction}</Badge>
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
