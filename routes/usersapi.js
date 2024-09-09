var express = require('express');
var router = express.Router();
const user = require('../controllers/userController')
const { isLoggedIn } = require('../helpers/util')

router.get('/', isLoggedIn, user.getUser);

module.exports = router;