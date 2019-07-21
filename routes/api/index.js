const router = require('express').Router();
const authRoutes = require('./auth');
const taskRoutes = require("./task");
const userRoutes = require("./user");

router.use('/auth', authRoutes);
router.use("/task", taskRoutes);
router.use("/user", userRoutes);

module.exports = router;
