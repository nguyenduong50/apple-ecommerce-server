import express from 'express'
import { homeController } from '~/controllers/homeController'

const Router = express.Router()

Router.route('/')
  .get(homeController.getHomeInfo)

export const homeRoute = Router
