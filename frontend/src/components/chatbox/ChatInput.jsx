import { useAppContext } from '../../context/AppContext'
import { useChat } from '../../hooks/useChat'
import { usePdfUpload } from '../../hooks/usePdfUpload'

const ChatInput = () => {
  const { document, isUploading, currentSessionId } = useAppContext()
  const {
    input,
    setInput,
    sendMessage,
    canSend,
    clearAttachedPdf,
    error: chatError,
    isChatLoading,
  } = useChat()
  const {
    inputRef,
    isDragging,
    pendingFileName,
    error: uploadError,
    openFilePicker,
    handleFileChange,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = usePdfUpload()

  const handleSubmit = (event) => {
    event.preventDefault()
    sendMessage()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const displayName = document?.fileName || pendingFileName
  const error = uploadError || chatError
  const shouldShowPill = (!currentSessionId && document?.fileName) || pendingFileName || isUploading

  return (
    <div className="mx-auto w-full max-w-3xl">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <form
        onSubmit={handleSubmit}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-[28px] border bg-[#141414] p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition ${
          isDragging
            ? 'border-neutral-400 bg-neutral-900'
            : 'border-white/10 focus-within:border-neutral-500/50'
        }`}
      >
        {shouldShowPill && displayName ? (
          <div className="mb-2 flex items-center gap-2 px-2 pt-1">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 text-neutral-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
                <path d="M14 3v5h5" />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-neutral-100">
                  {displayName}
                </p>
                <p className="text-[11px] text-neutral-500">
                  {isUploading
                    ? 'Uploading & processing...'
                    : document?.status || 'Ready'}
                </p>
              </div>
              {document && !isUploading ? (
                <button
                  type="button"
                  onClick={clearAttachedPdf}
                  aria-label="Remove PDF"
                  className="rounded-md px-1.5 py-0.5 text-neutral-500 transition hover:bg-white/5 hover:text-neutral-200"
                >
                  ×
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="flex items-end gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={openFilePicker}
            disabled={isUploading || isChatLoading}
            aria-label="Attach PDF"
            className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>

          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isUploading || isChatLoading}
            placeholder={
              isDragging
                ? 'Drop PDF here...'
                : isUploading
                  ? 'Processing PDF...'
                  : isChatLoading
                    ? 'Waiting for answer...'
                    : document
                      ? 'Ask a question about your PDF...'
                      : 'Upload a PDF, then ask a question...'
            }
            className="max-h-36 min-h-11 flex-1 resize-none bg-transparent py-3 pr-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 disabled:opacity-60 sm:text-[15px]"
          />

          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send"
            className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M12 19V5" />
              <path d="m5 12 7-7 7 7" />
            </svg>
          </button>
        </div>
      </form>

      {error ? (
        <p className="mt-2 px-2 text-center text-xs text-red-400">{error}</p>
      ) : (
        <p className="mt-2 px-2 text-center text-[11px] text-neutral-600">
          Drag a PDF into the chat or use + to attach
        </p>
      )}
    </div>
  )
}

export default ChatInput
