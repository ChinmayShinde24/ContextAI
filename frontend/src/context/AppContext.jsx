import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react'
import { fetchChatSessions, fetchChatSessionById } from '../api/chatApi'

const AppContext = createContext(null)

const getInitialUser = () => {
  try {
    const stored = localStorage.getItem('user')
    if (stored) return JSON.parse(stored)
  } catch (e) {
    console.error('Failed to parse user from local storage')
  }
  return null
}

export const AppProvider = ({ children }) => {
  const [document, setDocument] = useState(null)
  const [messages, setMessages] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [user, setUser] = useState(getInitialUser)
  
  const [sessions, setSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)

  const loadSessions = useCallback(async () => {
    try {
      const data = await fetchChatSessions()
      setSessions(data)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  }, [])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  const startNewChat = () => {
    setCurrentSessionId(null)
    setMessages([])
  }

  const selectSession = async (sessionId) => {
    try {
      setIsChatLoading(true)
      const data = await fetchChatSessionById(sessionId)
      setCurrentSessionId(data.session.id)
      
      setDocument({
        id: data.session.documentId,
        fileName: data.session.fileName || 'Attached Document',
        status: 'processed'
      })
      
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages.map(m => ({
          id: m.id,
          role: m.role,
          text: m.content,
          createdAt: m.createdAt,
          pdfName: data.session.title
        })))
      } else {
        setMessages([])
      }
    } catch (error) {
      console.error('Failed to load session:', error)
    } finally {
      setIsChatLoading(false)
    }
  }

  const setCurrentDocument = (doc) => {
    setDocument(doc)
  }

  const clearDocument = () => {
    setDocument(null)
  }

  const addMessage = (role, text, meta = {}) => {
    const trimmed = text?.trim() || ''
    if (!trimmed && !meta.pdfName) return

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role,
        text: trimmed,
        pdfName: meta.pdfName || null,
        createdAt: new Date().toISOString(),
      },
    ])
  }

  const clearMessages = () => {
    setMessages([])
  }

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setDocument(null)
    setMessages([])
    setSessions([])
    setCurrentSessionId(null)
  }

  const value = useMemo(
    () => ({
      document,
      messages,
      user,
      isSidebarOpen,
      isUploading,
      isChatLoading,
      sessions,
      currentSessionId,
      setCurrentDocument,
      clearDocument,
      setIsUploading,
      setIsChatLoading,
      addMessage,
      clearMessages,
      toggleSidebar,
      setIsSidebarOpen,
      loadSessions,
      setCurrentSessionId,
      startNewChat,
      selectSession,
      login,
      logout,
    }),
    [document, messages, user, isSidebarOpen, isUploading, isChatLoading, sessions, currentSessionId],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }

  return context
}
