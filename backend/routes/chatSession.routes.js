import { Router } from 'express'
import {
  createChatSession,
  getChatSessions,
  getChatSessionById
} from '../controllers/chatSession.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()

// Protect all chat session routes
router.use(protect)

router.post('/', createChatSession)
router.get('/', getChatSessions)
router.get('/:id', getChatSessionById)

export default router
