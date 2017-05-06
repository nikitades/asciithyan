import Card from "../layout/card";
import React from 'react';
export default class Recent extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col s12">
                    <pre>Ле список недавних элементов</pre>
                    <Card/>
                    <Card/>
                    <Card/>
                </div>
            </div>
        );
    }
}