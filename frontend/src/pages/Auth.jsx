import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, signupUser } from '../api/authApi'
import { useAppContext } from '../context/AppContext'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAppContext()

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let data
      if (isLogin) {
        data = await loginUser(formData.email, formData.password)
      } else {
        data = await signupUser(formData.name, formData.email, formData.password)
      }

      // Save to localStorage
      const userData = {
        token: data.token,
        _id: data._id,
        username: data.username,
      }
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Update Context
      login(userData)

      // Redirect
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#070707] px-4 text-neutral-100">
      <div className="w-full max-w-sm rounded-3xl border border-white/5 bg-[#0c0c0c] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gradient">ContextAI</h1>
          <p className="mt-2 text-sm text-neutral-400">
            {isLogin ? 'Welcome back. Sign in to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-400">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-2.5 text-sm outline-none transition focus:border-neutral-500/50"
              />
            </div>
          )}
          
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-2.5 text-sm outline-none transition focus:border-neutral-500/50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-2.5 text-sm outline-none transition focus:border-neutral-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-neutral-200 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-white disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setFormData({ name: '', email: '', password: '' })
            }}
            className="font-medium text-neutral-300 hover:text-white transition"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth
