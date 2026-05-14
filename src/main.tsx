import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './style.css'
import { TopicSearch } from './components/TopicSearch'
import { IssueList } from './components/IssueList'
import { SolutionList } from './components/SolutionList'
import { FactionList } from './components/FactionList'
import { CouncilorList } from './components/CouncilorList'
import { CouncilorProfile } from './components/CouncilorProfile'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            さいたま市議会議員活動検索
          </h1>
          <p className="mt-1 text-xs text-gray-600 sm:text-sm">
            トピックから地域の課題、解決策、議員の活動まで一覧で確認できます
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Routes>
          <Route path="/" element={<TopicSearch />} />
          <Route path="/topic/:topicId" element={<IssueList />} />
          <Route path="/issue/:issueId" element={<SolutionList />} />
          <Route path="/solution/:solutionId" element={<FactionList />} />
          <Route path="/faction/:factionId" element={<CouncilorList />} />
          <Route path="/councilor/:councilorId" element={<CouncilorProfile />} />
        </Routes>
      </main>

      <footer className="mt-12 border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center text-xs text-gray-600 sm:text-sm sm:px-6 lg:px-8">
          © 2024 さいたま市議会議員活動検索システム
        </div>
      </footer>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)


