var express = require('express');
var router = express.Router();
const unit = require('../controllers/unitController')
const { isLoggedIn } = require('../helpers/util')

router.get('/add', isLoggedIn, unit.addUnit)
router.post('/add', isLoggedIn, unit.saveUnit)
router.get('/delete/:id', isLoggedIn, unit.removeUnit)
router.get('/edit/:id', isLoggedIn, unit.getEdit)
router.post('/edit/:id', isLoggedIn, unit.updateUnit)

module.exports = router;
