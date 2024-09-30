const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
var session = require('express-session');
var flash = require('connect-flash');


app.set('view engine', 'ejs')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(express.json());
app.use(bodyParser.json())
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'mnhc23',
    resave: false,
    saveUninitialized: true
  }))
app.use(flash())

var indexRouter = require('./routes/indexRoutes');
var apiRouter = require('./routes/apiRoutes');
var goodsRouter = require('./routes/goodsRoutes');
var unitsRouter = require('./routes/unitsRoutes');
var supplierRouter = require('./routes/supplierRoutes');
var usersRouter = require('./routes/userRoutes');
var purchasesRouter = require('./routes/purchasesRoutes');


app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/goods', goodsRouter);
app.use('/units', unitsRouter);
app.use('/suppliers', supplierRouter);
app.use('/users', usersRouter);
app.use('/purchases', purchasesRouter);


app.listen(3000, function () {
    console.log('server berjalan di port 3000')
})



