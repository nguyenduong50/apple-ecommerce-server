import express from 'express'
import { userRoute } from './userRoute'
import { productRoute } from './productRoute'

const Router = express.Router()

Router.use('/user', userRoute)

Router.use('/product', productRoute)

export const APIs_V1 = Router