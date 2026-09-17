import { useState } from 'react'
import { askQuestion, createChatSession } from '../api/chatApi'
import { useAppContext } from '../context/AppContext'

export const useChat = () => {
  const {
    document,
    addMessage,
    clearDocument,
    isChatLoading,
    setIsChatLoading,
    currentSessionId,
    setCurrentSessionId,
    loadSessions,
  } = useAppContext()
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const sendMessage = async () => {
    const question = input.trim()

    if (!question) {
      setError('Please enter a question.')
      return
    }

    if (!document?.id) {
      setError('Please upload a PDF first.')
      addMessage('user', question)
      setInput('')
      addMessage(
        'assistant',
        'Please attach a PDF with the + button (or drag one in) so I can answer from it.',
      )
      return
    }

    setError('')
    addMessage('user', question, { pdfName: document.fileName })
    setInput('')
    setIsChatLoading(true)

    try {
      let activeSessionId = currentSessionId
      if (!activeSessionId) {
        const title = question.length > 30 ? question.substring(0, 30) + '...' : question
        const newSession = await createChatSession({ title, documentId: document.id })
        activeSessionId = newSession.id
        setCurrentSessionId(activeSessionId)
        loadSessions()
      }

      const response = await askQuestion({
        documentId: document.id,
        question,
        sessionId: activeSessionId
      })

      addMessage('assistant', response.answer || 'No answer received.')
    } catch (chatError) {
      const message = chatError.message || 'Failed to get an answer.'
      setError(message)
      addMessage('assistant', `Sorry, I could not answer that. ${message}`)
    } finally {
      setIsChatLoading(false)
    }
  }

  return {
    input,
    setInput,
    sendMessage,
    error,
    isChatLoading,
    canSend: input.trim().length > 0 && !isChatLoading,
    clearAttachedPdf: clearDocument,
  }
}
