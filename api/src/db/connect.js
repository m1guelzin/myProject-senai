const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'root',
    password:'4559',
    database:'senai'
})

module.exports = pool;