import express from 'express'
import { productCustomerRoute } from './productCustomerRoute'
import { authCustomerRoute } from './authCustomerRoute'
import { orderRouter } from './orderRouter'
import { roomchatCustomerRoute } from './roomchatCustomerRoute'
import { messageCustomerRoute } from './messageCustomerRoute'

const Router = express.Router()

Router.use('/auth', authCustomerRoute)

Router.use('/product', productCustomerRoute)

Router.use('/order', orderRouter)

Router.use('/roomchat', roomchatCustomerRoute)

Router.use('/message', messageCustomerRoute)

export const APIs_V2 = Router