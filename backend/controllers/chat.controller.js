import { askChatWithPython } from '../services/python/askChat.js'
import ChatMessage from '../model/ChatMessage.model.js'
import ChatSession from '../model/ChatSession.model.js'

export const askChat = async (req, res) => {
  try {
    const { documentId, question, sessionId } = req.body

    if (!documentId || !question?.trim()) {
      return res.status(400).json({
        message: 'documentId and question are required',
      })
    }

    if (sessionId) {
      await ChatMessage.create({
        sessionId,
        role: 'user',
        content: question.trim()
      })
    }

    const result = await askChatWithPython({
      documentId,
      question: question.trim(),
    })

    if (sessionId) {
      await ChatMessage.create({
        sessionId,
        role: 'assistant',
        content: result.answer
      })
      await ChatSession.findByIdAndUpdate(sessionId, { updatedAt: new Date() })
    }

    return res.status(200).json({
      answer: result.answer,
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to get chat answer',
      error: error.message,
    })
  }
}
