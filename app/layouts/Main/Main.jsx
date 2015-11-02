var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var {Navigation} = require('react-router');

var LayoutCategories= require('layouts/Gallery/Categories');
var LayoutSubCategories = require('layouts/Gallery/SubCategories');

var Component = React.createClass({

    imagesCount: 15,
    activeImage: 0,
    nextImage: 1,
    prevImage: 15,
    interval: 10000,
    blocked: false,
    imagesTimer: null,

    mixins: [
        Navigation,
        React.addons.LinkedStateMixin
    ],

    getInitialState: function() {
        return {
            isBlured: false,
            nextScreen: null,
            prevScreen: null
        }
    },

    getDefaultProps: function() {

    },

    componentWillMount: function() {
        this.currentRoute = this.context.router.getCurrentPathname().split('/');
        this._triggerByRoute();
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
        {name: 'services', title: 'Услуги'},
        {name: 'feedback', title: 'Отзывы'},
        {name: 'contacts', title: 'Контакты'}
    ],

    currentRoute: [],

    _compareRoutes: function(newRoute) {
        var result = false;
        _.forEach(newRoute,(r,i)=>{
            if (r!==this.currentRoute[i]) result = true;
        });
        if (newRoute.length!==this.currentRoute.length) result = true;
        return result;
    },

    componentDidUpdate: function() {
        var newRoute = this.context.router.getCurrentPathname().split('/');
        if (this._compareRoutes(newRoute)) {
            this.currentRoute = newRoute;
            this._triggerByRoute();
        }
    },

    _triggerByRoute: function() {
        if (!this.currentRoute[2]) {
            this.pushImagesChanging();
            this.setState({
                isBlured: false
            });
            this.changeScreen(null);
        } else {
            this.stopImagesChanging();
            this.setState({isBlured: true});
            if (this.currentRoute[2]==='gallery') {
                if (this.props.params && this.props.params.category) {
                    this.changeScreen('subCategories');
                } else {
                    this.changeScreen('categories');
                }
            }
        }

    },

    changeScreenTimer: null,

    changeScreen: function(screen) {
        clearTimeout(this.changeScreenTimer);
        _.forEach(this.refs,(ref,name)=>{
            if (name!==screen) {
                if (typeof(ref.fadeOut)==='function') ref.fadeOut();
            } else {
                ref.fadeIn();
            }
        });
        this.setState({nextScreen: screen});
        this.changeScreenTimer = setTimeout(()=>{
            this.setState({prevScreen: screen});
        },1000);
    },

    categoryChoose: function(categoryName) {
        this.context.router.transitionTo('gallery-subCategories',{'category': categoryName}, {});
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

                {(this.state.nextScreen==='categories' || this.state.prevScreen==='categories') && <LayoutCategories ref="categories" onSelect = {this.categoryChoose} />}
                {(this.state.nextScreen==='subCategories' || this.state.prevScreen==='subCategories') && <LayoutSubCategories ref="subCategories" />}

                <div className = "left-menu">
                    <ul>
                        {this.routes.map((r,i)=>{
                            var c = '';
                            if (r.name===this.currentRoute[2]) {
                                c = "active";
                            } else {
                                if (i===0 && !this.currentRoute[2]) c = "active";
                            };
                            return <li className={c} onClick={this.context.router.transitionTo.bind(this,r.name)} >
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