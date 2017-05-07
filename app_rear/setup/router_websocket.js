import Asciithyan from '../models/Asciithyan.js';
import WrongFileTypeError from "../errors/WrongFileTypeError";

export default (io) => {
    let file = io
        .of('file')
        .on('connection', (socket) => {
            socket.on('upload', async (file) => {
                socket.emit('msg', {name: 'ok'});
                let processor;
                try {
                    processor = new Asciithyan(file, {resolution: 35});
                    let picture = await processor.makeAscii();
                    socket.emit('msg', {name: 'finished', text: picture});
                } catch (err) {
                    if (err instanceof WrongFileTypeError) socket.emit('msg', {name: 'fail', text: err.message});
                    else throw err;
                }
            });
        });
}