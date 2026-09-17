import { useEffect, useRef } from 'react'
import { useAppContext } from '../../context/AppContext'

const ChatWindow = () => {
  const { messages, document, isChatLoading, isUploading } = useAppContext()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isChatLoading])

  if (messages.length === 0 && !isChatLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-gradient-to-b from-neutral-800 to-neutral-950">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 text-neutral-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-gradient sm:text-2xl">
          Ask anything from your PDF
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
          {isUploading
            ? 'Uploading and processing your PDF...'
            : document
              ? `“${document.fileName}” is ready. Ask a question below.`
              : 'Use + to attach a PDF, or drag one anywhere into this chat area.'}
        </p>
      </div>
    )
  }

  return (
    <div className="scrollbar-thin mx-auto flex h-full w-full max-w-3xl flex-col gap-4 overflow-y-auto px-4 py-6 sm:px-6">
      {messages.map((message, index) => {
        const isUser = message.role === 'user'

        return (
          <div
            key={message.id}
            className={`flex animate-rise ${isUser ? 'justify-end' : 'justify-start'}`}
            style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
          >
            <div
              className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[80%] sm:px-4 sm:py-3 ${
                isUser
                  ? 'rounded-br-md bg-gradient-to-br from-neutral-200 to-neutral-400 text-neutral-950'
                  : 'rounded-bl-md border border-white/10 bg-neutral-900/90 text-neutral-200'
              }`}
            >
              {!isUser ? (
                <p className="mb-1.5 text-[10px] font-medium tracking-[0.16em] text-neutral-500 uppercase">
                  System
                </p>
              ) : null}

              {message.pdfName ? (
                <div
                  className={`mb-2 flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs ${
                    isUser ? 'bg-black/10' : 'bg-white/5'
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
                    <path d="M14 3v5h5" />
                  </svg>
                  <span className="truncate font-medium">{message.pdfName}</span>
                </div>
              ) : null}

              {message.text ? (
                <p className="whitespace-pre-wrap break-words">{message.text}</p>
              ) : null}
            </div>
          </div>
        )
      })}

      {isChatLoading ? (
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-bl-md border border-white/10 bg-neutral-900/90 px-4 py-3 text-sm text-neutral-400">
            Thinking...
          </div>
        </div>
      ) : null}

      <div ref={bottomRef} />
    </div>
  )
}

export default ChatWindow
