import React from 'react';

import Preloader from "./Preloader";

export default class Uploader extends React.Component {
    onSubmit(e) {
        e.preventDefault();
        let file = e.target.srcfile.files[0];
        this.props.fio.emit('upload', {name: 'test', file});
    }

    render() {
        return this.props.isUploading ? (
            <Preloader/>
        ) : (
            <div>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <input type="file" name="srcfile"/>
                    <button type="submit" className="btn waves-effect wawes-light">Submit
                        <i className="material-icons right">send</i>
                    </button>
                </form>
            </div>
        );
    }
}
