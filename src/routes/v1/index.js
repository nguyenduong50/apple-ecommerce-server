import express from 'express'
import { authRoute } from './authRouter'
import { userRoute } from './userRoute'
import { productRoute } from './productRoute'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.use('/auth', authRoute)

Router.use('/user', authMiddleware, userRoute)

Router.use('/product', authMiddleware, productRoute)

export const APIs_V1 = Router