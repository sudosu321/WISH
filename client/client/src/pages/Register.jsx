import { Link } from "react-router-dom";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from "../config";
import { motion } from "framer-motion";
import MeteorShower from "../components/MeteorShower";
function Register() {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading , setLoading] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(username)) {
      setError('Username can only contain letters, numbers and underscores')
      return
    }
    if (!usernameRegex.test(password)) {
      setError('Password can only contain letters, numbers and underscores')
      return
    }
    if(name.length>15){
      setError('Name must be at most 15 characters')
      return
    }
    if (!username || !password) {
      setError('Please fill in all fields')
      return
    }
    if (username.length < 4) {
      setError('Username must be at least 4 characters')
      return
    }
    if (username.length > 15) {
      setError('Username must be at most 15 characters')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password.length > 12) {
      setError('Password must be at most 12 characters')
      return
    }
      setLoading(true)
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, name, password })
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
        backgroundImage: "url('/w1.png')"
      }}>
      <title>Join us</title>
      <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "backInOut" }}
     className="
          w-full
              z-10

          max-w-md
          p-8
          bg-black/20
          backdrop-blur-md
          rounded-3xl
         
          shadow-[0_0_30px_rgba(1,4,41,0.50)]
          flex
          flex-col
          gap-4
        ">
        <h1
          className="
            text-center
            font-['Exo_2']
            text-[#fffbfc]
            text-5xl
            uppercase
            drop-shadow-[0_0_12px_rgba(1,4,41,1)]
          "
        >
         JOIN US ! 
        </h1>

       {error ? (
        <motion.p 
        initial={{ x: 0 }}
        animate={{ x: [0, -10, 10, -10, 10, 0] }}
        transition={{ duration: 0.4 }}
              className="text-center  text-red-200 text-s  font-mono mb-2 mt-1">
                {error}
        </motion.p>
      ) : (
        <motion.p className="text-center font-['Rajdhani'] text-white text-s  mb-2 mt-1">
          Register now to explore the world of wisdom.
        </motion.p>
      )}

        <form className="flex flex-col gap-4">
          <label className="text-gray-300  text-xs uppercase tracking-widest">
            Username
          </label>
          <input
            type="text"
            placeholder="New Username"
            className="
            h-14
              text-lg
               w-full
               bg-black/20
               backdrop-blur-md
              text-gray-200
              p-3
              placeholder:text-gray-600
              focus:border-transparent
              outline-none
              transition-all
              rounded-2xl
            "
            onChange={(e) => setUsername(e.target.value)}
          />
           <label className="text-gray-300  text-xs uppercase tracking-widest">
            Name
          </label>
          <input
            type="text"
            placeholder="Your Name"
            className="
            h-14
              text-lg
               w-full
               bg-black/20
               backdrop-blur-md
              text-gray-200
              p-3
              placeholder:text-gray-600
              focus:border-transparent
              outline-none
              transition-all
              rounded-2xl
            "
            onChange={(e) => setName(e.target.value)}
          />
          <label className="text-gray-300  text-xs uppercase tracking-widest">
            Password
          </label>
          <input
            type="password"
            placeholder="New Password"
            className="
            h-14
              text-lg
               w-full
               bg-black/20
               backdrop-blur-md
              text-gray-200
              p-3
              placeholder:text-gray-600
              focus:border-transparent
              outline-none
              transition-all
              rounded-2xl
            "
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-center mt-3 font-[VT323] text-gray-500 text-s tracking-widest mb-2">
            Registered? <Link to="/" className="text-white font-[Rajdhani] hover:scale-105 drop-shadow-[0_0_12px_rgba(1,4,41,1)] transition-transform transition-duration-300">
Login Now</Link>
          </p>
          <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 800 }}
          disabled={loading}
            onClick={(e) => { e.preventDefault(); handleRegister() }}
            className="
              w-full
              mt-2
              bg-black/10
               backdrop-blur-md
              hover:bg-black/100
              text-white
              py-3
              rounded-2xl

              transition-all
            "
          
          >
            <h4 className="
            text-center
            text-[#ffffff]
            text-2xl
            font-[VT323]
           
            drop-shadow-[0_0_12px_rgba(4,4,41,0.7)]">
              {loading ? "REGISTERING..." :"REGISTER NOW"}
            </h4>
          </motion.button>
        </form>
      </motion.div>
            <MeteorShower density={5} />
      
    </div>
  );
}

export default Register