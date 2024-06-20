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
    console.log(err)
    res.json({message: `opps there was an error: ${err.message}`})
})

export default app