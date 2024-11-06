module.exports = function(db){
    var express = require('express');
    var router = express.Router();
    const sale = require('../controllers/saleController')(db)
    const { isLoggedIn, isOperatorSale } = require('../helpers/util')(db)

    router.get('/add', isLoggedIn, sale.addSale)
    router.get('/delete/:id', isLoggedIn, isOperatorSale, sale.removeSale)
    router.get('/edit/:id', isLoggedIn, isOperatorSale, sale.getEdit)
    router.post('/edit/:id', isLoggedIn, isOperatorSale, sale.updateSale)
    router.get('/showSaleItem/:invoice', isLoggedIn, sale.showSaleItem)
    router.post('/addSaleItem', isLoggedIn, sale.addSaleItem)
    router.get('/item/delete/:id', isLoggedIn, sale.removeSaleItem)

return router;
}