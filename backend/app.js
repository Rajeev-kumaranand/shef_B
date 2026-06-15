import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './src/middlewares/error.middleware.js';

// Routes
import authRoutes from './src/routes/auth.routes.js';
import slideRoutes from './src/routes/slide.routes.js';
import homeRoutes from './src/routes/home.routes.js';
import navRoutes from './src/routes/navigation.routes.js';
import companyRoutes from './src/routes/company.routes.js';
import contactRoutes from './src/routes/contact.routes.js';
import discoverRoutes from './src/routes/discover.routes.js';
import shopRoutes from './src/routes/shop.routes.js';
import latestRoutes from './src/routes/latest.routes.js';
import communityRoutes from './src/routes/community.routes.js';
import noteRoutes from './src/routes/note.routes.js';
import mediaRoutes from './src/routes/media.routes.js';
import productRoutes from './src/routes/product.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import customerRoutes from './src/routes/customer.routes.js';
import couponRoutes from './src/routes/coupon.routes.js';
import reviewRoutes from './src/routes/review.routes.js';
import seoRoutes from './src/routes/seo.routes.js';
import magazineRoutes from './src/routes/magazine.routes.js';
import settingsRoutes from './src/routes/settings.routes.js';
import inquiryRoutes from './src/routes/inquiry.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middlewares
app.use(helmet({ 
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 150, // limit each IP to 150 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', globalLimiter);

// Logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/slides', slideRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/navigation', navRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/latest', latestRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/note', noteRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/magazine', magazineRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api', inquiryRoutes); // Handles both /api/contact and /api/admin/inquiries

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
});

// Centralized Error Handling
app.use(errorHandler);

export default app;
