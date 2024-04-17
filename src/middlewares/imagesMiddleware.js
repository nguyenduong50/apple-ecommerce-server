import multer from 'multer'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
    cb(null, file.originalname.split('.')[0] + '-' + uniqueSuffix + ext)
  }
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

export const uploadImage = multer({ storage: storage, fileFilter: fileFilter }).array('images', 10)

export const imagesMiddleware = (req, res, next) => {
  if (req.files.length === 0) {
    return next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'ValidationError: Please upload images product!'))
  }

  next()
}