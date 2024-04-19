import express from 'express'
import { userRouteCustom } from './userRouteCustom'
// import { productRoute } from './productRoute'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.use('/user', authMiddleware, userRouteCustom)

// Router.use('/product', productRoute)

export const APIs_V2 = Router