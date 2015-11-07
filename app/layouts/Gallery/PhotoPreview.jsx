var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var Component = React.createClass({

    getInitialState: function() {
        return {
            isFadeOut: false
        }
    },

    componentWillMount: function() {

    },

    componentDidMount: function() {
        this.photoHeight = this.refs.bkg.getDOMNode().offsetWidth/4;
        this.forceUpdate();
    },

    fadeIn: function() {
        this.setState({isFadeOut: false});
    },

    fadeOut: function() {
        this.setState({isFadeOut: true});
    },


    render: function() {

        var layoutClass = cx('layout-gallery',{
            'layout-photo-preview--fade-out': this.state.isFadeOut!==false
        });


        return (
            <div className={layoutClass}>
                <img src='images/photos/1.jpg' />
            </div>
        );
    }
});

module.exports = Component;