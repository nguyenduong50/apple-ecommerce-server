import express from 'express'
import { userRoute } from './userRoute'
import { productRoute } from './productRoute'
import { orderRoute } from './orderRoute'
import { sessionRoute } from './sessionRoute'

const Router = express.Router()

Router.use('/user', userRoute)

Router.use('/product', productRoute)

Router.use('/order', orderRoute)

Router.use('/session', sessionRoute)

export const APIs_V1 = Router