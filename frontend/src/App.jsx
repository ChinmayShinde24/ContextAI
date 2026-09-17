import ChatInput from './components/chatbox/ChatInput'
import ChatWindow from './components/chatbox/ChatWindow'
import Sidebar from './components/layout/Sidebar'
import { AppProvider, useAppContext } from './context/AppContext'
import { usePdfUpload } from './hooks/usePdfUpload'

const AppShell = () => {
  const { isSidebarOpen, toggleSidebar } = useAppContext()
  const {
    isDragging,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = usePdfUpload()

  return (
    <div className="flex h-dvh overflow-hidden bg-[#070707] text-neutral-100">
      <Sidebar />

      <div className="relative flex min-w-0 flex-1 flex-col bg-[#0c0c0c]">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-white/5 px-3 sm:px-4">
          {!isSidebarOpen ? (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-white/5 hover:text-neutral-100"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M9 4v16" />
              </svg>
            </button>
          ) : null}
          <p className="text-sm font-medium text-neutral-300">Conversation</p>
        </header>

        <main
          className={`relative flex min-h-0 flex-1 flex-col transition ${
            isDragging ? 'bg-neutral-900/40' : ''
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging ? (
            <div className="pointer-events-none absolute inset-4 z-10 flex items-center justify-center rounded-2xl border border-dashed border-neutral-400 bg-black/50">
              <p className="text-sm font-medium text-neutral-200">
                Drop PDF into the chat
              </p>
            </div>
          ) : null}

          <section className="min-h-0 flex-1 overflow-hidden">
            <ChatWindow />
          </section>

          <section className="shrink-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:px-4 sm:pb-4">
            <ChatInput />
          </section>
        </main>
      </div>
    </div>
  )
}

import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext()
  if (!user) {
    return <Navigate to="/auth" replace />
  }
  return children
}

const App = () => {
  return (
    <AppProvider>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  )
}

export default App
