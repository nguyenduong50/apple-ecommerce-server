import express from 'express'
import { productCustomerRoute } from './productCustomerRoute'
import { authCustomerRoute } from './authCustomerRoute'
import { orderRouter } from './orderRouter'

const Router = express.Router()

Router.use('/auth', authCustomerRoute)

Router.use('/product', productCustomerRoute)

Router.use('/order', orderRouter)

export const APIs_V2 = Router