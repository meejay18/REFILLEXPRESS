const cloudinary = require('../config/cloudinary')
const emailSender = require('../middleware/nodemailer')
const { VendorKyc, Vendor } = require('../models')
const { kycVerificationTemplate } = require('../utils/emailTemplate')

exports.submitVendorKyc = async (req, res, next) => {
  const files = req.files
  const { vendorId, bankAccountName, bankName, accountNumber } = req.body
  try {
    const vendor = await VendorKyc.findOne({ where: { vendorId } })
    if (vendor) {
      return res.status(404).json({
        message: 'Kyc already exists for this vendor',
      })
    }

    const businessLicenseUpload = await cloudinary.uploader.upload(files['businessLicense'][0].path)
    const taxRegistrationCertificateUpload = await cloudinary.uploader.upload(
      files['taxRegistrationCertificate'][0].path
    )
    const nationalIdUpload = await cloudinary.uploader.upload(files['nationalId'][0].path)
    const businessInsuranceUpload = await cloudinary.uploader.upload(files['businessInsurance'][0].path)

    const kyc = await VendorKyc.create({
      vendorId,
      businessLicense: businessLicenseUpload.secure_url,
      taxRegistrationCertificate: taxRegistrationCertificateUpload.secure_url,
      nationalId: nationalIdUpload.secure_url,
      businessInsurance: businessInsuranceUpload.secure_url,
      bankAccountName,
      bankName,
      accountNumber,
    })

    return res.status(201).json({
      message: 'Kyc created successfully',
      data: kyc,
    })
  } catch (error) {
    next(error)
  }
}

exports.updateVendorKyc = async (req, res, next) => {
  const { vendorId } = req.params
  const files = req.files
  const { bankAccountName, bankName, accountNumber, automaticPayouts } = req.body

  try {
    const kyc = await VendorKyc.findOne({ where: { vendorId } })
    if (!kyc) {
      return res.status(404).json({
        message: 'Kyc not found for this vendor',
      })
    }

    if (kyc.verificationStatus === 'verified') {
      return res.status(403).json({
        message: 'Kyc is already verified and cannot be updated',
      })
    }
    if (kyc.verificationStatus === 'pending') {
      return res.status(403).json({
        message: 'Kyc is under review and cannot be updated',
      })
    }

    const updates = {}

    if (files['businessLicense']) {
      const upload = await cloudinary.uploader.upload(files['businessLicense'][0].path)
      updates.businessLicense = upload.secure_url
    }

    if (files['taxRegistrationCertificate']) {
      const upload = await cloudinary.uploader.upload(files['taxRegistrationCertificate'][0].path)
      updates.taxRegistrationCertificate = upload.secure_url
    }
    if (files['nationalId']) {
      const upload = await cloudinary.uploader.upload(files['nationalId'][0].path)
      updates.nationalId = upload.secure_url
    }
    if (files['businessInsurance']) {
      const upload = await cloudinary.uploader.upload(files['businessInsurance'][0].path)
      updates.businessInsurance = upload.secure_url
    }

    if (bankAccountName) updates.bankAccountName = bankAccountName
    if (bankName) updates.bankName = bankName
    if (accountNumber) updates.accountNumber = accountNumber
    if (automaticPayouts !== undefined) updates.automaticPayouts = automaticPayouts

    await kyc.update(updates)

    return res.status(200).json({
      message: 'Kyc updated successfully',
      data: kyc,
    })
  } catch (error) {
    next(error)
  }
}

exports.verifyVendorKyc = async (req, res, next) => {
  const { vendorId } = req.params
  const { verificationStatus } = req.body

  try {
    const status = ['verified', 'rejected']

    if (!status.includes(verificationStatus)) {
      return res.status(400).json({
        message: 'Invalid validation status',
      })
    }

    const kyc = await VendorKyc.findOne({
      where: { vendorId },
      include: [
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['businessEmail', 'businessName'],
        },
      ],
    })

    if (!kyc) {
      return res.status(404).json({
        message: 'Kyc record not found for this vendor',
      })
    }

    if (kyc.verificationStatus === 'verified') {
      return res.status(403).json({
        message: 'Kyc is already verified',
      })
    }

    await kyc.update({ verificationStatus })

    const vendorEmail = await kyc.vendor.businessEmail
    const vendorName = await kyc.vendor.businessName

    const emailOptions = {
      email: vendorEmail,
      subject: 'Verification Status Mail',
      html: kycVerificationTemplate(verificationStatus, vendorName),
    }

    await emailSender(emailOptions)

    return res.status(200).json({
      message: 'Kyc updated successfully',
      data: kyc,
    })
  } catch (error) {
    next(error)
  }
}

exports.getAllvendorKyc = async (req, res, next) => {
  try {
    const vendors = await Vendor.findAll()

    if (vendors.length === 0) {
      return res.status(404).json({
        message: 'No vendors found',
        data: [],
      })
    }
    return res.status(200).json({
      message: 'Vendors retrieved successfully',
      data: vendors,
    })
  } catch (error) {
    next(error)
  }
}


exports.getOneVendorKyc = async (req, res, next) => {
  const { vendorId } = req.params
  try {
    const vendor = await Vendor.findByPk(vendorId)
    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not foound',
      })
    }

    return res.status(200).json({
      message: 'Vendor retrieved successfully',
      data: vendor,
    })
  } catch (error) {
    next(error)
}
}