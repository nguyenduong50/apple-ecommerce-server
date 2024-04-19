import express from 'express'
import jwt from 'jsonwebtoken'
import { hash, compare } from 'bcrypt'

const Router = express.Router()

Router.route('/login')
  .post(async(req, res, next) => {
    const { username, password } = req.body
    const passwordDemo = await hash('123456789', 12)
    const users = [
      {
        id: 1,
        username: 'duong@gmail.com',
        password: passwordDemo,
        name: 'nguyen duong',
        age: 33
      },
      {
        id: 2,
        username: 'vuthao@gmail.com',
        password: passwordDemo,
        name: 'Vu Thao',
        age: 29
      }
    ]

    const isCompare = await compare(password, users[0].password)
    const user = users.find((user) => {
      return user.username === username && isCompare
    })

    if (!user) {
      return res.send('forbidden')
    }

    const accessToken = jwt.sign(
      {
        email: user.email,
        userId: user.id.toString()
      },
      'tokenSecret',
      { expiresIn: '1h' }
    )

    req.session.accessToken = accessToken
    req.session.userId = user.id
    // const now = new Date()
    // now.setHours(now.getHours() + 1)
    // req.session.cookie.expires = now
    res.cookie('accessToken', accessToken, { maxAge: 1000*60*60, httpOnly: true, sameSite: 'none', secure: true })
    res.send({ message: 'login' })
  })

Router.route('/logout')
  .get((req, res, next) => {
    req.session.destroy()
    res.send({ message: 'logout' })
  })

Router.route('/dashboard')
  .get(async(req, res) => {
    res.send({ message: 'dashboard' })
  })

export const authRoute = Router
