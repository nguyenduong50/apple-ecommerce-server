/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import { CONNECT_DATABASE, CLOSE_DATABASE } from '~/config/mongodb'
import exitHook from 'async-exit-hook'
import { env } from './config/environment'
import { APIs_V1 } from './routes/v1'
import { APIs_V2 } from './routes/v2'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import session from 'express-session'
import { default as connectMongoDBSession } from 'connect-mongodb-session'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'

const MongoDBStore = connectMongoDBSession(session)
const store = new MongoDBStore({
  uri: env.MONGODB_STORE_URI,
  collection: 'sessions'
})
const csrfProtection = csrf()

const START_SERVER = async() => {
  const app = express()

  //Enable request body json data
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  //Cors - Cookies
  app.use(cors(corsOptions))
  app.use(cookieParser())

  //Static file
  app.use(express.static('public'))

  //Session
  app.use(
    session({
      secret: 'nguyenduongSecret',
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: {
        expires: 1000*60*60,
        httpOnly: true
      }
    })
  )

  //CSRF
  // app.use(csrfProtection)

  //Router
  app.use('/v1', APIs_V1)
  app.use('/v2', APIs_V2)

  //Middleware
  app.use(errorHandlingMiddleware)

  //Config Socket IO
  const httpServer = createServer(app)
  const io = new Server(
    httpServer,
    {
      cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        methods: ['GET', 'POST']
      }
    }
  )

  io.on('connection', (socket) => {
    socket.on('join-room', (data) => {
      socket.leave(socket.id)
      socket.join(data)
      console.log('join-room')
      // const rooms = Array.from(socket.rooms)
      // console.log(rooms)
      // if (!roomSockets[room]) {
      //   roomSockets[room] = [];
      // }
      // roomSockets[room].push(socket.id);
      // console.log(`User ${socket.id} joined room: ${room}`);
      // // Log all rooms and their occupants
      // console.log("Rooms and their occupants:", roomSockets);
    })

    socket.on('leave-room', (room) => {
      socket.leave(room)
      console.log('leave-room')
      // const rooms = Array.from(socket.rooms)
      // console.log(rooms)
    })

    // socket.on('leaveAllRooms', () => {
    //   const rooms = Object.keys(socket.rooms);
    //   rooms.forEach((room) => {
    //       if (room !== socket.id) { // Exclude the socket's own room
    //           socket.leave(room);
    //           console.log(`User ${socket.id} left room: ${room}`);
    //       }
    //   });
    // });

    socket.on('send-message', (data) => {
      socket.to(data.roomId).emit('response-message', data)
    })

    socket.on('disconnect', () => {
      console.log('disconnect')
    })
  })

  httpServer.listen(env.LOCAL_PORT, env.LOCAL_HOST, () => {
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
