/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import { CONNECT_DATABASE, CLOSE_DATABASE } from '~/config/mongodb'
import exitHook from 'async-exit-hook'
import { env } from './config/environment'
import { APIs_V1 } from './routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()

  app.use(cors(corsOptions))

  //Enable request body json data
  app.use(express.json())

  //Router V1
  app.use('/v1', APIs_V1)

  //Middleware
  app.use(errorHandlingMiddleware)

  app.listen(env.LOCAL_PORT, env.LOCAL_HOST, () => {
    // console.log(await GET_DATABASE().listCollections().toArray())
    console.log(`Running server at http://${ env.LOCAL_HOST }:${ env.LOCAL_PORT }/`)
  })

  exitHook(() => {
    console.log('Close connect Database')
    CLOSE_DATABASE()
  })
}

// CONNECT_DATABASE()
//   .then(() => console.log('Connected to Mongo Cloud Atlas'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.log(error)
//     process.exit(0)
//   })

(async () => {
  try {
    await CONNECT_DATABASE()
    START_SERVER()
  } catch (error) {
    console.log(error)
  }
})()
