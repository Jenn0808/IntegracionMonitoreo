const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'jen.lu0408',
    database: 'orquideas'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado a MySQL');
});

module.exports = connection;
