import React from 'react';
import AnimatedFrame from "./AnimatedFrame";
import StaticFrame from "./StaticFrame";

let notify = false;

export default class AsciiItem extends React.Component {
    componentDidMount() {
        if (notify) {
            document.getElementsByTagName('audio')[0].play();
        }
    }

    render() {
        if (this.props.picture.notify) notify = true;
        let frame = this.props.picture.animated ?
            <AnimatedFrame frames={this.props.picture.body}/> :
            <StaticFrame frame={this.props.picture.body}/>;
        return (
            <div className="row">
                <div ref="card" className="card" style={{display: 'inline-block'}}>
                    <div className="card-image">
                        {frame}
                    </div>
                </div>
            </div>
        );
    }
}