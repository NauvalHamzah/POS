module.exports = function(db){

    var express = require('express');
    var router = express.Router();
    const user = require('../controllers/userController')(db)
    const { isLoggedIn } = require('../helpers/util')

    router.get('/add', isLoggedIn, user.addUser)
    router.post('/add', isLoggedIn, user.saveUser)
    router.get('/delete/:id', isLoggedIn, user.removeUser)
    router.get('/edit/:id', isLoggedIn, user.getEdit)
    router.post('/edit/:id', isLoggedIn, user.updateUser)
    router.get('/profile', isLoggedIn, user.getProfile)
    router.post('/profile', isLoggedIn, user.updateProfile)
    router.get('/changepassword', isLoggedIn, user.getChangePassword)
    router.post('/changepassword', isLoggedIn, user.updateChangePassword)

return router;
}