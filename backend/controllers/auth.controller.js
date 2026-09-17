import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../model/User.model.js'

// Hardcoded secret for simplicity in this project (as per existing conventions without JWT_SECRET in env)
const JWT_SECRET = process.env.JWT_SECRET || 'contextai_super_secret_key'

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      _id: user._id,
      username: user.name,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })

    return res.status(200).json({
      message: 'Login successful',
      token,
      _id: user._id,
      username: user.name,
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
