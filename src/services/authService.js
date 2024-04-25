import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import jwt from 'jsonwebtoken'
import { userModel } from '~/models/userModel'
import { compare } from 'bcryptjs'
import { env } from '~/config/environment'
import { ROLE } from '~/utils/constants'

const login = async(reqBody) => {
  try {
    const { email, password } = reqBody

    const user = await userModel.findOneByEmail(email)

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not existed!')
    }

    const isCompare = await compare(password, user.password)

    if (!isCompare) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Wrong Password!')
    }

    if (user.role === ROLE.CUSTOMER) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Forbidden!')
    }

    const accessToken = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString()
      },
      env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    )

    return { accessToken, userId: user._id.toString(), user }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

const loginClient = async(reqBody) => {
  try {
    const { email, password } = reqBody

    const user = await userModel.findOneByEmail(email)

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not existed!')
    }

    const isCompare = await compare(password, user.password)

    if (!isCompare) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Wrong Password!')
    }

    if (user.role !== ROLE.CUSTOMER) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Forbidden!')
    }

    const accessToken = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString()
      },
      env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    )

    return { accessToken, userId: user._id.toString(), user }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

const register = async(reqBody) => {
  try {
    const { email } = reqBody

    const user = await userModel.findOneByEmail(email)

    if (user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User existed!')
    }

    const createdUser = await userModel.createNew(reqBody)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    const accessToken = jwt.sign(
      {
        email: getNewUser.email,
        userId: getNewUser._id.toString()
      },
      env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    )

    return { accessToken, userId: getNewUser._id.toString(), user: getNewUser }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

export const authService = {
  login,
  loginClient,
  register
}