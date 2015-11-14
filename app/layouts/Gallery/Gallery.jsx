var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var _maxXSize = 4;

var _getRandomImg = function() {
    this.img = {
        x: Math.round(Math.random()*(_maxXSize-3))+1,
        y: Math.round(Math.random())+1,
        color: 'rgb('+Math.round(Math.random()*255)+','+Math.round(Math.random()*255)+','+Math.round(Math.random()*255)+')'
    };
    return this.img;
};

var Component = React.createClass({

    getInitialState: function() {
        return {
            selected: false,
            isFadeOut: false
        }
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

    choose: function(photo,id) {
        this.setState({selected: id, isFadeOut: true},()=>{
            if (typeof(this.props.onSelect)==='function') {
                this.props.onSelect(photo,id);
            }
        });
    },

    render: function() {

        var layoutClass = cx('layout-gallery',{
            'layout-gallery--fade-out': this.state.isFadeOut!==false
        });


        return (
            <div className={layoutClass}>
                <div ref="bkg" className="photos-bkg">
                    {this.props.photos.map((p,i)=>{
                        return (
                            <div onClick={this.choose.bind(this,p,i)} className="photo" style={{width: '50%', height: '200px', backgroundImage: "url(images/photos/"+p+")"}}></div>
                        );
                    })}
                </div>
            </div>
        );
    }
});

module.exports = Component;