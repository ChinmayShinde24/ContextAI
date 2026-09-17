import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import connectDB from './config/db.js'
import chatRoutes from './routes/chat.route.js'
import documentRoutes from './routes/document.route.js'
import chatSessionRoutes from './routes/chatSession.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/documents', documentRoutes)
app.use('/api/chat/sessions', chatSessionRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/auth', authRoutes)

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()
