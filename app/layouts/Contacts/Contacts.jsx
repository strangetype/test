var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var _maxXSize = 4;
var BE = require('utils/BE');

var TimerMixin = require('react-timer-mixin');

var ClickToSelect = require("react-click-to-select");

var Services = React.createClass({

    mixins: [
        TimerMixin
    ],

    getInitialState: function() {
        return {
            isFadeOut: false,
            message: {},
            tip: false,
            notify: null
        }
    },

    fadeIn: function() {
        this.setState({isFadeOut: false});
    },

    fadeOut: function() {
        this.setState({isFadeOut: true});
    },

    sendMessage: function() {
        this.setState({
            tip: false
        });
        if (this.state.message.name && this.state.message.email && this.state.message.message) {
            BE.sendMessage(this.state.message).then(()=>{
                this.setState({
                    notify: "ПИСЬМО ОТПРАВЛЕНО"
                });
                this.setTimeout(()=>{
                    this.setState({
                        notify: null
                    });
                },5000);
            });
        } else {
            this.setState({
                tip: true
            });
        }
    },

    onInputChange: function(field,ev) {
        var message = this.state.message;
        message[field] = ev.target.value;
        this.setState({message: message});
    },

    render: function() {

        var layoutClass = cx('layout-contacts',{
            'layout-contacts--fade-out': this.state.isFadeOut!==false
        });

        return (
            <div className={layoutClass}>
                <div className="content-container">
                    <div className="contacts-left-menu">
                        <h2 className="contacts-title">Мария Тропина</h2>
                        <div className="contacts"  >
                            <div className="contact-item">
                                <img src="images/mobile.png" />
                                <ClickToSelect>+7(903)596-05-12</ClickToSelect>
                            </div>
                            <div className="contact-item">
                                <a target="blank" href="https://www.instagram.com/tropina_maria/">
                                    <img src="images/instagram.png" />
                                    tropina_maria
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="contacts-right-menu">
                        <h3 >Отправить сообщение</h3>
                        <div className="contact-form">
                            <form>
                                <input type="text" onChange={this.onInputChange.bind(this,'name')} placeholder="*имя" />
                                <input type="text" onChange={this.onInputChange.bind(this,'phone')}  placeholder="телефон" />
                                <input type="text" onChange={this.onInputChange.bind(this,'email')}  placeholder="*Email" />
                                <textarea onChange={this.onInputChange.bind(this,'message')}  placeholder="*сообщение" />
                                <input onClick={this.sendMessage} type="submit" />
                                {!!(this.state.tip) && <div className="tip">
                                    <i>введите ваше имя, текст сообщения и ваш email</i>
                                </div>}
                            </form>
                        </div>
                    </div>
                </div>
                {(!!this.state.notify) && <div className="contacts-notify-screen">
                    <div className = "contacts-notify">
                        {this.state.notify}
                    </div>
                </div>}
            </div>
        );
    }
});

module.exports = Services;