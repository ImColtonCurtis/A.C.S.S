const express = require('express'); // Import express again to use its packages (Router)


const router = express.Router();

const dataController = require('../controllers/data-controller');




router.get('/getData', dataController.getData);


module.exports = router; // Export the configured router object