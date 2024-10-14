var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var flash = require('express-flash');
var session = require('express-session');
const MemoryStore = require('session-memory-store')(session);

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var dosenRouter = require('./routes/dosen');
var mahasiswaRouter = require('./routes/mahasiswa');
var jurusanRouter = require('./routes/jurusan');
var prodiRouter = require('./routes/prodi');
var kelasRouter = require('./routes/kelas');
var matakuliahRouter = require('./routes/matakuliah');
var ruanganRouter = require('./routes/ruangan');
const { memoryStorage } = require('multer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookie: {
    maxAge: 60000000000,
    secure: false,
    httpOnly: true,
    sameSite: 'strict',
    //domain: 'domainkitananti.com'
  },
  store: new MemoryStore(),
  saveUninitialized: true,
  resave: false,
  secret: 'secret'
}));

app.use(flash());

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/dosen', dosenRouter,);
app.use('/mahasiswa', mahasiswaRouter);
app.use('/jurusan', jurusanRouter);
app.use('/prodi', prodiRouter);
app.use('/kelas', kelasRouter);
app.use('/matakuliah', matakuliahRouter);
app.use('/ruangan', ruanganRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
