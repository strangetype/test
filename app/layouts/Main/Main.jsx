var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var LayoutGallery = require('layouts/Gallery/Gallery');
var LayoutGallery2 = require('layouts/Gallery2/Gallery2');

var Component = React.createClass({

    imagesCount: 15,
    activeImage: 0,
    nextImage: 1,
    prevImage: 15,
    interval: 10000,
    blocked: false,
    imagesTimer: null,

    getInitialState: function() {
        return {
            isBlured: false
        }
    },

    componentDidMount: function() {
        this.pushImagesChanging();
    },

    _order: 1,

    pushImagesChanging: function() {
        clearTimeout(this.imagesTimer);
        this.imagesTimer = setTimeout(()=>{
            this.nextBkg();
        },this.interval);
    },

    stopImagesChanging: function() {
        clearTimeout(this.imagesTimer);
    },

    nextBkg: function() {
        this.pushImagesChanging();
        this.nextImage += 1;
        this.activeImage += 1;
        this.prevImage += 1;
        if (this.nextImage>this.imagesCount) this.nextImage = 0;
        if (this.activeImage>this.imagesCount) this.activeImage = 0;
        if (this.prevImage>this.imagesCount) this.prevImage = 0;
        this.forceUpdate();
    },

    prevBkg: function() {
        this.pushImagesChanging();
        this.nextImage -= 1;
        this.activeImage -= 1;
        this.prevImage -= 1;
        if (this.nextImage<0) this.nextImage = this.imagesCount;
        if (this.activeImage<0) this.activeImage = this.imagesCount;
        if (this.prevImage<0) this.prevImage = this.imagesCount;
        this.forceUpdate();
    },

    routes: [
        {name: 'main', title: 'Главная'},
        {name: 'gallery', title: 'Галерея'},
        {name: 'services', title: 'Сервисы'},
        {name: 'feedback', title: 'Отзывы'},
        {name: 'contacts', title: 'Контакты'}
    ],

    currentRoute: 'main',
    currentRoute2: null,

    goTo: function(name) {
        this.currentRoute = name;
        this.currentRoute2 = null;
        if (name==='main') {
            this.pushImagesChanging();
            this.setState({isBlured: false});
        } else {
            this.stopImagesChanging();
            this.setState({isBlured: true});
        }
    },

    goTo2: function(name,i) {
        this.currentRoute2 = name+i;
        this.forceUpdate();
    },

    render: function() {

        var points = [];

        for (var i=0; i<=this.imagesCount; i++) {
            points.push(i);
        }

        var mainLayoutClass = cx('layout-main', {
            'layout-main--blured': this.state.isBlured
        });

        return (
            <div className={mainLayoutClass}>

                {points.map((i)=>{
                    var st = {
                        opacity: 0
                    };
                    if (this.activeImage === i) st.opacity = 1;
                    if (!(this.nextImage === i || this.prevImage === i || this.activeImage === i)) return null;
                    return <img className="main-image" style={st} src ={"images/main"+i+".jpg"}/>;
                })}

                <div className="main-image-shadow"></div>
                <div className="photographer-title hide-on-blur">
                    <h1 >Мария Тропина</h1>
                    <img className="framing" src="images/framing.png" />
                    <h2 >детский фотограф</h2>
                </div>
                <div className = "arrows hide-on-blur">
                    <div onClick={this.prevBkg} className="left-arrow"></div>
                    <div onClick={this.nextBkg} className="right-arrow"></div>
                </div>

                {(this.currentRoute==="gallery") && <LayoutGallery onSelect = {this.goTo2.bind(this,'gallery')} />}
                {(this.currentRoute2==="gallery1") && <LayoutGallery2 />}

                <div className = "left-menu">
                    <ul>
                        {this.routes.map((r,i)=>{
                            var c = '';
                            if (r.name===this.currentRoute) c = "active";
                            return <li className={c} onClick={this.goTo.bind(this,r.name)} >
                                {r.title}
                                {(i!==this.routes.length-1) && <div className="separator"></div>}
                            </li>
                        })}
                    </ul>
                </div>
            </div>

        );
    }
});

module.exports = Component;