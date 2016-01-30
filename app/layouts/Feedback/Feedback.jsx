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

        var layoutClass = cx('layout-feedback',{
            'layout-feedback--fade-out': this.state.isFadeOut!==false
        });

        return (
            <div className={layoutClass}>
                <div className="feedback-actions">
                    <h2 className="feedback-title">Отзывы</h2>
                    <button className="feedback-btn">Оставить отзыв</button>
                </div>
                <div className="content-container">
                    {[1,2,3,4,5,6,7].map(()=> {
                        return <div className="feedback">
                            <img className="feedback-photo" src="images/me.jpg" />
                            <div className="feedback-message">
                                <h2 className="feedback-client-name">Некто очень довольный</h2>
                                Мне очень понравилась фотосессия)) сначала я правда чувствовала себя скованно, т.к. это была первая фотосессия в моей жизни)) а потом Маша исправила ситуацию))) все было очень не официально, классно пообщались, за что спасибо))) от этого и фото просто чудесные получились, потому что я почувствовала нашего любимого фотографа "своим человеком")) короче, умеет найти подход, фото супер, ракурс то что надо, цвета, ретушь...все отлично!))
                            </div>
                        </div>
                    })}
                </div>
            </div>
        );
    }
});

module.exports = Services;