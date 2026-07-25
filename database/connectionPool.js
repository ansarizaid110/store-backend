const mysql = require('mysql2');
const dbConfig = require("./dbconfig");

const connectionPool = {
    pool: null,

    init: function() {
        this.pool = mysql.createPool(dbConfig);
    },
    
    getPool: function() {
        return this.pool;
    }
}

module.exports = connectionPool;