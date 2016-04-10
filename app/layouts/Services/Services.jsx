var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var _maxXSize = 4;

var scroll = require('scroll');

var _getRandomImg = function() {
    this.img = {
        x: Math.round(Math.random()*(_maxXSize-3))+1,
        y: Math.round(Math.random())+1,
        color: 'rgb('+Math.round(Math.random()*255)+','+Math.round(Math.random()*255)+','+Math.round(Math.random()*255)+')'
    };
    return this.img;
};

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

    render: function() {

        var layoutClass = cx('layout-services',{
            'layout-services--fade-out': this.state.isFadeOut!==false
        });

        return (
            <div className={layoutClass}>
                <div className="content-container">
                    <iframe src="BE/services-info.html" >
                        rdfguhjkjh
                    </iframe>
                </div>
            </div>
        );
    }
});

module.exports = Services;