const { createLogger, format, transports } = require('winston'); 
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`; 
});

const logger = createLogger({
    level: "info",
    format: combine(timestamp(), logFormat),
    transports: [
        new transports.Console({ 
            format: format.combine(
                format.colorize({
                    all: true,
                }),
                format.timestamp({
                    format: 'YY-MM-DD HH:mm:ss', 
                })
            ),
        }),
        new transports.File({ filename: "logger/error.log", level: 'error' }),
        new transports.File({ filename: "logger/combined.log" })
    ],
});

module.exports = logger;