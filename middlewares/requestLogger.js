const logger = require("../logger/log");

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} from ${req.ip}`); // Registra la información de la solicitud
  next(); // Pasa el control al siguiente middleware
};

module.exports = requestLogger;
