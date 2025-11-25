import morgan from 'morgan';
import logger from '../config/logger.js';

// Create custom Morgan token for user ID
morgan.token('user-id', (req) => {
    return req.user?.id || 'anonymous';
});

// Custom Morgan format
const morganFormat = ':method :url :status :response-time ms - :user-id';

// Morgan middleware with Winston integration
export const requestLogger = morgan(morganFormat, {
    stream: logger.stream,
    skip: (req, res) => {
        // Skip logging for health check endpoints
        return req.url === '/health' || req.url === '/api/health';
    },
});

// Request logging middleware
export const logRequest = (req, res, next) => {
    logger.info('Incoming request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        user: req.user?.id,
    });
    next();
};

// Response logging middleware
export const logResponse = (req, res, next) => {
    const startTime = Date.now();

    // Listen for response finish event
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        logger.info('Response sent', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            user: req.user?.id,
        });
    });

    next();
};
