var express = require('express');
var router = express.Router();
const login = require('../controllers/loginController')
const menu = require('../controllers/menuController')
const { isLoggedIn } = require('../helpers/util')

router.get('/', login.loginGet)
router.post('/login', login.login)
router.get('/logout', login.logout)

router.get('/dashboard', isLoggedIn, menu.dashboard)
router.get('/goodsUtility/utility1', isLoggedIn, menu.goodsUtil1)
router.get('/goodsUtility/utility2', isLoggedIn, menu.goodsUtil2)
router.get('/goodsUtility/utility3', isLoggedIn, menu.goodsUtil3)
router.get('/suppliers', isLoggedIn, menu.suppliers)
router.get('/customers', isLoggedIn, menu.customers)
router.get('/users', isLoggedIn, menu.users)
router.get('/purchases', isLoggedIn, menu.purchases)
router.get('/sales', isLoggedIn, menu.sales)

module.exports = router;