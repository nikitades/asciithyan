export default class ConversionError extends Error {
    constructor(msg) {
        super();
        this.name = 'ConversionError';
        this.message = msg || '';
        Error.captureStackTrace(this, this.constructor);
    }
}