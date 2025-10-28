const express = require ('express');
// const { vendorAuthentication } = require ('../middleware/authentication');
const {RiderSignUp} = require('../controller/riderController');

const router = express.Router();

router.post('/rider', RiderSignUp)

module.exports = router