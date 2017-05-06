import ioc from 'socket.io-client';
let connections = {};

export default (url) => {
    url = location.host + url;
    if (!(url in connections)) connections[url] = ioc(url);
    return connections[url];
}
