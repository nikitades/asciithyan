import React from 'react';

export default class StaticFrame extends React.Component {
    render() {
        return (<pre className={'asciiItem ' + (this.props.active ? 'active' : '')}>{this.props.frame}</pre>);
    }
}