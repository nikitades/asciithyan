import React from 'react';
import AsciiItem from "./AsciiItem";

export default class Recent extends React.Component {
    render() {
        let items = [];
        for (let i in this.props.items) {
            items.push(<AsciiItem key={i} picture={this.props.items[i] }/>);
        }
        return (
            <div>
                <audio src="/resources/misc/beer_can_opening.ogg"></audio>
                {items}
                <div className="fixed-action-btn">
                    <a className="btn-floating btn-large red" onClick={this.props.request}>
                        <i style={{fontSize: '2.5rem'}} className="large material-icons">forward_10</i>
                    </a>
                </div>
            </div>
        );
    }
}