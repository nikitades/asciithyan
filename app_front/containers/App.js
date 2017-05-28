import React from 'react';
import Uploader from "../components/Uploader";
import Recent from "../components/Recent";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

import 'materialize-css/bin/materialize.css'
import 'materialize-css/bin/materialize.js'
import '../../resources/css/app.css'
import Main from "../layouts/Main";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.initialState;

        this.state.fio.on('msg', (msg) => {
            switch (msg.name) {
                case 'ok':
                    this.setState({
                        isUploading: true
                    });
                    break;
                case 'fail':
                    console.warn('fail');
                    this.setState({
                        isUploading: false
                    });
                    break;
                case 'picture':
                    this.setState({
                        isUploading: false,
                        recentItems: [
                            {
                                ...msg.picture,
                                notify: msg.notify
                            },
                            ...this.state.recentItems
                        ]
                    });
                    break;
                default:
                    console.warn('no response');
                    break;
            }
        });

        this.state.fio.on('res_latest', data => {
            this.setState({
                recentItems: [
                    ...data
                ]
            })
        });

        this.state.fio.on('res_limit', data => {
            this.setState({
                recentItems: [
                    ...this.state.recentItems,
                    ...data
                ]
            }, () => {
                $('body').animate({
                    scrollTop: $('.card-image').eq($('.card-image').length - 10).offset().top
                });
            });
        });

        this.state.fio.emit('req_latest');

    }

    request() {
        this.state.fio.emit('req_limit', {start: this.state.recentItems.length});
    }

    render() {
        return (
            <div id="app">
                <Header/>
                <Main>
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
                                    <Uploader fio={this.state.fio} isUploading={this.state.isUploading}/>
                                </div>
                                <div className="section">
                                    <Recent items={this.state.recentItems} request={this.request.bind(this)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </Main>
                <Footer/>
            </div>
        );
    }
}