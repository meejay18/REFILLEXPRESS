const { RiderKyc } = require('../models')
const { Rider } = require('../models')
const cloudinary = require('../config/cloudinary')

exports.submitRiderKyc = async (req, res, next) => {
  const { riderId } = req.params
  const files = req.files
  try {
    const {
      city,
      residentialAddress,
      state,
      contactName,
      contactPhone,
      vehicleType,
      vehicleMake,
      vehicleModel,
      year,
      registrationNumber,
      licensePlate,
      accountHolderName,
      bankName,
      accountNumber,
    } = req.body

    const kyc = await RiderKyc.findOne({
      where: {  riderId },
      include: [
        {
          model: Rider,
          as: 'rider',
          attributes: ['firstName', 'lastName', 'email'],
        },
      ],
    })

    if (kyc) {
      return res.status(404).json({
        message: 'Kyc already exists for this rider',
      })
    }

    const driversLicenseImage = await cloudinary.uploader.upload(files['driversLicense'][0].path)
    const vehicleRegistrationImage = await cloudinary.uploader.upload(files['vehicleRegistration'][0].path)
    const ownerIdCardImage = await cloudinary.uploader.upload(files['ownerIdCard'][0].path)
    const utilityBillImage = await cloudinary.uploader.upload(files['utilityBill'][0].path)

    const newKyc = await RiderKyc.create({
      riderId,
      city,
      residentialAddress,
      state,
      contactName,
      contactPhone,
      vehicleType,
      vehicleMake,
      vehicleModel,
      year,
      registrationNumber,
      licensePlate,
      accountHolderName,
      bankName,
      accountNumber,
      driversLicense: driversLicenseImage.secure_url,
      vehicleRegistration: vehicleRegistrationImage.secure_url,
      ownerIdCard: ownerIdCardImage.secure_url,
      utilityBill: utilityBillImage.secure_url,
    })

    return res.status(200).json({
      message: 'Rider kyc submitted',
      data: newKyc,
    })
  } catch (error) {
    next(error)
  }
}
