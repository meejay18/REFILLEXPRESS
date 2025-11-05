const express = require ('express');
const { vendorAuthentication } = require ('../middleware/authentication');
const { updateVendorSettings } = require('../controller/vendorSettingsController');
const router =   express.Router();




router.put('vendor/:vendorId/settings',vendorAuthentication, updateVendorSettings )












module.exports = router