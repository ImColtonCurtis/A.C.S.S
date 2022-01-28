const express = require('express'); // Import express again to use its packages (Router)


const router = express.Router();

const usersController = require('../controllers/users-controller');


router.get('/', usersController.getUsers);

router.post('/signup', usersController.signup);

router.post('/login', usersController.login);

module.exports = router; // Export the configured router object