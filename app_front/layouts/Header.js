import React from 'react';
window.$ = window.jQuery = require('materialize-css/node_modules/jquery/dist/jquery');

export default class Header extends React.Component {
    componentDidMount() {
        $(".button-collapse").sideNav();
    }

    render() {
        return (
            <nav>
                <div className="nav-wrapper cyan darken-4">
                    <div className="container">
                        <a href="#" data-activates="mobile-demo" className="button-collapse">
                            <i className="material-icons">menu</i>
                        </a>
                        <ul className="hide-on-med-and-down">
                            <li><a href="/">Main</a></li>
                            <li><a href="https://github.com/nikitades/asciithyan">Github</a></li>
                            <li><a target="_blank" href="http://vk.com/nikitades">Author</a></li>
                        </ul>
                        <ul id="mobile-demo" className="side-nav">
                            <li><a href="/">Main</a></li>
                            <li><a href="https://github.com/nikitades/asciithyan">Github</a></li>
                            <li><a target="_blank" href="http://vk.com/nikitades">Author</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}