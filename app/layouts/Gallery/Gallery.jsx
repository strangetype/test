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

var Gallery = React.createClass({

    getInitialState: function() {
        return {
            selected: false,
            isFadeOut: false,
            currentImgId: 0,
            nextImgId: 0,
            isSwitching: false
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

    choose: function() {
        var photo = this.props.photos[this.state.nextImgId];
        var id = this.state.nextImgId;

        this.setState({selected: id, isFadeOut: true},()=>{
            if (typeof(this.props.onSelect)==='function') {
                this.props.onSelect(photo,id);
            }
        });
    },

    select: function(id) {
        this.setState({
            isSwitching: true
        },()=>{
            this.setState({
                isSwitching: false,
                nextImgId: id,
                currentImgId: this.state.nextImgId
            });
        });

    },

    scrollUp: function() {
        var el = this.refs.scrollBar.getDOMNode();
        scroll.top(el, el.scrollTop-100, {duration: 500, ease: 'outCube'});
    },

    scrollDown: function() {
        var el = this.refs.scrollBar.getDOMNode();
        scroll.top(el, el.scrollTop+100, {duration: 500, ease: 'outCube'});
    },

    render: function() {

        var layoutClass = cx('layout-gallery',{
            'layout-gallery--fade-out': this.state.isFadeOut!==false
        });


        return (
            <div className={layoutClass}>
                <div ref="bkg" className="photos-bkg">
                    <div ref="scrollBar" className="mini-photos-scrollBar">
                        {this.props.photos.map((ph,id)=>{
                            return <div className="mini-photo">
                                <img src={'images/photos_mini/'+ph} />
                                <div onClick={this.select.bind(this,id)} className="hover"></div>
                            </div>
                        })}
                    </div>
                    {(!this.state.isSwitching) && <div className="main-photo-container">
                        <img className="current-img" src={'images/photos/'+this.props.photos[this.state.currentImgId]} />
                        <img className="next-img" onClick={this.choose} src={'images/photos/'+this.props.photos[this.state.nextImgId]} />
                        <div className="scroll-arrows">
                            <div className="v-arrow up-arrow" onClick={this.scrollUp}></div>
                            <div className="v-arrow down-arrow" onClick={this.scrollDown}></div>
                        </div>
                    </div>}
                </div>
            </div>
        );
    }
});

module.exports = Gallery;