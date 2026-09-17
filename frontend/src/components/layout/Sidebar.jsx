import { useAppContext } from '../../context/AppContext'
import { getInitials } from '../../helpers/format'

const Sidebar = () => {
  const {
    document,
    clearDocument,
    user,
    isSidebarOpen,
    toggleSidebar,
    isUploading,
    sessions,
    currentSessionId,
    startNewChat,
    selectSession,
    logout,
  } = useAppContext()

  return (
    <>
      {isSidebarOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={toggleSidebar}
          aria-hidden
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-70 flex-col border-r border-white/5 bg-[#050505] transition-transform duration-300 ease-out md:static md:z-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-3 py-3">
          <h1 className="truncate px-1 text-base font-semibold tracking-tight text-gradient">
            ContextAI
          </h1>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
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
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-5">
          
          <div>
            <button
              type="button"
              onClick={startNewChat}
              className="flex w-full items-center gap-2 rounded-xl bg-neutral-100 px-3 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Chat
            </button>
          </div>

          <div className="flex-1">
            <p className="mb-2 px-1 text-[11px] font-medium tracking-[0.18em] text-neutral-600 uppercase">
              Recent Chats
            </p>
            <div className="flex flex-col gap-0.5">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => selectSession(session.id)}
                  className={`truncate rounded-lg px-2 py-2 text-left text-sm transition hover:bg-white/5 ${
                    currentSessionId === session.id
                      ? 'bg-white/10 text-neutral-100 font-medium'
                      : 'text-neutral-400 hover:text-neutral-300'
                  }`}
                >
                  {session.title}
                </button>
              ))}
              {sessions.length === 0 && (
                <p className="px-2 text-xs text-neutral-600">No recent chats.</p>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 px-1 text-[11px] font-medium tracking-[0.18em] text-neutral-600 uppercase">
              Current Document
            </p>
            {document ? (
              <div className="rounded-xl border border-white/10 bg-white/3 p-3">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/40">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 text-neutral-300"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
                      <path d="M14 3v5h5" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-neutral-100">
                      {document.fileName}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {document.status}
                      {document.pageCount
                        ? ` · ${document.pageCount} pages`
                        : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearDocument}
                  className="mt-3 w-full rounded-lg px-2 py-1.5 text-xs text-neutral-400 transition hover:bg-white/5 hover:text-neutral-200"
                >
                  Remove
                </button>
              </div>
            ) : (
              <p className="px-1 text-sm leading-relaxed text-neutral-600">
                {isUploading
                  ? 'Uploading and processing PDF...'
                  : 'Attach a PDF with + in the chat box, or drag it into the conversation.'}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 p-3">
          <div className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 transition hover:bg-white/3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-neutral-200">
                {getInitials(user?.username || user?.name || 'User')}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-neutral-100">{user?.username || user?.name}</p>
                <p className="truncate text-xs text-neutral-500">Signed in</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={logout}
              title="Logout"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

