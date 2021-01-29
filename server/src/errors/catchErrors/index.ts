import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import Index from '../customError';

export const catchErrors = (
	requestHandler: RequestHandler,
	errorMessage: string = 'Error',
): RequestHandler => {
	return async (req, res, next): Promise<any> => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors);
			return next(
				new Index(
					`${errorMessage}: invalid input`,
					422,
					'Invalid input',
				),
			);
		}
		try {
			return await requestHandler(req, res, next);
		} catch (error) {
			return next(
				new Index(
					error.response?.length ? error.response : errorMessage,
					error.status || 500,
					error.description || error,
					error.message,
					error.code,
				),
			);
		}
	};
};
