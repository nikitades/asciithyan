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
        options = _.extend({
            tempPath: _root + '/storage/temp/',
            allowedFileTypes: ['jpg', 'png', 'gif'],
            charset: ['█', '▓', '▒', '░', '@', '≡', '§', '€', '#', 'Ø', 'O', '=', '¤', '®', '+', ':', ',', '.', ' '],
            resolution: 5,
            sideCoefficient: 1.9
        }, options);
        this.ready = false;
        this.coef = options.sideCoefficient;
        this.max = 255;
        this.yResolution = options.resolution;
        // this.xResolution = this.yResolution;
        this.xResolution = Math.floor(this.yResolution / this.coef);
        this.charset = options.charset;
        this.tempName = uuid();
        this.tempFile = options.tempPath + this.tempName;
        this.blob = file;
        fs.writeFileSync(this.tempFile, this.blob);
        [this.ext, this.mime] = Object.values(ftype(this.blob));
        if (!options.allowedFileTypes.includes(this.ext)) throw new WrongFileTypeError('Wrong file given!');
        this.width = 0;
        this.height = 0;
        this.events = [];
        this.highlight();
        Promise.all([
            this.getSize(),
            this.highlight()
        ]).then(() => {
            console.log('done');
            this.ready = true;
            this.exec('onReady');
        });
        this.suicide();
    }

    onReady(func) {
        if (!this.events['onReady']) this.events['onReady'] = [];
        this.events['onReady'].push(func);
    }

    exec(name) {
        for (let i in this.events[name]) {
            this.events[name][i]();
        }
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

    highlight() {
        return new Promise((res, rej) => {
            gm(this.tempFile)
                .contrast(-3)
                // .blackThreshold('10%', '10%', '10%', '10%')
                // .whiteThreshold('90%', '90%', '90%', '90%')
                .write(this.tempFile, () => {
                    res();
                })
        })
    }

    async asciify() {
        return new Promise(async (res, rej) => {
            if (this.mime === 'gif') rej('GIF is currently not supported');
            this.pixelMap = await this.getPixelMap(this.tempFile, this.mime);
            let chunks = await this.squareAnalysis();
            let text = this.textify(chunks);
            res(text);
            this.suicide();
        });
    }

    getPixelMap(path, type) {
        return new Promise((res, rej) => {
            pixels(path, type, (err, pixels_array) => {
                if (err) rej(err);
                res(pixels_array);
            });
        })
    }

    getPixelColorAt(x, y) {
        let out = [];
        let pointer = this.pixelMap.offset + (this.pixelMap.stride[0] * (x)) + (this.pixelMap.stride[1] * (y));
        for (let i = 0; i < 3; i++) {
            let item = this.pixelMap.data[pointer + (this.pixelMap.stride[2] * i)];
            if (typeof item === 'undefined') {
                console.log(`Data length: ${this.pixelMap.data.length}, desired: ${pointer + (this.pixelMap.stride[2] * i)}`);
                item = 0;
            }
            out.push(item);
        }
        let res = (out[0] + out[1] + out[2]) / 3;
        //TODO: некоторые png все черные
        // if (res > 2) console.log(res);
        return res;
    }

    squareAnalysis() {
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
                            average.push(this.getPixelColorAt(subx, suby));
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
                let n = (Math.ceil((phrase[_l][char] / this.max) * this.charset.length) - 1);
                if (n < 0) n = 0;
                if (!this.charset[n]) throw new ConversionError('No char at position ' + n + ' of charset!');
                line += this.charset[n];
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