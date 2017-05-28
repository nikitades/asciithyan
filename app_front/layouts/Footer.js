import React from 'react';
export default class Footer extends React.Component {
    render() {
        return (
            <footer className="page-footer cyan lighten-5">
                <div className="container">
                    <div className="row">
                        <div className="col l6 s12">
                            <h5>ASCII GIF CONVERTER</h5>
                            <p className="text-lighten-5">A free-to-use tool make an animated text from your GIFs.</p>
                        </div>
                        <div className="col l4 offset-l2 s12">
                        </div>
                    </div>
                </div>
                <div className="footer-copyright black-text">
                    <div className="container">&copy; 2017 Nikita Pavlovskiy<a href="mailto:pavlovskiy.nikita@gmail.com"
                                                                               className="right">pavlovskiy.nikita@gmail.com</a>
                    </div>
                </div>
            </footer>
        );
    }
}