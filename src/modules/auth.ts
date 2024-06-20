import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const comparePasswords = (password, hash) => { // password: plain text from user, hash: encypt text from DB 
    return bcrypt.compare(password, hash) // bcrypt.compare is by default async, which returns a promise 
}

export const hashPassword = (password) => {
    return bcrypt.hash(password, 5) // 5 is the salt, // bcrypt.hash is by default async, which returns a promise 
}

export const createJWT = (user) => {
    const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET)
    return token
}

export const protect = (req, res, next) => {
    const bearer = req.headers.authorization 

    if(!bearer) {
        res.status(401)
        res.json({message: 'not authorized'})
        return 
    }

    const [, token] = bearer.split(' ') // the first index is 'bearer'

    if(!token) {
        res.status(401)
        res.json({message: 'no token'})
        return 
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user 
        next()
    } catch (e) {
        console.error(e)
        res.status(401)
        res.json({message: 'not valid token'})
        return 
    }
}