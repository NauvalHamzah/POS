var express = require('express');
var router = express.Router();
const goods = require('../controllers/goodsController')
const { isLoggedIn } = require('../helpers/util')
const multer = require('multer');
const path = require('path');

const uploadFolder = path.join(__dirname, '..', 'public', 'images');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });

const upload = multer({ storage });


router.get('/add', isLoggedIn, goods.addGoods)
router.post('/add', isLoggedIn, upload.single('picture'), goods.saveGoods)
router.get('/delete/:id', isLoggedIn, goods.removeGoods)
router.get('/edit/:id', isLoggedIn, goods.getEdit)
router.post('/edit/:id', isLoggedIn, upload.single('picture'), goods.updateGoods)

module.exports = router;
