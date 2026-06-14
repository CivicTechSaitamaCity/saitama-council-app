import { useState } from 'react';
import { TopicSearch } from './TopicSearch';
import { MemberSearch } from './MemberSearch';

type SearchTab = 'topic' | 'member';

export function SearchTabs() {
  const [activeTab, setActiveTab] = useState<SearchTab>('topic');

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('topic')}
          className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'topic'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          トピックを探す
        </button>
        <button
          onClick={() => setActiveTab('member')}
          className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'member'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          議員を探す
        </button>
      </div>

      {activeTab === 'topic' ? <TopicSearch /> : <MemberSearch />}
    </div>
  );
}
