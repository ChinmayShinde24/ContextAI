import mongoose from 'mongoose'

const chatSessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Document',
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

const ChatSession = mongoose.model('ChatSession', chatSessionSchema)

export default ChatSession
