import {ErrorRequestHandler, RequestHandler} from 'express';
import { accessLogger, errorLogger } from '../utils/logger'

export const logRequests: RequestHandler = (req, res, next) => {
    if (req.method === "GET")
        accessLogger.info(`Method: ${req.method} | To: ${req.path} | Query: ${JSON.stringify(req.query)}`);
    else {
        accessLogger.info(`Method: ${req.method} | To: ${req.path} | Body: ${JSON.stringify(req.body)}`);
    }
    next();
};


export const handleError: ErrorRequestHandler = (error, req, res, next) => {
    errorLogger.error(
        `${error.status}: ${error.description} | code: ${error.code}`,
    );
    return res.status(error.status).json({ error: error.response });
};