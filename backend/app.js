const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const storeRoutes = require('./routes/storeRoutes');
const priceComparisonRoutes = require('./routes/priceComparisonRoutes');
const reportIssueRoutes = require('./routes/reportIssueRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/price-comparison', priceComparisonRoutes);
app.use('/api/report-issue', reportIssueRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
