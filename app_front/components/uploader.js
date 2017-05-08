import React from 'react';
import FileInput from "../layout/fileinput";
import ws from '../libs/ws';

const io = ws('/');
io.on('msg', (msg) => console.warn(msg.text));

const file_io = ws('/file');
file_io.on('msg', (msg) => {
    switch (msg.name) {
        case 'ok':
            console.warn('запускаем ожидание обработки');
            break;
        case 'fail':
            console.warn(msg.text);
            break;
        case 'finished':
            console.warn(msg.text);
            break;
        default:
            console.warn('no response');
            break;
    }
});

let onSubmit = (e) => {
    e.preventDefault();
    let file = e.target.srcfile.files[0];
    if (file) file_io.emit('upload', {name: "test", file});
};


export default class Uploader extends React.Component {
    render() {
        return (
            <div>
                <form action={this.props.formAction} onSubmit={onSubmit}>
                    <FileInput name="srcfile"/>
                    <button type="submit" className="btn waves-effect wawes-light">Submit
                        <i className="material-icons right">send</i>
                    </button>
                </form>
            </div>
        );
    }
}