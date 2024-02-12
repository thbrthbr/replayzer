const development = {
  username: 'news',
  password: '1234',
  database: 'replayzer',
  host: '127.0.0.1',
  dialect: 'mysql',
  timezone: '+09:00',
};
const test = {
  username: 'root',
  password: null,
  database: 'database_test',
  host: '127.0.0.1',
  dialect: 'mysql',
  timezone: '+09:00',
};
const production = {
  username: process.env.DB_USER,
  password: process.env.DB_PW,
  database: 'production',
  host: 'kdt-lecture-test.c0m1fdifsbpq.us-east-2.rds.amazonaws.com',
  dialect: 'mysql',
  timezone: '+09:00',
};

module.exports = { production };
