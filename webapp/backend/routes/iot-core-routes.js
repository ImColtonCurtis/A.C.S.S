const express = require('express'); // Import express again to use its packages (Router)


const router = express.Router();

const iotCoreController = require('../controllers/iot-core-controller');




router.post('/livestreamOn', iotCoreController.livestreamOn);
router.post('/livestreamOff', iotCoreController.livestreamOff);

module.exports = router; // Export the configured router object