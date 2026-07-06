const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const attendanceRoutes = require('./routes/attendance');
const transactionRoutes = require('./routes/transactions');
const settingRoutes = require('./routes/settings');
const productRoutes = require('./routes/products');
const vehicleTypeRoutes = require('./routes/vehicleTypes');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/vehicle-types', vehicleTypeRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/health', (req, res) => res.json({ success: true, message: 'OK' }));

sequelize.authenticate().then(() => {
  console.log('Database connected');
}).catch(err => {
  console.warn('DB connection warning:', err.message);
});

module.exports = app;
