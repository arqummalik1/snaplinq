type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
    private isDev = __DEV__;

    private log(level: LogLevel, message: string, data?: any) {
        const timestamp = new Date().toISOString();
        const payload = {
            timestamp,
            level: level.toUpperCase(),
            message,
            ...(data && { data }),
        };

        if (this.isDev) {
            const color = level === 'error' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : '\x1b[32m';
            console.log(`${color}[${payload.level}] ${timestamp}: ${message}\x1b[0m`, data || '');
        }

        // In production, sync to Sentry or remote logging service
        if (level === 'error') {
            // Sentry.captureException(data || new Error(message));
        }
    }

    info(message: string, data?: any) {
        this.log('info', message, data);
    }

    warn(message: string, data?: any) {
        this.log('warn', message, data);
    }

    error(message: string, data?: any) {
        this.log('error', message, data);
    }

    debug(message: string, data?: any) {
        if (this.isDev) {
            this.log('debug', message, data);
        }
    }
}

export const logger = new Logger();
