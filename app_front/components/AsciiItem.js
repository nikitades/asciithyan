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

    reverse() {
        $(this.refs.ascii).toggleClass('hiddendiv');
        $(this.refs.source).toggleClass('hiddendiv');
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
                        <div ref="ascii" className="ascii-image">
                            {frame}
                        </div>
                        <div ref="source" className="ascii-source hiddendiv">
                            <img src={/images/ + this.props.picture.source} alt=""/>
                        </div>
                        <a className="btn-floating halfway-fab waves-effect waves-light red" onClick={this.reverse.bind(this)}><i className="material-icons">loop</i></a>
                    </div>
                </div>
            </div>
        );
    }
}