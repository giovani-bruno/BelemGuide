const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });

const db = mysql.createConnection("mysql://momy5bktd24w0xqt:q0tdztpnzx9qbiqd@i5x1cqhq5xbqtv00.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/xz93eq2c3k1o4qah");

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MySQL conectado");
    }
});

module.exports = db;
