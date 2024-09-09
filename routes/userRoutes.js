var express = require('express');
var router = express.Router();
const user = require('../controllers/userController')
const { isLoggedIn } = require('../helpers/util')

router.get('/add', isLoggedIn, user.addUser)
router.post('/add', isLoggedIn, user.saveUser)
router.get('/delete/:id', isLoggedIn, user.removeUser)
router.get('/edit/:id', isLoggedIn, user.getEdit)
router.post('/edit/:id', isLoggedIn, user.updateUser)

module.exports = router;
