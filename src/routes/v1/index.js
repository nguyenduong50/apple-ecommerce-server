import express from 'express'
import { authRoute } from './authRouter'
import { userRoute } from './userRoute'
import { productRoute } from './productRoute'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { authorizeMiddleware } from '~/middlewares/authorizeMiddleware'
import { orderRoute } from './orderRoute'
import { homeRoute } from './homeRoute'
import { roomchatRoute } from './roomchatRoute'
import { messageRoute } from './messageRoute'

const Router = express.Router()

Router.use('/auth', authRoute)

Router.use('/user', authMiddleware, authorizeMiddleware, userRoute)

Router.use('/product', authMiddleware, authorizeMiddleware, productRoute)

Router.use('/order', authMiddleware, orderRoute)

Router.use('/home', authMiddleware, homeRoute)

Router.use('/roomchat', authMiddleware, roomchatRoute)

Router.use('/message', authMiddleware, messageRoute)

export const APIs_V1 = Router