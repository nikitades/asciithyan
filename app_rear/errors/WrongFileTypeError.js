export default class WrongFileTypeError extends Error {
    constructor(msg) {
        super();
        this.name = 'WrongFileTypeError';
        this.message = msg || '';
        Error.captureStackTrace(this, this.constructor);
    }
}