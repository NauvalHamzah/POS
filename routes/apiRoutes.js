var express = require('express');
var router = express.Router();
const user = require('../controllers/userController')
const unit = require('../controllers/unitController')
const goods = require('../controllers/goodsController')
const { isLoggedIn } = require('../helpers/util')


router.get('/users', isLoggedIn, user.getUser);
router.get('/units', isLoggedIn, unit.getUnit);
router.get('/goods', isLoggedIn, goods.getGoods);


module.exports = router;