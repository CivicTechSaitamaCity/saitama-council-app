import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function MemberSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const name = query.trim();
    if (name) {
      navigate(`/member/${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="議員名を入力して検索（例：山田太郎）"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">検索</Button>
      </form>

      <div className="py-12 text-center text-gray-500">
        議員名を入力すると、その議員の活動を確認できます
      </div>
    </div>
  );
}
