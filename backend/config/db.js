import mongoose from 'mongoose'

const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL

  if (!mongoUrl) {
    throw new Error('MONGO_URL is missing in .env')
  }

  await mongoose.connect(mongoUrl)
  console.log('MongoDB connected')
}

export default connectDB
