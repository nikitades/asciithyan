import React from 'react';
export default class FileInput extends React.Component {
    render() {
        return (
            <div className="file-field input-field">
                <div className="btn">
                    <span>File</span>
                    <input type="file" name={this.props.name}/>
                </div>
                <div className="file-path-wrapper">
                    <input type="text"
                           placeholder={this.props.placeholder ? this.props.placeholder : "Upload one or more files"}
                           className="file-path validate"/>
                </div>
            </div>
        );
    }
}
