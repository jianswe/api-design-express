import prisma from '../db'
import { comparePasswords, createJWT, hashPassword } from '../modules/auth'

export const createNewUser = async (req, res) => {
    const user = await prisma.user.create({
        data: {
            username: req.body.username,
            password: await hashPassword(req.body.password) 
        }
    })

    const token = createJWT(user)
    res.json({token})
}

export const signin = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.body.username
        }
    })

    const isValid = await comparePasswords(req.body.password, user.password)

    if(!isValid) {
        res.status(401)
        res.json({message: 'username or password invalid'})
        return 
    }

    const token = createJWT(user) // When signin, user also don't have a JWT token yet. 
    res.json({token})
}