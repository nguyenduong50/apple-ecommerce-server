import { StatusCodes } from 'http-status-codes'
import { orderService } from '~/services/orderService'

const createNew = async(req, res, next) => {
  try {
    const createNewOrder = await orderService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createNewOrder)
  } catch (error) {
    next(error)
  }
}

const getDetails = async(req, res, next) => {
  try {
    const order = await orderService.getDetails(req.params.id)
    res.status(StatusCodes.OK).json(order)
  } catch (error) {
    next(error)
  }
}

export const orderController = {
  createNew,
  getDetails
}
