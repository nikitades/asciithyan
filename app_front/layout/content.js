import React from 'react';
import Uploader from '../components/uploader';
import Recent from '../components/recent';

export default class Content extends React.Component {
    render() {
        return (
            <main>
                <div className="container">
                    <div className="row">
                        <div className="col s12 m8 l9">
                            <div className="section">
                                <h1>ASCII GIF converting tool</h1>
                                <blockquote>
                                    <h5>Now in NodeJS</h5>
                                </blockquote>
                            </div>
                            <div className="section">
                                <p>Submit your JPG / PNG / GIF:</p>
                                <Uploader/>
                            </div>
                            <Recent/>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}