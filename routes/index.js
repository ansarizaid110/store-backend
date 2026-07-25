const express = require('express');
const apiRouter = express.Router();
const userRoutes = require('./users');
const categoryRoutes = require('./categories');
const productRoutes = require('./products');
const guard = require("../guard/authGuard");
const authRoutes = require('./auth');

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', guard, userRoutes);
apiRouter.use('/categories', guard, categoryRoutes);
apiRouter.use('/products', guard, productRoutes);

module.exports = apiRouter;