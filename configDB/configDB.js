const mysql = require("mysql2");

const connection = mysql.createPool({
    host: "localhost",
    user: 'root',
    database: 'project_final',
    password: '',
}) ;
module.exports = connection.promise();

