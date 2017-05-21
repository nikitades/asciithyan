import React from 'react';
import StaticFrame from "./StaticFrame";
window.$ = window.jQuery = require('materialize-css/node_modules/jquery/dist/jquery');

export default class AnimatedFrame extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
        let that = this;
        this.animateInterval = setInterval(() => {
            let next = $(that.refs.frames).children('.active').next();
            if (next.length) {
                $(that.refs.frames).children('.active')
                    .removeClass('active')
                    .next().addClass('active');
            } else {
                $(that.refs.frames).children().removeClass('active');
                $(that.refs.frames).children().eq(0).first().addClass('active');
            }
        }, 100);
    }

    render() {
        let frames = [];
        for (let i in this.props.frames) {
            frames.push(<StaticFrame active={parseInt(i) === 0} key={i} frame={this.props.frames[i]}/>);
        }
        return (
            <div ref="frames" className="frames">
                {frames}
            </div>
        );
    }
}