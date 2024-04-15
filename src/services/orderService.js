import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { orderModel } from '~/models/orderModel'

const createNew = async(reqBody) => {
  try {
    const createdOrder = await orderModel.createNew(reqBody)
    const getNewOrder = await orderModel.findOneById(createdOrder.insertedId)

    return getNewOrder
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

const getDetails = async(id) => {
  try {
    const order = await orderModel.getDetails(id)
    if (!order) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found!')
    }

    return order
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

export const orderService = {
  createNew,
  getDetails
}