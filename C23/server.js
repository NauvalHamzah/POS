const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const pos = require('./controllers/posController')
var session = require('express-session');
const { isLoggedIn } = require('./helpers/util')
var flash = require('connect-flash');


app.set('view engine', 'ejs')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'mnhc23',
    resave: false,
    saveUninitialized: true
  }))
app.use(flash())

app.get('/', pos.loginGet)
app.post('/login', pos.login)
app.get('/logout', pos.logout)

app.get('/dashboard', isLoggedIn, pos.dashboard)
app.get('/goodsUtility/utility1', isLoggedIn, pos.goodsUtil1)
app.get('/goodsUtility/utility2', isLoggedIn, pos.goodsUtil2)
app.get('/goodsUtility/utility3', isLoggedIn, pos.goodsUtil3)
app.get('/suppliers', isLoggedIn, pos.suppliers)
app.get('/customers', isLoggedIn, pos.customers)
app.get('/users', isLoggedIn, pos.users)
app.get('/purchases', isLoggedIn, pos.purchases)
app.get('/sales', isLoggedIn, pos.sales)



app.listen(3000, function () {
    console.log('server berjalan di port 3000')
})



