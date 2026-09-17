import Document from '../model/Document.model.js'
import { validateUploadedPdf } from '../helpers/validateUploadedPdf.js'
import { processDocumentWithPython } from '../services/python/processDocument.js'

export const uploadDocument = async (req, res) => {
  try {
    const validation = validateUploadedPdf(req.file)

    if (!validation.ok) {
      return res.status(validation.status).json({
        message: validation.message,
      })
    }

    const document = await Document.create({
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
    })

    document.status = 'processing'
    await document.save()

    try {
      const result = await processDocumentWithPython({
        filePath: req.file.path,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        documentId: document._id.toString(),
      })

      document.status = 'processed'
      document.pageCount = result.pageCount
      document.chunkCount = result.chunkCount
      document.errorMessage = ''
      await document.save()

      return res.status(201).json({
        message: 'PDF uploaded successfully',
        document: {
          id: document._id,
          fileName: document.fileName,
          status: document.status,
          pageCount: document.pageCount,
          chunkCount: document.chunkCount,
        },
      })
    } catch (processingError) {
      document.status = 'failed'
      document.errorMessage = processingError.message
      await document.save()

      return res.status(500).json({
        message: 'Failed to process PDF',
        error: processingError.message,
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to upload PDF',
      error: error.message,
    })
  }
}

export const getDocuments = async (_req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 })

    return res.status(200).json({
      message: 'Documents fetched successfully',
      documents,
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch documents',
      error: error.message,
    })
  }
}

export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)

    if (!document) {
      return res.status(404).json({
        message: 'Document not found',
      })
    }

    return res.status(200).json({
      message: 'Document fetched successfully',
      document,
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch document',
      error: error.message,
    })
  }
}
