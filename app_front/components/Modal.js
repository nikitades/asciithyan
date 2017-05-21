import React from 'react';
import ReactDOM from 'react-dom';
window.$ = window.jQuery = require('materialize-css/node_modules/jquery/dist/jquery');

export default class Modal extends React.Component {
    static alert(txt) {
        Modal.show({
            title: 'Внимание',
            text: txt
        });
    }
    static info(txt) {
        Modal.show({
            title: 'Информация',
            text: txt
        });
    }

    static show(opts) {
        opts.title = opts.title || 'Сообщение';
        opts.text = opts.text || 'Спасибо за внимание';
        let modal = document.createElement('div');
        modal.classList = 'modalContainer';
        document.getElementsByTagName('body')[0].append(modal);
        ReactDOM.render(
            <Modal id={"modal"+Math.random().toString().slice(2)} title={opts.title} text={opts.text}/>,
            modal
        );
    }

    componentDidMount() {
        let self = this;
        $('.modal').modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .5, // Opacity of modal background
            inDuration: 300, // Transition in duration
            outDuration: 200, // Transition out duration
            startingTop: '4%', // Starting top style attribute
            endingTop: '10%', // Ending top style attribute
            ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
            },
            complete: function() {
                $('#'+self.props.id).parents('.modalContainer').remove();
            } // Callback for Modal close
        });
        $('#' + this.props.id).modal('open');
    }

    render() {
        return (
            <div id={this.props.id} className="modal">
                <div className="modal-content">
                    <h4>{this.props.title || 'Сообщение'}</h4>
                    <p>{this.props.text}</p>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat">OK</a>
                </div>
            </div>
        );
    }
}