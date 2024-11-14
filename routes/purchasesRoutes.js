module.exports = function(db, io){
    var express = require('express');
    var router = express.Router();
    const purchase = require('../controllers/purchaseController')(db, io)
    const { isLoggedIn, isOperatorPurchase } = require('../helpers/util')(db)

    router.get('/add', isLoggedIn, purchase.addPurchase)
    router.get('/delete/:id', isLoggedIn, isOperatorPurchase, purchase.removePurchase)
    router.get('/edit/:id', isLoggedIn, isOperatorPurchase, purchase.getEdit)
    router.post('/edit/:id', isLoggedIn, isOperatorPurchase, purchase.updatePurchase)
    router.get('/showPurchaseItem/:invoice', isLoggedIn, purchase.showPurchaseItem)
    router.post('/addPurchaseItem', isLoggedIn, purchase.addPurchaseItem)
    router.get('/item/delete/:id', isLoggedIn, purchase.removePurchaseItem)

return router;
}