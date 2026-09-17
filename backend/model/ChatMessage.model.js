import mongoose from 'mongoose'

const chatMessageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'ChatSession',
      index: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'assistant'],
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema)

export default ChatMessage
