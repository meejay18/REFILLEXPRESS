exports.submitRiderKyc = async (req, res, next) => {
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
    driversLicense,
    vehicleRegistration,
    ownerIdCard,
    utilityBill,
  } = req.body
  } catch (error) {
    next(error)
  }
}
