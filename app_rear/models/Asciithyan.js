import ftype from 'file-type';
import fs from 'fs';
import uuid from 'uuid/v4';
import _ from 'lodash';
import gcpk from 'get-canvas-pixel-color';
import WrongFileTypeError from '../errors/WrongFileTypeError';
import Canvas from 'canvas';
import getSizes from 'image-size';

global.Image = Canvas.Image;

export default class Asciithyan {
    constructor(file, options) {
        options = _.extend({
            tempPath: _root + '/storage/temp/',
            allowedFileTypes: ['jpg', 'png', 'gif'],
            charset: ['█', '▓', '▒', '░', '@', '≡', '§', '€', '#', 'Ø', 'O', '=', '¤', '®', '+', ':', ',', '.', ' '],
            resolution: 5
        }, options);
        this.max = 255;
        this.resolution = options.resolution;
        this.charset = options.charset;
        this.tempName = uuid();
        this.tempPath = options.tempPath + this.tempName;
        this.blob = file;
        fs.writeFileSync(this.tempPath, this.blob);
        [this.ext, this.mime] = Object.values(ftype(this.blob));
        if (!options.allowedFileTypes.includes(this.ext)) throw new WrongFileTypeError('Wrong file given!');
        this.suicide = setTimeout(this.destroy.bind(this), 60000);
        //TODO: не забыть, что хранение файла может не понадобиться
    }

    async makeAscii() {
        let self = this;
        return new Promise(async (res, rej) => {
            if (self.mime == 'gif') {
                rej('GIF is currently not supported');
            }

            let ctx;
            try {
                ctx = await this.makeContext();
            } catch (e) {
                rej(e);
            }
            this.ctx = ctx;

            /**
             * У нас есть контекст.
             * Теперь надо пройтись по нему покубично.
             */

            this.chunks = this.squareAnalysis();
            this.text = this.textify();

            res(this.text);


            //TODO: написать конструктор сетки с анализом
            /**
             * Здесь мы уже знаем что файл это картинка нужного типа.
             * - Теперь нужно сделать развилку на гиф и не гиф (два метода)
             * - потом анализатор сегмента (управляемый размер чанка, один метод)
             * - потом клеить гиф из этого
             * - потом -> base64 или что запрошено
             */
            // res(this.blob.toString('base64'));
            this.destroy();
        });
    }

    async getSizes() {
        return new Promise((res, rej) => {
            getSizes(this.tempPath, (err, sizes) => {
                if (err) rej(err);
                res(sizes);
            })
        });
    }

    getColors(x, y) {
        return gcpk(this.ctx, x, y);
    }

    makeContext() {
        return new Promise(async (res, rej) => {
            try {
                this.sizes = await this.getSizes();
            } catch (e) {
                console.error('Could not get sizes of image');
            }
            let canvas = new Canvas(this.sizes.width, this.sizes.height);
            let ctx = canvas.getContext('2d');
            let img = new Image;
            img.onload = () => res(ctx);
            img.src = this.blob;
            ctx.drawImage(img, 0, 0, img.width, img.height);
        });
    }

    squareAnalysis() {
        let chunks = [];
        let __i = 0;
        for (let y = 0; y < this.sizes.width + 1; y += this.resolution) {
            if (y > this.sizes.height) continue; //для каждого сегмента по разрешению по игреку
            let yChunk = [];
            for (let x = 0; x < this.sizes.height + 1; x += this.resolution) {
                if (x > this.sizes.height) continue;//для каждого сегмента по разрешению по иксу
                //имеем координаты начал квадратиков, считаем суммарный цвет квадрата
                let grays = [];
                for (let _y = y; _y < (y + this.resolution); _y++) { //для y
                    for (let _x = x; _x < (x + this.resolution); _x++) { //для x
                        let {r, g, b} = this.getColors(_x, _y);
                        let average = (r + g + b) / 3;
                        grays.push(average);
                    }
                }
                let chunkAverage = 0;
                for (let i in grays) chunkAverage += grays[i];
                chunkAverage = chunkAverage / grays.length;
                yChunk.push(chunkAverage);
            }
            chunks.push(yChunk);
        }
        return chunks;
    }

    textify() {
        let str = '';
        for (let i in this.chunks) {
            let line = '';
            for (let e in this.chunks[i]) {
                let n = (Math.ceil((this.chunks[i][e] / this.max) * this.charset.length) - 1);
                if (n < 0) n = 0;
                if (!this.charset[n]) console.log(n);
                line += this.charset[n];
            }
            line += '\n';
            str += line;
        }
        return str;
    }

    destroy() {
        if (fs.existsSync(this.tempPath)) fs.unlink(this.tempPath, (err) => {
            if (err) throw err
        });
    }
}