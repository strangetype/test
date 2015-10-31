var React = require('react');

var _ = require('lodash');

var Component = React.createClass({

    imagesCount: 15,
    activeImage: 0,
    nextImage: 1,
    prevImage: 15,
    interval: 10000,
    blocked: false,
    imagesTimer: null,

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

    render: function() {

        var points = [];

        for (var i=0; i<=this.imagesCount; i++) {
            points.push(i);
        }

        return (
            <div className="layout-main">

                {points.map((i)=>{
                    var st = {
                        opacity: 0
                    };
                    if (this.activeImage === i) st.opacity = 1;
                    if (!(this.nextImage === i || this.prevImage === i || this.activeImage === i)) return null;
                    return <img className="main-image" style={st} src ={"images/main"+i+".jpg"}/>;
                })}


                <div className="main-image-shadow"></div>
                <div className = "left-menu">
                    <ul>
                        <li>Главная</li>
                        <li className="separator"></li>
                        <li>Портфолио</li>
                        <li className="separator"></li>
                        <li>Услуги</li>
                        <li className="separator"></li>
                        <li>Отзывы</li>
                        <li className="separator"></li>
                        <li>Контакты</li>
                    </ul>
                </div>
                <div className="photographer-title">
                    <h1 >Мария Тропина</h1>
                    <img className="framing" src="images/framing.png" />
                    <h2 >детский фотограф</h2>
                </div>
                <div className = "arrows">
                    <div onClick={this.prevBkg} className="left-arrow"></div>
                    <div onClick={this.nextBkg} className="right-arrow"></div>
                </div>
            </div>

        );
    }
});

module.exports = Component;