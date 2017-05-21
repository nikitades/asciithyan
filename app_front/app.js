import React from 'react';
import ReactDOM from 'react-dom';
import App from "./containers/App";
import ws from './libs/ws';

let ws_file = ws('/file');

let initialState = {
    isUploading: false,
    recentItems: [],
    fio: ws_file
};

ReactDOM.render(
    <App initialState={initialState}/>,
    document.getElementById('root')
);