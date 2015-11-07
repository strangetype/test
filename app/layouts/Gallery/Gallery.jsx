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

    sourcePhotos: [

    ],

    photos: [],

    _findByX: function(x) {
        var id = null;
        _.forEach(this.sourcePhotos,(p,i)=>{
            if (p.x<=x && id===null && !p.isAdded) id = i;
        });
        return id;
    },

    _find: function() {
        var id = null;
        _.forEach(this.sourcePhotos,(p,i)=>{
            if (id===null && !p.isAdded) id = i;
        });
        return id;
    },

    photoHeight: 100,

    componentWillMount: function() {
        this.sourcePhotos =[];
        for (var i=0; i<=30; i++) {
            this.sourcePhotos.push(_getRandomImg());
        }

        this.photos = [this.sourcePhotos[0]];
        this.sourcePhotos[0].isAdded = true;
        var remain = _maxXSize - this.photos[0].x;

        while (this.photos.length<this.sourcePhotos.length) {
            if (remain) {
                var id = this._findByX(remain);
                if (id!==null) {
                    this.photos.push(this.sourcePhotos[id]);
                    this.sourcePhotos[id].isAdded = true;
                    remain = remain - this.sourcePhotos[id].x;
                } else {
                    id = this._find();
                    this.photos.push(this.sourcePhotos[id]);
                    this.sourcePhotos[id].isAdded = true;
                    remain = _maxXSize - this.sourcePhotos[id].x;
                }
            } else {
               var  id = this._find();
                this.photos.push(this.sourcePhotos[id]);
                this.sourcePhotos[id].isAdded = true;
                remain = _maxXSize - this.sourcePhotos[id].x;
            }
            console.log(this.photos.length, this.sourcePhotos.length);
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

    choose: function(img,id) {
        this.setState({selected: id, isFadeOut: true},()=>{
            if (typeof(this.props.onSelect)==='function') {
                this.props.onSelect(id);
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
                    {this.photos.map((p,i)=>{
                        return (
                            <div onClick={this.choose.bind(this,p,i)} className="photo" style={{width: p.x*(100/_maxXSize)+'%', height: this.photoHeight+'px', backgroundImage: "url("+'images/photos/'+i+'.jpg'+")"}}></div>
                        );
                    })}
                </div>
            </div>
        );
    }
});

module.exports = Component;