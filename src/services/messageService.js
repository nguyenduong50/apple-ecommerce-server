import { StatusCodes } from 'http-status-codes'
import { messageModel } from '~/models/messageModel'
import ApiError from '~/utils/ApiError'

const getMessagesByRoom = async(reqBody) => {
  try {
    const messages = await messageModel.getMessagesByRoom(reqBody)
    if (!messages) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'No messages have been created yet!')
    }

    return messages
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

const createNew = async(reqBody) => {
  try {
    return await messageModel.createNew(reqBody)
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

export const messageService = {
  getMessagesByRoom,
  createNew
}