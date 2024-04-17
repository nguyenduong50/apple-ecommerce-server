import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { userModel } from '~/models/userModel'

const getList = async() => {
  try {
    const users = await userModel.getList()
    if (!users) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'No users have been created yet!')
    }

    return users
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

const createNew = async(reqBody) => {
  try {
    const createdUser = await userModel.createNew(reqBody)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)
    return getNewUser
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

const update = async(userId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    return await userModel.update(userId, updateData)
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

export const userService = {
  getList,
  createNew,
  update
}