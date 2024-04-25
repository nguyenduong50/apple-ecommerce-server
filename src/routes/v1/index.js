import express from 'express'
import { authRoute } from './authRouter'
import { userRoute } from './userRoute'
import { productRoute } from './productRoute'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { authorizeMiddleware } from '~/middlewares/authorizeMiddleware'
import { orderRoute } from './orderRoute'

const Router = express.Router()

Router.use('/auth', authRoute)

Router.use('/user', authMiddleware, authorizeMiddleware, userRoute)

Router.use('/product', authMiddleware, authorizeMiddleware, productRoute)

Router.use('/order', authMiddleware, orderRoute)

export const APIs_V1 = Router