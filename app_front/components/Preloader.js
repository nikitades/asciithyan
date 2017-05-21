import React from 'react';

export default class Preloader extends React.Component {
    render() {
        return (
            <div className="progress">
                <div className="indeterminate"></div>
            </div>
        );
    }
}