import 'dotenv/config'

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  HOST: process.env.LOCAL_HOST,
  PORT: process.env.LOCAL_PORT,
  BUILD_MODE: process.env.BUILD_MODE,
  MONGODB_STORE_URI: process.env.MONGODB_STORE_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
}
