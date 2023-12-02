const express = require('express')
const router = express.Router();
const controller = require('../controllers/generate')
const validator = require('../validators/generate')

router.post('/listed', validator.listed, controller.listed)
router.post('/notListed', validator.notListed, controller.notListed)

module.exports = router;