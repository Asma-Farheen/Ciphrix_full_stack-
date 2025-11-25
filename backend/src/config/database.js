import { PrismaClient } from '@prisma/client';
import logger from './logger.js';

const prisma = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
});

// Log Prisma queries in development
if (process.env.NODE_ENV === 'development') {
    prisma.$on('query', (e) => {
        logger.debug('Query: ' + e.query);
        logger.debug('Duration: ' + e.duration + 'ms');
    });
}

// Log Prisma errors
prisma.$on('error', (e) => {
    logger.error('Prisma Error:', e);
});

// Log Prisma info
prisma.$on('info', (e) => {
    logger.info('Prisma Info:', e);
});

// Log Prisma warnings
prisma.$on('warn', (e) => {
    logger.warn('Prisma Warning:', e);
});

export default prisma;
