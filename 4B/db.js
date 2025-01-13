const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: '127.0.0.1',
  database: 'db_provinsi_kabupaten',
  password: '111',
  port: 7000,
});

module.exports = pool;
