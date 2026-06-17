import { Link } from "react-router-dom";
import API_URL from "../config";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion";
import MeteorShower from "../components/MeteorShower";

function Login() {
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading , setLoading] = useState('')

  const navigate = useNavigate()

  const handleLogin = async () => {
    if(username.length>15 || password.length>15){
      setError('Invalid length fields')
      return
    }
    if (!username || !password) {
    setError('Please fill in all fields')
    return
  }
  setLoading(true);
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await res.json()
    if (res.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.username)
      navigate('/home')
    } else {
      setError(data.message)
    }
    setLoading(false);
  }
  return (
    <>
     <MeteorShower density={5} />

    <motion.div
    
      className="
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
      }}

    >
      
      <title>LOGIN</title>
      <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "backInOut" }}
            className="
              z-10
              w-full
              max-w-md
              p-8
              bg-black/20
              backdrop-blur-md
              rounded-3xl
            
              shadow-[0_0_30px_rgba(1,4,41,0.50)]
              flex
              flex-col
              gap-4
            "
      >
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
         WELCOME 
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
          Login now to explore the world of wisdom.
        </motion.p>
      )}

        <form className="flex flex-col gap-3">
          <label className="text-gray-300 text-xs uppercase tracking-widest">
            Username
          </label>
          <input
          onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Enter your username"
            className="
              w-full
              h-14
              text-lg
               bg-black/20
               backdrop-blur-md
              text-gray-200
              p-3
              placeholder:text-gray-600
              
              outline-none
              transition-all
              rounded-2xl
            "
          />
          <label className="text-gray-300 mt-2 text-xs uppercase tracking-widest">
            Password
          </label>
          <input
          onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
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
          />
           <p className="text-center mt-3 font-[Exo_2] text-white text-s tracking-widest mb-2">
          First time here ? <Link
                to="/register"
                className="text-white font-[Rajdhani] hover:scale-105 drop-shadow-[0_0_12px_rgba(1,4,41,1)] transition-transform transition-duration-300">
            Register
                </Link>
        </p>
          <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 800 }}
          disabled={loading}
          onClick={(e) => {
              e.preventDefault()
              handleLogin()
            }}
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
          <h4  className="
            text-center
            text-[#ffffff]
            text-2xl
            font-[VT323]
          
            
            drop-shadow-[0_0_12px_rgba(217,4,41,0.7)]
          ">
            {loading?"...": "Log In"}
          </h4>
          </motion.button>
        </form>
      
      </motion.div>
           
      
    </motion.div>
    </>
  );
}

export default Login;