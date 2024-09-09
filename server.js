const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
var session = require('express-session');
var flash = require('connect-flash');


app.set('view engine', 'ejs')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

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
var usersRouter = require('./routes/userRoutes');
var usersapiRouter = require('./routes/usersapi');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/usersapi', usersapiRouter);

app.listen(3000, function () {
    console.log('server berjalan di port 3000')
})



