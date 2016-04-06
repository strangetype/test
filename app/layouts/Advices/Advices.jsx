var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var TimerMixin = require('react-timer-mixin');

var _maxXSize = 4;
var BE = require('utils/BE');


var Advices = React.createClass({

    mixins: [
        TimerMixin
    ],

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

    onInputChange: function(field,ev) {
        var fb = this.state.advices;
        fb[field] = ev.target.value;
        this.setState({advices: fb});
    },

    render: function() {

        var layoutClass = cx('layout-advices',{
            'layout-advices--fade-out': this.state.isFadeOut!==false
        });

        return (
            <div className={layoutClass}>
                <div className="advices-actions">
                    <h2 className="advices-title">Cоветы</h2>
                </div>
                <div className="content-container">

                </div>
            </div>
        );
    }
});

module.exports = Advices;