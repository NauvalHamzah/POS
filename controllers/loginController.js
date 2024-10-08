module.exports = function(db){

    const User = require('../models/UserModel')(db)
    const bcrypt = require('bcrypt');

    function loginGet(req, res) {
        res.render('login', {
            failedMessage: req.flash('failedMessage'),
            successMessage: req.flash('successMessage')
        })
    }

    function login(req, res){
        const { email, password } = req.body
        User.getUser(email, function(user){
            if (!user[0]) {
                console.log("No email")
                req.flash('failedMessage', `User with email ${email} is not registered.`)
                res.redirect('/')
            } else{
                    if (bcrypt.compareSync(password, user[0].password)) {
                        req.session.user = { id: user[0].userid, email: user[0].email, name: user[0].name }
                        res.redirect('/dashboard')
                    } else {
                        req.flash('failedMessage', 'password is wrong')
                        res.redirect('/')
                    }
            }
        })
    }

    function logout(req, res) {
        req.session.destroy(function (err) {
            res.redirect('/')
        })
    }

return { loginGet, login, logout }
}