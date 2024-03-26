const mysql = require('mysql');
const dbConfig = require('../configs/database');

const pool = mysql.createPool(dbConfig);

module.exports = async (req, res, next) => {
    try {
        const sql = 'SELECT * FROM endpoints';
        pool.query(sql, (error, results) => {
            if (error) {
                console.error('Error fetching endpoints from database:', error);
                res.status(500).json({ error: 'Failed to fetch endpoints from database' });
            } else {
                req.endpoints = results;
                next();
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};