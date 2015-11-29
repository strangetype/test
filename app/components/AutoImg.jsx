var React = require('react');
var cx = require('classnames');
var _ = require('lodash');
var Cropper = require('react-cropper');

var AutoImg = React.createClass({
    mixins: [
        React.addons.LinkedStateMixin
    ],

    getInitialState: function() {
        return {
            imgStyle: {width: 1, height: 1, visibility: 'hidden'},
            size: {w: 0, h: 0},
            loaded: false,
            processing: false,
            isNoPhoto: false
        }
    },

    loaded: function(e) {
        var w = this.getDOMNode().offsetWidth;
        var c = 1;
        if (e.target.naturalWidth>0)
            c = w/e.target.naturalWidth;
        var imgStyle = this.state.imgStyle;
        imgStyle.width = e.target.naturalWidth*c;
        imgStyle.height = e.target.naturalHeight*c;
        imgStyle.visibility = 'visible';
        this.setState({
            imgStyle: imgStyle,
            size: {w: e.target.naturalWidth, h: e.target.naturalHeight},
            loaded: true,
            isNoPhoto: false
        });
    },

    setPlaceholder: function(e) {
        this.setState({isNoPhoto: true});
    },

    render: function() {
        return <div className={this.props.className} style={this.props.style}>
            {(this.props.showSize && this.state.loaded) && <div className={this.props.showSizeClass}>
                {this.state.size.w} x {this.state.size.h}
            </div>}
            {(!this.state.loaded && this.props.loadingPlaceholderSrc) && <img src={this.props.loadingPlaceholderSrc} />}
            {(this.state.processing && this.props.loadingPlaceholderSrc) && <img style={{position: 'absolute', top: 0, left:0}} src={this.props.loadingPlaceholderSrc} />}
            <img ref="imgEl" style={this.state.imgStyle} onLoad={this.loaded} onError={this.setPlaceholder} src={this.props.src} />
            {(this.state.isNoPhoto) && <img style={{width: '100%'}} src='images/img-placeholder.png'/>}
        </div>;
    }
});

module.exports = AutoImg;