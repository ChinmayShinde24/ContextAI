import { useAppContext } from '../../context/AppContext'
import { usePdfUpload } from '../../hooks/usePdfUpload'

const AddPdf = () => {
  const { document, clearDocument, isUploading } = useAppContext()
  const {
    inputRef,
    isDragging,
    error,
    openFilePicker,
    handleFileChange,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = usePdfUpload()

  if (document) {
    return (
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900 to-neutral-950 p-4 sm:p-5">
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/40">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-neutral-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
              <path d="M14 3v5h5" />
              <path d="M9 13h6M9 17h4" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium tracking-wide text-neutral-500 uppercase">
              Active PDF
            </p>
            <p className="mt-1 truncate text-sm font-medium text-neutral-100">
              {document.fileName}
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">{document.status}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={clearDocument}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-neutral-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          Remove PDF
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <button
        type="button"
        onClick={openFilePicker}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={isUploading}
        className={`group w-full rounded-2xl border border-dashed px-4 py-8 text-left transition duration-300 sm:px-5 sm:py-10 lg:py-14 ${
          isDragging
            ? 'border-neutral-400 bg-neutral-800/80'
            : 'border-white/15 bg-neutral-950/60 hover:border-neutral-500 hover:bg-neutral-900/80'
        }`}
      >
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/50 transition ${
            isDragging ? 'scale-105' : 'group-hover:scale-105'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-neutral-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M12 16V4" />
            <path d="m7 9 5-5 5 5" />
            <path d="M20 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
          </svg>
        </div>
        <p className="text-base font-medium text-gradient sm:text-lg">
          {isUploading
            ? 'Uploading...'
            : isDragging
              ? 'Drop it here'
              : 'Add your PDF'}
        </p>
        <p className="mt-1.5 max-w-[16rem] text-sm leading-relaxed text-neutral-500">
          Click to browse files, or drag and drop a PDF into this area.
        </p>
      </button>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  )
}

export default AddPdf
