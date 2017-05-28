import Asciithyan from '../models/Asciithyan.js';
import WrongFileTypeError from "../errors/WrongFileTypeError";
import ConversionError from "../errors/ConversionError";

export default (app) => {
    let io = app.io;
    let file = io
        .of('file')
        .on('connection', (socket) => {
            socket.on('upload', async (data) => {
                    if (!data.file) socket.emit('msg', {name: 'fail', text: "no file!"});
                    else {
                        socket.emit('msg', {name: 'ok'});
                        let processor;
                        processor = new Asciithyan(data.file, {resolution: 15})
                            .then(async (processor) => {
                                let picture = await processor.asciify();
                                let coll_conversions = await app.db.collection('conversions');
                                coll_conversions.insertOne(picture);
                                file.emit('msg', {name: 'picture', picture, notify: true});
                            })
                            .catch(err => {
                                if (err instanceof WrongFileTypeError) socket.emit('msg', {
                                    name: 'fail',
                                    text: err.message
                                });
                                else if (err instanceof ConversionError) socket.emit('msg', {
                                    name: 'fail',
                                    text: err.message
                                });
                                else {
                                    console.log(err.message);
                                    console.trace(err);
                                    socket.emit('msg', {
                                        name: 'fail',
                                        text: 'smth wrng'
                                    });
                                }
                            });
                    }
                }
            );
            socket.on('req_latest', async (data) => {
                let coll_conversions = await app.db.collection('conversions');
                let res = await coll_conversions.find({}, null, {limit: 3, sort: {_id: -1}}).toArray();
                for (let i in res.reverse()) {
                    socket.emit('msg', {
                        name: 'picture',
                        picture: res[i]
                    });
                }
            });
            socket.on('req_limit', async data => {
                let coll_conversions = await app.db.collection('conversions');
                let res = await coll_conversions.find({}, null, {skip: data.start, limit: 10, sort: {_id: -1}}).toArray();
                socket.emit('res_limit', res);
            });
        });
}