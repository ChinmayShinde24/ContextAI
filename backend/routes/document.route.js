import { Router } from 'express'
import {
  getDocumentById,
  getDocuments,
  uploadDocument,
} from '../controllers/document.controller.js'
import upload from '../middleware/upload.js'

const router = Router()

router.post('/upload', upload.single('pdf'), uploadDocument)
router.get('/', getDocuments)
router.get('/:id', getDocumentById)

export default router
