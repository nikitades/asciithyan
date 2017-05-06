export default class WrongFileTypeError {
    constructor(msg) {
        this.name = 'WrongFileTypeError';
        this.message = msg || '';
    }
}