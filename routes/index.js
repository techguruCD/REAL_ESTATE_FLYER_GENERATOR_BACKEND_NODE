const express = require('express')
const router = express.Router();
const controller = require('../controllers/generate')
const validator = require('../validators/generate')

router.post('/listed', /*validator.listed,*/ controller.generate)
router.post('/notListed', validator.notListed, controller.generate)

module.exports = router;