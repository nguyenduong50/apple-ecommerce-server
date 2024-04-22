import express from 'express'
import { authRoute } from './authRouter'
import { userRoute } from './userRoute'
import { productRoute } from './productRoute'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { authorizeMiddleware } from '~/middlewares/authorizeMiddleware'

const Router = express.Router()

Router.use('/auth', authRoute)

Router.use('/user', authMiddleware, authorizeMiddleware, userRoute)

Router.use('/product', authMiddleware, authorizeMiddleware, productRoute)

export const APIs_V1 = Router