import { StatusCodes } from 'http-status-codes'
import { messageService } from '~/services/messageService'

const getMessagesByRoom = async(req, res, next) => {
  try {
    const messages = await messageService.getMessagesByRoom(req.body)
    res.status(StatusCodes.OK).json(messages)
  } catch (error) {
    next(error)
  }
}

const createNew = async(req, res, next) => {
  try {
    const createMessage = await messageService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createMessage)
  } catch (error) {
    next(error)
  }
}

export const messageController = {
  getMessagesByRoom,
  createNew
}
