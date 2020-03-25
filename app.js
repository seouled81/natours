const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// set secure HTTP headers
app.use(helmet());

// Cookie Parser, to read Cookies
app.use(cookieParser());

// dev mode logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in one hour!'
});
app.use('/api', limiter);

// Body parser, to read data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injections
app.use(mongoSanitize());

// Data sanitization against XSS attacks
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'difficulty',
      'maxGroupSize',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
      'priceDiscount'
    ]
  })
);

// middleware for compressing text
app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(`Oops, can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
