const express = require('express');
const app = express();
const PORT = 8000;
const db = require('./models');
require('dotenv').config();

const http = require('http');
const session = require('express-session');

const server = http.createServer(app);

//socket.io, session 옵션, 미들웨어 설정
const sessionMiddleware = session({
  secret: 'ras',
  resave: true,
  secure: false,
  saveUninitialized: false,
});
app.use(sessionMiddleware);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require('dotenv').config();

//세션 설정
app.use(
  session({
    secret: 'ras',
    resave: true,
    secure: false,
    saveUninitialized: false,
  }),
);

//정적파일 설정
app.use('/public', express.static(__dirname + '/public'));

//router분리
const router = require('./routes/main');
//라우터
app.use('/', router);

app.use('*', (req, res) => {
  res.status(404).render('404');
});

db.sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});

// server.listen(PORT, () => {
//   console.log(`http://localhost:${PORT}`);
// });
