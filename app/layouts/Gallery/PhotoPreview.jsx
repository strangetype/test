var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var Component = React.createClass({

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

    onClose: function() {
        if (typeof(this.props.onClose)==='function') this.props.onClose();
    },

    prev: function() {
        if (typeof(this.props.onPrev)==='function') this.props.onPrev();
    },

    next: function() {
        if (typeof(this.props.onNext)==='function') this.props.onNext();
    },

    render: function() {

        var layoutClass = cx('layout-photo-preview',{
            'layout-photo-preview--fade-out': this.state.isFadeOut!==false
        });


        return (
            <div className={layoutClass}>
                <img className="photo" src={this.props.photo.imgSrc} />
                <div className = "arrows">
                    {!this.props.disableLeft && <div onClick={this.prev} className="left-arrow"></div>}
                    {!this.props.disableRight && <div onClick={this.next} className="right-arrow"></div>}
                </div>
                <div onClick={this.onClose} className="close-button"></div>
            </div>
        );
    }
});

module.exports = Component;