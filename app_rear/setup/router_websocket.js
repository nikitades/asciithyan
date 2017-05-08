import Asciithyan from '../models/Asciithyan.js';
import WrongFileTypeError from "../errors/WrongFileTypeError";
import ConversionError from "../errors/ConversionError";

export default (io) => {
    let file = io
        .of('file')
        .on('connection', (socket) => {
            socket.on('upload', async (data) => {
                if (!data.file) socket.emit('msg', {name: 'fail', text: "no file!"});
                else {
                    socket.emit('msg', {name: 'ok'});
                    let processor;
                    try {
                        processor = new Asciithyan(data.file, {resolution: 15});
                        processor.onReady(async () => {
                            let picture = await processor.asciify();
                            socket.emit('msg', {name: 'finished', text: picture});
                        });
                    } catch (err) {
                        if (err instanceof WrongFileTypeError) socket.emit('msg', {name: 'fail', text: err.message});
                        else if (err instanceof ConversionError) socket.emit('msg', {name: 'fail', text: err.message});
                        else console.log(err);
                        //TODO: понять почему не ловятся ошибки как надо
                    }
                }
            });
        });
}