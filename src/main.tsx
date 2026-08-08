import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './style.css'
import { SearchTabs } from './components/SearchTabs'
import { BillList } from './components/BillList'
import { BillDetail } from './components/BillDetail'
import { MemberProfile } from './components/MemberProfile'

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
          <Route path="/" element={<SearchTabs />} />
          <Route path="/topic/:topicName" element={<BillList />} />
          <Route path="/topic/:topicName/bill/:billId" element={<BillDetail />} />
          <Route path="/member/:memberId" element={<MemberProfile />} />
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
