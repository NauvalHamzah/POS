var express = require('express');
var router = express.Router();
const goods = require('../controllers/goodsController')
const unit = require('../controllers/unitController')
const supplier = require('../controllers/supplierController')
const user = require('../controllers/userController')
const { isLoggedIn } = require('../helpers/util')

router.get('/goods', isLoggedIn, goods.getGoods);
router.get('/units', isLoggedIn, unit.getUnit);
router.get('/suppliers', isLoggedIn, supplier.getSupplier);
router.get('/users', isLoggedIn, user.getUser);

module.exports = router;