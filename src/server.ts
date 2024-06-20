import express from 'express'
import router from './router'
import morgan from 'morgan'
import cors from 'cors'
import { protect } from './modules/auth'
import { createNewUser, signin } from './handlers/user'

const app = express()

app.use(cors())
app.use(morgan('dev')) // log requests
app.use(express.json()) // allow clients to send us JSON
app.use(express.urlencoded({extended: true}))

app.use((req, res, next) => {
    req.shhhh_secret = 'doggy'
    next()
})
app.get('/', (req, res, next) => { // error handler comes after route handler, that's why we use next here. 
    setTimeout(() => {
        next(new Error('error'))
    }, 1)
})

app.use('/api', protect, router)

app.post('/user', createNewUser)
app.post('/signin', signin)

app.use((err, req, res, next) => {
    if (err.type === 'auth') {
        res.status(401).json({message: 'unauthorized'})
    } else if (err.type === 'input') {
        res.status(400).json({message: 'invalid input'})
    } else {
        res.status(500).json({message: 'oops, thats on us'})
    }
})

export default app