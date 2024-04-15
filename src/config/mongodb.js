import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'

let database_instance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DATABASE = async() => {
  await mongoClientInstance.connect()

  database_instance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const GET_DATABASE = () => {
  if (!database_instance) throw new Error('Must connect to Database first')
  return database_instance
}

export const CLOSE_DATABASE = async() => {
  await mongoClientInstance.close()
}