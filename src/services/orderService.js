import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { orderModel } from '~/models/orderModel'
import { sendEmail } from '~/utils/sendEmail'
import { GET_DATABASE } from '~/config/mongodb'
import { userModel } from '~/models/userModel'

const getList = async() => {
  try {
    const orders = await orderModel.getList()
    if (!orders) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'No orders have been created yet!')
    }

    return orders
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

const getListByUser = async(req) => {
  try {
    const accessToken = req.cookies.accessToken
    const sessions = await GET_DATABASE().collection('sessions').find().toArray()
    const session = sessions.find((session) => {
      return session.session.accessToken === accessToken
    })

    const user = await userModel.findOneById(session.session.userId)

    let orders = await orderModel.getList()
    if (!orders) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'No orders have been created yet!')
    }

    orders = orders.filter(order => order.userId.toString() === user._id.toString())

    return orders
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

const createNew = async(reqBody) => {
  try {
    let totalOrder = reqBody.productOrder.reduce((total, currentValue) => {
      return total + currentValue.totalPrice
    }, 0)

    const order = {
      ...reqBody,
      totalOrder: totalOrder
    }

    const createdOrder = await orderModel.createNew(order)
    const getNewOrder = await orderModel.findOneById(createdOrder.insertedId)
    sendEmail(getNewOrder)
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
  getList,
  getListByUser,
  createNew,
  getDetails
}