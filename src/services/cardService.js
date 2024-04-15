import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { cardModel } from '~/models/cardModel'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/orderModel'

const createNew = async(reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }

    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      getNewCard.cards = []

      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

const getDetails = async(id) => {
  try {
    const card = await cardModel.getDetails(id)
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!')
    }

    const resCard = cloneDeep(card)
    resCard.cards.forEach(card => {
      // card.card = resCard.cards.filter(card => card.cardId.toString() === card._id.toString())
      card.card = resCard.cards.filter(card => card.cardId.equals(card._id))
    })

    delete resCard.cards

    return resCard
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

export const cardService = {
  createNew,
  getDetails
}