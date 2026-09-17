import { Router } from 'express'
import { askChat } from '../controllers/chat.controller.js'

const router = Router()

router.post('/', askChat)

export default router
