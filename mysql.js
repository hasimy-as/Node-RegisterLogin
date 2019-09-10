const mysql = require("mysql");

conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodemysql"
});

conn.connect((err) => {
    if (err) throw err;
    else {
        console.log("Database connected!");
    }
});

module.exports = conn;