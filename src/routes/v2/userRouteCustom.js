import express from 'express'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import jwt from 'jsonwebtoken'
import { hash, compare } from 'bcryptjs'
import { GET_DATABASE } from '~/config/mongodb'

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
      { expiresIn: '1m' }
    )

    req.session.accessToken = accessToken
    req.session.userId = user.id
    // const now = new Date()
    // now.setHours(now.getHours() + 1)
    // req.session.cookie.expires = now
    res.cookie('accessToken', accessToken)
    res.send({ message: 'login' })
  })

Router.route('/logout')
  .get((req, res, next) => {
    req.session.destroy()
    res.send({ message: 'logout' })
  })

Router.route('/dashboard')
  .get(async(req, res, next) => {
    // console.log(req.get('Cookie').split(';')[0].trim().split('=')[1])
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'FORBIDDEN'))
    }

    const sessions = await GET_DATABASE().collection('sessions').find().toArray()
    const session = sessions.find(session => {
      return session.session.accessToken === accessToken
    })

    if (!session) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'FORBIDDEN'))
    }

    if (session.expires < new Date) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'FORBIDDEN'))
    }

    res.send({ session })
  })


export const userRouteCustom = Router
