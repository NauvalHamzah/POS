require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
var session = require('express-session');
var flash = require('connect-flash');

const { Pool } = require ('pg')
 
const db = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
})

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

var indexRouter = require('./routes/indexRoutes')(db);
var apiRouter = require('./routes/apiRoutes')(db);
var goodsRouter = require('./routes/goodsRoutes')(db);
var unitsRouter = require('./routes/unitsRoutes')(db);
var supplierRouter = require('./routes/supplierRoutes')(db);
var customerRouter = require('./routes/customerRoutes')(db);
var usersRouter = require('./routes/userRoutes')(db);
var purchasesRouter = require('./routes/purchasesRoutes')(db);
var salesRouter = require('./routes/salesRoutes')(db);


app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/goods', goodsRouter);
app.use('/units', unitsRouter);
app.use('/suppliers', supplierRouter);
app.use('/customers', customerRouter);
app.use('/users', usersRouter);
app.use('/purchases', purchasesRouter);
app.use('/sales', salesRouter);


app.listen(3000, function () {
    console.log('server berjalan di port 3000')
})



