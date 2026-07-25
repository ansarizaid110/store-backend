const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const connectionPool = require('./database/connectionPool');

const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const apiRouter = require('./routes/index');

connectionPool.init();

app.use(logger('dev'));

// Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Application Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.use('/api', apiRouter);

// Export the app instance
module.exports = app;