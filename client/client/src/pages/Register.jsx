import { Link } from "react-router-dom";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading , setLoading] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!username || !password) {
      setError('Please fill in all fields')
      return
    }
    if (username.length < 4) {
      setError('Username must be at least 4 characters')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
      setLoading(true)
    const res = await fetch('https://wish-kc7i.onrender.com/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await res.json()

    if (res.ok) {
      navigate('/')
    } else {
      setError(data.message)
    }
     setLoading(false)
  }

  return (
    <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-cover
        bg-center
        bg-fixed
        relative
      "
      style={{
        backgroundImage: "url('/wallpaper/w1.png')"
      }}>
      <title>Join us</title>
      <div className="w-96 p-8  bg-black/40
          backdrop-blur-md
          border
          rounded-3xl  border-red-900 shadow-[0_0_30px_rgba(217,4,41,0.25)] flex flex-col gap-4">
        <h1 className="text-center text-[#D90429] text-5xl font-[VT323] tracking-[0.5rem] uppercase drop-shadow-[0_0_12px_rgba(217,4,41,0.7)]">
          Join US
        </h1>

        <p className="text-center font-[VT323] text-red-500 text-s tracking-widest mb-2">
          {error}
        </p>

        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="New Username"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-black border border-gray-800 text-gray-200 p-3 placeholder:text-gray-600 focus:border-red-700 outline-none transition-all"
          />
          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black border border-gray-800 text-gray-200 p-3 placeholder:text-gray-600 focus:border-red-700 outline-none transition-all"
          />
          <p className="text-center mt-3 font-[VT323] text-gray-500 text-s tracking-widest mb-2">
            Registered? <Link to="/" className="text-red-500 hover:text-red-400">Login Now</Link>
          </p>
          <button
          disabled={loading}
            onClick={(e) => { e.preventDefault(); handleRegister() }}
            className="w-full mt-2 bg-[#D90429] hover:bg-[#b10322] text-white py-3 uppercase tracking-widest transition-all"
          
          >
            <h4 className="text-center text-white text-2xl font-[VT323]  uppercase">
              {loading ? "REGISTERING..." :"REGISTER NOW"}
            </h4>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register