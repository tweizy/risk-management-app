const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const riskRoutes = require('./routes/risks');
const notificationRoutes = require('./routes/notifications');
require('dotenv').config();

const app = express();
app.use(cors());  
app.use(bodyParser.json());

// API Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', riskRoutes);
app.use('/api', notificationRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await sequelize.authenticate();
  console.log('Database connected!');
});
