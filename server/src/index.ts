import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import apiRouter from './routes/api'

import path from 'path'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors({
  origin: '*', // Allow all origins for local undergraduate project simplicity
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '10mb' }))

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// Register routes
app.use('/api', apiRouter)

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ message: err.message || 'Internal Server Error' })
})

app.listen(port, () => {
  console.log(`RescueHub server running on http://localhost:${port}`)
})
