import { useCallback, useRef, useState } from 'react'
import { uploadDocument } from '../api/documentApi'
import { useAppContext } from '../context/AppContext'

const ACCEPTED_TYPE = 'application/pdf'

export const isPdfFile = (file) =>
  file && (file.type === ACCEPTED_TYPE || file.name.toLowerCase().endsWith('.pdf'))

export const usePdfUpload = () => {
  const { setCurrentDocument, setIsUploading, isUploading } = useAppContext()
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const [pendingFileName, setPendingFileName] = useState('')
  const dragDepth = useRef(0)

  const processFile = useCallback(
    async (file) => {
      if (!file) return false

      if (!isPdfFile(file)) {
        setError('Please upload a PDF file only.')
        return false
      }

      setError('')
      setPendingFileName(file.name)
      setIsUploading(true)

      try {
        const response = await uploadDocument(file)
        setCurrentDocument(response.document)
        setPendingFileName('')
        return true
      } catch (uploadError) {
        setError(uploadError.message || 'Failed to upload PDF')
        setPendingFileName('')
        return false
      } finally {
        setIsUploading(false)
      }
    },
    [setCurrentDocument, setIsUploading],
  )

  const openFilePicker = () => {
    if (isUploading) return
    inputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    await processFile(file)
    event.target.value = ''
  }

  const handleDragEnter = (event) => {
    event.preventDefault()
    event.stopPropagation()
    dragDepth.current += 1
    setIsDragging(true)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    event.stopPropagation()
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDrop = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    dragDepth.current = 0
    setIsDragging(false)

    if (isUploading) return

    const file = event.dataTransfer.files?.[0]
    await processFile(file)
  }

  return {
    inputRef,
    isDragging,
    isUploading,
    pendingFileName,
    error,
    setError,
    processFile,
    openFilePicker,
    handleFileChange,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  }
}
