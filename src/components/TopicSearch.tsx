import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { fetchTopics } from '../lib/api';
import type { ApiTopicsResponse } from '../types';

export function TopicSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [data, setData] = useState<ApiTopicsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const categoryOf = (topic: string): string => {
    if (!data) return '';
    for (const [cat, topics] of Object.entries(data.grouped)) {
      if (topics.includes(topic)) return cat;
    }
    return '';
  };

  const categories = data ? Object.keys(data.grouped) : [];

  const filtered = data
    ? data.topics.filter((t) => {
        const matchesQuery = t.includes(query);
        const matchesCategory = !selectedCategory || categoryOf(t) === selectedCategory;
        return matchesQuery && matchesCategory;
      })
    : [];

  if (loading) {
    return <div className="py-12 text-center text-gray-500">読み込み中...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="トピックを検索（例：子育て支援、環境問題）"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          すべて
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((topic) => (
          <Card
            key={topic}
            onClick={() => navigate(`/topic/${encodeURIComponent(topic)}`)}
            className="cursor-pointer transition-all hover:border-blue-500"
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{topic}</CardTitle>
                {categoryOf(topic) && (
                  <Badge variant="info" className="shrink-0">{categoryOf(topic)}</Badge>
                )}
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
