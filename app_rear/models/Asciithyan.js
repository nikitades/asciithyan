import Path from 'path';
import ftype from 'file-type';
import fs from 'fs';
import uuid from 'uuid/v4';
import _ from 'lodash';
import WrongFileTypeError from '../errors/WrongFileTypeError';
import ConversionError from '../errors/ConversionError';
import pixels from 'get-pixels';

const gm = require('gm').subClass({imageMagick: true});

export default class Asciithyan {
    constructor(file, options) {
        return new Promise((res, rej) => {
            this.timer = new Date();
            options = _.extend({
                tempPath: _root + '/web/images/',
                allowedFileTypes: ['jpg', 'png', 'gif'],
                charset: ['█', '▓', '▒', '░', '@', '≡', '§', '€', '#', 'Ø', 'O', '=', '¤', '®', '+', ':', ',', '.', ' '],
                resolution: 5,
                sideCoefficient: 2.4,
                maxWidth: 800,
                maxHeight: 600,
                debug: false
            }, options);
            this.options = options;
            this.ready = false;
            this.max = 255;
            this.yResolution = options.resolution;
            this.xResolution = Math.floor(this.yResolution / this.options.sideCoefficient);
            this.tempName = uuid();
            this.blob = file;
            [this.ext, this.mime] = Object.values(ftype(this.blob));
            this.tempFile = options.tempPath + this.tempName + '.' + this.ext;
            fs.writeFileSync(this.tempFile, this.blob);
            if (!options.allowedFileTypes.includes(this.ext)) throw new WrongFileTypeError('Wrong file given!');
            this.width = 0;
            this.height = 0;
            Promise.all([
                this.getSize()
                    .then(this.fit.bind(this))
                    .then(this.highlight.bind(this))
                    .catch(rej)
            ]).then(() => res(this)).catch(rej);
            // this.suicide();
        })
    }

    getSize() {
        return new Promise((res, rej) => {
            gm(this.tempFile)
                .size((err, size) => {
                    if (err) throw err;
                    this.width = size.width;
                    this.height = size.height;
                    res();
                });
        })
    }

    fit() {
        return new Promise((res, rej) => {
            if (this.width > this.options.maxWidth) {
                this.height = this.height / (this.width / this.options.maxWidth);
                this.width = this.options.maxWidth;
            } else if (this.height > this.options.maxHeight) {
                this.width = this.width / (this.height / this.options.maxHeight);
                this.height = this.options.maxHeight;
            }

            // let newWidth = Math.ceil(this.width / this.coef);
            // let newHeight = Math.ceil(this.height / this.coef);
            let self = this;
            gm(this.tempFile)
                .resize(this.width, this.height)
                .write(this.tempFile, function () {
                    self.getSize()
                        .then(res);
                });
        });
    }

    highlight() {
        //TODO: динамическая контрастность
        return new Promise((res, rej) => {
            gm(this.tempFile)
                .contrast(-4)
                .modulate(-255, -255)
                .colors(this.options.charset.length)
                .quality(15)
                .write(this.tempFile, res)
        });
    }

    async asciify() {
        return new Promise(async (res, rej) => {
            switch (this.ext) {
                case 'gif':
                    this.pixelMap = await this.getAnimatedPixelMap(this.tempFile, this.mime);
                    let frames = [];
                    for (let i in this.pixelMap) {
                        frames.push(this.textify(await this.squareAnalysis(this.pixelMap[i])));
                    }
                    res({
                        animated: true,
                        source: Path.basename(this.tempFile),
                        body: frames
                    });
                    break;
                case 'jpeg':
                case 'jpg':
                case 'png':
                case 'bmp':
                    this.pixelMap = await this.getPlainPixelMap(this.tempFile, this.mime);
                    let chunks = await this.squareAnalysis(this.pixelMap);
                    let text = this.textify(chunks);
                    this.options.debug ? console.log((new Date() - this.timer) / 1000) : '';
                    res({
                        animated: false,
                        source: Path.basename(this.tempFile),
                        body: text
                    });
                    break;
            }
            // this.suicide();
        });
    }

    getAnimatedPixelMap(path, type) {
        return new Promise((res, rej) => {
            pixels(path, type, (err, pixels_array) => {
                if (err) rej(err);
                let frames = pixels_array.shape[0];
                let length = pixels_array.stride[0];
                let chunks = [];
                let _stride = pixels_array.stride;
                _stride.shift();
                for (let i = 0; i < frames; i++) {
                    chunks.push({
                        data: pixels_array.data.slice(i * length, (i+1) * length),
                        stride: _stride,
                        offset: pixels_array.offset
                    });
                }
                res(chunks);
            })
        });
    }

    getPlainPixelMap(path, type) {
        return new Promise((res, rej) => {
            pixels(path, type, (err, pixels_array) => {
                if (err) rej(err);
                res(pixels_array);
            });
        })
    }

    getPixelColorAt(x, y, pixelMap) {
        let out = [];
        let pointer = pixelMap.offset + (pixelMap.stride[0] * x) + (pixelMap.stride[1] * y);
        for (let i = 0; i < 4; i++) {
            let item = pixelMap.data[pointer + (pixelMap.stride[2] * i)];
            if (typeof item === 'undefined') throw new ConversionError(`Data length: ${pixelMap.data.length}, desired: ${pointer + (pixelMap.stride[2] * i)}`);
            out.push(item);
        }
        if (out[3] < this.max / this.options.charset.length) return 255;
        return (((out[0] + out[1] + out[2]) / 3) * (out[3] / this.max));
    }

    squareAnalysis(pixelMap) {
        return new Promise(async (res, rej) => {
            let phrase = [];
            for (let y = 0; y < this.height; y += this.yResolution) {
                let line = [];
                for (let x = 0; x < this.width; x += this.xResolution) {
                    let average = [];
                    for (let subx = x; subx < x + this.xResolution; subx++) {
                        if (subx >= this.width) continue;
                        for (let suby = y; suby < y + this.yResolution; suby++) {
                            if (suby >= this.height) continue;
                            average.push(this.getPixelColorAt(subx, suby, pixelMap));
                        }
                    }
                    if (!average.length) continue;
                    let sum = 0;
                    average.map(item => sum += item);
                    sum = sum / average.length;
                    line.push(sum);
                }
                if (line.length) phrase.push(line);
            }
            res(phrase);
        });
    }

    textify(phrase) {
        let str = '';
        for (let _l in phrase) {
            let line = '';
            for (let char in phrase[_l]) {
                let n = (Math.ceil((phrase[_l][char] / this.max) * this.options.charset.length) - 1);
                if (n < 0) n = 0;
                if (!this.options.charset[n]) throw new ConversionError('No char at position ' + n + ' of charset!');
                line += this.options.charset[n];
            }
            line += '\n';
            str += line;
        }
        return str;
    }

    suicide(time) {
        time = time || 60000;
        clearTimeout(this.suicideTimeout);
        this.suicideTimeout = setTimeout(this.destroy.bind(this), time);
    }

    destroy() {
        if (fs.existsSync(this.tempFile)) fs.unlink(this.tempFile, (err) => {
            if (err) throw err;
        });
    }
}