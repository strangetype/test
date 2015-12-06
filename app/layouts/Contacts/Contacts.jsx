var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var _maxXSize = 4;
var BE = require('utils/BE');

var Services = React.createClass({

    getInitialState: function() {
        return {
            isFadeOut: false
        }
    },

    fadeIn: function() {
        this.setState({isFadeOut: false});
    },

    fadeOut: function() {
        this.setState({isFadeOut: true});
    },

    sendMessage: function() {
        BE.sendMessage();
    },

    render: function() {

        var layoutClass = cx('layout-contacts',{
            'layout-contacts--fade-out': this.state.isFadeOut!==false
        });

        return (
            <div className={layoutClass}>
                <div className="content-container">
                    <h2 className="contacts-title">Контакты</h2>
                    <div className="contacts" >
                        <div className="contact-item">
                            <img src="images/gmail.png" />
                            mtropinamoscow@gmail.com
                        </div>
                        <div className="contact-item">
                            <img src="images/mobile.png" />
                            +7(903)596-05-12
                        </div>
                        <div className="contact-item">
                            <img src="images/viber.png" />
                            +7(903)506-05-12
                        </div>
                        <div className="contact-item">
                            <img src="images/whatsapp.png" />
                            +7(903)506-05-12
                        </div>
                        <div className="contact-item">
                            <a target="blank" href="https://www.instagram.com/mtropina/">
                                <img src="images/instagram.png" />
                                mtropina
                            </a>
                        </div>
                    </div>
                    <div className="contact-form">
                        <form>
                            <input type="text" placeholder="*имя" />
                            <input type="text" placeholder="телефон" />
                            <input type="text" placeholder="*Email" />
                            <textarea  placeholder="*сообщение" />
                            <input onClick={this.sendMessage} type="submit" />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Services;