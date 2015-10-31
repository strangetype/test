var React = require('react');

var _ = require('lodash');

var Component = React.createClass({

    imagesCount: 19,
    ci1: 0,
    ci2: 19,
    bkg1: null,
    bkg2: null,
    activeImage: 0,

    componentDidMount: function() {

        this.bkg1 = this.refs.background.getDOMNode();
        this.bkg1.style.opacity = 1;
        this.bkg1.style.transition = 'opacity 1s';

        this.bkg2 = this.refs._background.getDOMNode();
        this.bkg2.style.opacity = 0;
        this.bkg2.style.transition = 'opacity 1s';

        setInterval(()=>{
            this.bkgChange();
        },5000);
    },

    _order: 1,

    bkgChange: function() {
        if (this._order===1) {
            this.ci2 = this.ci2+2;
            if (this.ci2>this.imagesCount) this.ci2 = 1;
            this.activeImage = this.ci2;
            this.forceUpdate();
            this.bkg1.style.opacity = 0;
            this.bkg2.style.opacity = 1;
            this._order = 2;

        } else {
            this.ci1 = this.ci1+2;
            if (this.ci1>this.imagesCount) this.ci1 = 0;
            this.activeImage = this.ci1;
            this.forceUpdate();
            this.bkg1.style.opacity = 1;
            this.bkg2.style.opacity = 0;
            this._order = 1;
        }
    },

    render: function() {

        var points = [];

        for (var i=0; i<=this.imagesCount; i++) {
            points.push(i);
        }

        return (
            <div className="layout-main">
                <img ref="background" className="main-image" src ={"images/main"+this.ci1+".jpg"}/>
                <img ref="_background" className="main-image" src ={"images/main"+this.ci2+".jpg"}/>
                <div className="main-image-shadow"></div>
                <div className="logo">
                    <img className="camera-logo" src="images/camera.png" />
                    <img className="camera-wreath-logo" src="images/camera-wreath.png" />
                </div>
                <div className = "left-menu">
                    <ul>
                        <li>Дети</li>
                        <li>Портреты</li>
                        <li>Семейные фото</li>
                        <li>Стоимость</li>
                        <li>Контакты</li>
                    </ul>
                </div>
                <div className="photographer-title">
                    <h1 >Мария Тропина</h1>
                    <img className="framing" src="images/framing.png" />
                    <h2 >детский фотограф</h2>
                </div>
                <div className="points">
                    {points.map((p)=>{
                        return <div className = {(p===this.activeImage) ? "point point--active" : "point"} ></div>
                    })}
                </div>
            </div>

        );
    }
});

module.exports = Component;