import React from 'react';
import ReactDOM from 'react-dom';

import Footer from './layout/footer';
import Header from './layout/header';
import Content from './layout/content';

import './libs/ws';
import 'materialize-css/bin/materialize.js';
import 'materialize-css/bin/materialize.css';
import '../resources/css/app.css';

class App extends React.Component {
    render() {
        return (
            <div id="app">
                <Header/>
                <Content/>
                <Footer/>
            </div>
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);