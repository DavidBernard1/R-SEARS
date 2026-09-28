const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const pool = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const driverRoutes = require('./routes/driver.routes');
const incidentRoutes = require('./routes/incident.routes');
const policeRoutes = require('./routes/police.routes');
const hospitalRoutes = require('./routes/hospital.routes');
const adminRoutes = require('./routes/admin.routes');
const { errorHandler } = require('./middleware/errorHandler');
const { env } = require('./config/env');

dotenv.config();

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdn.jsdelivr.net/npm"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https:'],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", 'https:'],
    }
  }
}));
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: Number(env.RATE_LIMIT_WINDOW_MS || 60000),
  max: Number(env.RATE_LIMIT_MAX || 100),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too many requests, please try again later.'
  }
});
app.use('/api', limiter);

app.get('/api/health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({
      status: 'ok',
      message: 'R-SEARS API is running',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/drivers', driverRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/police', policeRoutes);
app.use('/api/v1/hospital', hospitalRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(errorHandler);

const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`R-SEARS API running on http://localhost:${PORT}`);
});

module.exports = app;
