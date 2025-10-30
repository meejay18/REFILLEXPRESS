const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const allowedFormats = ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx']

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const fileExtension = file.originalname.split('.').pop().toLowerCase()
    const isImage = ['jpg', 'jpeg', 'png'].includes(fileExtension)

    return {
      folder: 'refill_express_uploads',
      allowed_formats: allowedFormats,
      resource_type: isImage ? 'image' : 'raw',
      public_id: `${file.originalname.split('.')[0]}-${Date.now()}`,
    }
  },
})

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 2 } })

module.exports = upload
