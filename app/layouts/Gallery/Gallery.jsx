var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var _maxXSize = 4;
var {Navigation} = require('react-router');

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

    mixins: [
        Navigation
    ],

    getInitialState: function() {
        return {
            selected: false,
            isFadeOut: false,
            currentImgId: this.props.params.photoId || 0,
            nextImgId: this.props.params.photoId || 0,
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

    changePhoto: function(id) {
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

    componentWillReceiveProps: function(props) {
        if (this.props.params.photoId!==props.params.photoId) {
            this.changePhoto(props.params.photoId);
        }
    },

    select: function(id) {
        if (id<0) id = 0;
        if (id>this.props.photos.length-1) id = this.props.photos.length-1;
        this.context.router.transitionTo('gallery-photo',{'category': this.props.params.category, photoId: id});
    },

    scrollLeft: function() {
        var el = this.refs.scrollBar.getDOMNode();
        scroll.left(el, el.scrollLeft-100, {duration: 500, ease: 'outCube'});
    },

    scrollRight: function() {
        var el = this.refs.scrollBar.getDOMNode();
        scroll.left(el, el.scrollLeft+100, {duration: 500, ease: 'outCube'});
    },

    isArrows: function() {
        if (this.refs.scrollBar) {
            if (100*this.props.photos.length>this.refs.scrollBar.getDOMNode().offsetWidth) {
                return true;
            }
        }
        return false;
    },

    onClose: function() {
        if (this.props.categoriesCount>1) {
            this.context.router.transitionTo('gallery');
        } else {
            this.context.router.transitionTo('main');
        }
    },

    prev: function() {
        this.select(parseInt(this.props.params.photoId)-1);
    },

    next: function() {
        this.select(parseInt(this.props.params.photoId)+1);
    },

    render: function() {

        var layoutClass = cx('layout-gallery',{
            'layout-gallery--fade-out': this.state.isFadeOut!==false
        });

        return (
            <div className={layoutClass}>
                <div ref="bkg" className="photos-bkg">
                    {(!this.state.isSwitching) && <div className="main-photo-container">
                        <img className="current-img" src={'images/photos/'+this.props.photos[this.state.currentImgId]} />
                        <img className="next-img" onClick={this.choose} src={'images/photos/'+this.props.photos[this.state.nextImgId]} />
                    </div>}
                    <div className = "arrows">
                        {(this.props.params.photoId!=0) && <div onClick={this.prev} className="left-arrow"></div>}
                        {(this.props.params.photoId<this.props.photos.length-1) && <div onClick={this.next} className="right-arrow"></div>}
                    </div>
                    <div onClick={this.onClose} className="close-button"></div>
                    <div className="gallery-bottom">
                        <div ref="scrollBar" className="mini-photos-scrollBar">
                            <div style={{width: 100*this.props.photos.length+'px', height: '100px'}}>
                                {this.props.photos.map((ph,id)=>{
                                    return <div className="mini-photo">
                                        <img src={'images/photos_mini/'+ph} />
                                        <div onClick={this.select.bind(this,id)} className="hover"></div>
                                    </div>
                                })}
                            </div>
                        </div>
                        {(this.isArrows()) && <div className="scroll-arrows">
                            <div className="v-arrow left-arrow" onClick={this.scrollLeft}></div>
                            <div className="v-arrow right-arrow" onClick={this.scrollRight}></div>
                        </div>}
                    </div>
                </div>

            </div>
        );
    }
});

module.exports = Gallery;