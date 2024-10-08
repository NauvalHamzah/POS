module.exports = function(db){
    var express = require('express');
    var router = express.Router();
    const purchase = require('../controllers/purchaseController')(db)
    const { isLoggedIn } = require('../helpers/util')

    router.get('/add', isLoggedIn, purchase.addPurchase)
    router.get('/delete/:id', isLoggedIn, purchase.removePurchase)
    router.get('/edit/:id', isLoggedIn, purchase.getEdit)
    router.post('/edit/:id', isLoggedIn, purchase.updatePurchase)
    router.get('/showPurchaseItem/:invoice', isLoggedIn, purchase.showPurchaseItem)
    router.post('/addPurchaseItem', isLoggedIn, purchase.addPurchaseItem)
    router.get('/item/delete/:id', isLoggedIn, purchase.removePurchaseItem)

return router;
}