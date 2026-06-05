require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const jwt = require('jsonwebtoken')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'deathwish', allowed_formats: ['jpg', 'png', 'jpeg'] }
})

const upload = multer({ storage })

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

app.get('/', (req, res) => {
  res.send('DeathWish API running')
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  if (!username || username.length < 4) {
    return res.status(400).json({ message: 'Username must be at least 4 characters' })
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  }

  try {
    const existing = await pool.query(
      'SELECT * FROM dataauth WHERE username = $1',
      [username]
    )

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Username already taken' })
    }

    await pool.query(
      'INSERT INTO dataauth (username, password) VALUES ($1, $2)',
      [username, password]
    )

    res.status(201).json({ message: 'User created' })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const result = await pool.query(
      'SELECT * FROM dataauth WHERE username = $1',
      [username]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const user = result.rows[0]

    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token, username: user.username })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/posts', upload.single('image'), async (req, res) => {
  const { username, description } = req.body
  const image_url = req.file.path

  try {
    await pool.query(
      'INSERT INTO posts ("user", "desc", img) VALUES ($1, $2, $3)',
      [username, description, image_url]
    )
    res.status(201).json({ message: 'Post created' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.listen(5000, () => {
  console.log('Server running on port 5000')
})