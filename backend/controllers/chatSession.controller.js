import mongoose from 'mongoose'
import ChatSession from '../model/ChatSession.model.js'
import ChatMessage from '../model/ChatMessage.model.js'
import Document from '../model/Document.model.js'

export const createChatSession = async (req, res) => {
  try {
    const { title, documentId } = req.body

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' })
    }

    if (!documentId) {
      return res.status(400).json({ message: 'Document ID is required' })
    }

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ message: 'Invalid Document ID' })
    }

    const document = await Document.findById(documentId)
    if (!document) {
      return res.status(404).json({ message: 'Document not found' })
    }

    const session = await ChatSession.create({
      title: title.trim(),
      documentId,
      userId: req.user.id
    })

    return res.status(201).json({
      message: 'Chat session created successfully',
      session: {
        id: session._id,
        title: session.title,
        documentId: session.documentId
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to create chat session',
      error: error.message
    })
  }
}

export const getChatSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user.id }).sort({ updatedAt: -1 })
    
    return res.status(200).json({
      message: 'Chat sessions fetched successfully',
      sessions: sessions.map(session => ({
        id: session._id,
        title: session.title,
        documentId: session.documentId,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }))
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch chat sessions',
      error: error.message
    })
  }
}

export const getChatSessionById = async (req, res) => {
  try {
    const { id: sessionId } = req.params

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: 'Invalid Session ID' })
    }

    const session = await ChatSession.findOne({ _id: sessionId, userId: req.user.id }).populate('documentId')
    if (!session) {
      return res.status(404).json({ message: 'Chat session not found or unauthorized' })
    }

    const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 })

    return res.status(200).json({
      message: 'Chat session fetched successfully',
      session: {
        id: session._id,
        title: session.title,
        documentId: session.documentId?._id || session.documentId,
        fileName: session.documentId?.fileName
      },
      messages: messages.map(msg => ({
        id: msg._id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt
      }))
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch chat session',
      error: error.message
    })
  }
}
