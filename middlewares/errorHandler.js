const logger = require("../logger/log");

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500 // Se establece el código de estado de error, es 500 por defecto
    err.status = err.status || "error"; // Se establece el estado del error, es 'error' por defecto

    //Esto registra el error con la IP del cliente incluida
    logger.error(
        `ERROR ${err.statusCode} - ${req.method} ${req.path} - ${err.status} - ${err.message} - IP: ${req.ip}`
    );

    //Envía la respuesta al cliente
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};

module.exports = errorHandler;