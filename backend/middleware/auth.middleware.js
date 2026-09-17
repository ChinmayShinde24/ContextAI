import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'contextai_super_secret_key'

export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, JWT_SECRET)

      req.user = { id: decoded.id }

      next()
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }
}
