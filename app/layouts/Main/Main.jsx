var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var {Navigation} = require('react-router');

var LayoutCategories= require('layouts/Gallery/Categories');
var LayoutSubCategories = require('layouts/Gallery/SubCategories');
var LayoutGallery = require('layouts/Gallery/Gallery');
var LayoutPhotoPreview = require('layouts/Gallery/PhotoPreview');

var http = require('superagent');

var Component = React.createClass({

    imagesCount: 15,
    activeImage: 0,
    nextImage: 1,
    prevImage: 15,
    interval: 5000,
    blocked: false,
    imagesTimer: null,

    mixins: [
        Navigation,
        React.addons.LinkedStateMixin
    ],

    data: null,
    subCategories: [],
    photos: [],
    photo: null,
    isLastPhoto: false,
    isFirstPhoto: false,

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
        http
            .get('BE/data.json')
            .accept('application/json')
            .end((a,res)=>{
                setTimeout(()=>{
                    this.data = res.body;

                    this.currentRoute = this.context.router.getCurrentPathname().split('/');
                    this._triggerByRoute();

                    this.forceUpdate();
                },Math.round(Math.random()*3000));
            });
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

    _findCategory: function(category) {
        var id = _.findIndex(this.data.categories,(c)=>{
            return c.name===category;
        });
        var result = null;
        if (id===-1) {
            _.forEach(this.data.categories,(c)=>{
                if (c.subCategories && c.subCategories.length) {
                    id = _.findIndex(c.subCategories,(sc)=>{
                        return sc.name===category;
                    });
                    if (id!==-1) {
                        result = c.subCategories[id];
                    }
                }
            });
        } else {
            result = this.data.categories[id];
        }
        return result;
    },

    _triggerByRoute: function() {
        this.isFirstPhoto = false;
        this.isLastPhoto = false;

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
                if (this.props.params) {
                    if (this.props.params.category && !this.props.params.photoId) {
                        var c = this._findCategory(this.props.params.category);
                        if (c) {
                            this.photos = c.photos;
                            this.changeScreen('photos');
                        }
                        return;
                    }
                    if (this.props.params.category && this.props.params.photoId) {
                        var c = this._findCategory(this.props.params.category);
                        if (c) {
                            this.photos = c.photos;
                            var pid = _.findIndex(c.photos,(p)=>{
                                return p.id === this.props.params.photoId;
                            });
                            if (pid!==-1) {
                                this.photo = c.photos[pid];
                                if (!c.photos[pid+1]) this.isLastPhoto = true;
                                if (!c.photos[pid-1]) this.isFirstPhoto = true;
                                this.changeScreen('photoPreview');
                            }
                        }
                        return;
                    }
                }
                this.changeScreen('categories');
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

    categoryChoose: function(category,id) {
        if (category && category.subCategories && category.subCategories.length) {
            this.subCategories = category.subCategories;
            this.changeScreen('subCategories');
        } else {
            this.context.router.transitionTo('gallery-photos',{'category': category.name});
        }
    },

    subCategoryChoose: function(category,id) {
        this.context.router.transitionTo('gallery-photos',{'category': category.name});
    },

    photoChoose: function(photo) {
        this.context.router.transitionTo('gallery-photo',{'category': this.props.params.category, photoId: photo.id});
    },

    closePhoto: function() {
        this.context.router.transitionTo('gallery-photos',{'category': this.props.params.category});
    },

    showNextPhoto: function() {
        this.isFirstPhoto = false;
        this.isLastPhoto = false;
        var c = this._findCategory(this.props.params.category);
        var id = _.findIndex(c.photos,(p)=>{
            return p.id===this.props.params.photoId
        });
        if (id!==-1) {
            id = id+1;
            if (c.photos[id]) {
                var p = c.photos[id];
                if (!c.photos[id+1]) this.isLastPhoto = true;
                this.context.router.transitionTo('gallery-photo',{'category': this.props.params.category, photoId: p.id});
            }
        }
    },

    showPrevPhoto: function() {
        this.isFirstPhoto = false;
        this.isLastPhoto = false;
        var c = this._findCategory(this.props.params.category);
        var id = _.findIndex(c.photos,(p)=>{
            return p.id===this.props.params.photoId
        });
        if (id!==-1) {
            id = id-1;
            if (c.photos[id]) {
                var p = c.photos[id];
                if (!c.photos[id-1]) this.isFirstPhoto = true;
                this.context.router.transitionTo('gallery-photo', {
                    'category': this.props.params.category,
                    photoId: p.id
                });
            }
        }
    },

    render: function() {
        if (!this.data) return (
            <div style={{
                    fontFamily: 'calibri',
                    color: "#666",
                    position: "absolute",
                    left: 0, right: 0, top: 0, bottom: 0,
                    margin: "auto",
                    width: "10em",
                    height: "2em"
                }}>loading...</div>
        );


        var mainLayoutClass = cx('layout-main', {
            'layout-main--blured': this.state.isBlured
        });

        var leftMenuClass = cx('left-menu', {
            'left-menu--hidden': this.state.nextScreen==='photoPreview' || this.state.prevScreen==='photoPreview'
        });

        return (
            <div className={mainLayoutClass}>

                {this.data.bkgPhotos.map((p,i)=>{
                    var st = {
                        opacity: 0
                    };
                    if (this.activeImage === i) st.opacity = 1;
                    if (!(this.nextImage === i || this.prevImage === i || this.activeImage === i)) return null;
                    return <img className="main-image" style={st} src ={p.imgSrc}/>;
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

                {(this.state.nextScreen==='categories' || this.state.prevScreen==='categories') && <LayoutCategories categories={this.data.categories} ref="categories" onSelect = {this.categoryChoose} />}
                {(this.state.nextScreen==='subCategories' || this.state.prevScreen==='subCategories') && <LayoutSubCategories subCategories={this.subCategories} ref="subCategories" onSelect = {this.subCategoryChoose} />}
                {(this.state.nextScreen==='photos' || this.state.prevScreen==='photos') && <LayoutGallery photos={this.photos} ref="photos" onSelect={this.photoChoose} />}

                <div className = {leftMenuClass}>
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

                {(this.state.nextScreen==='photoPreview' || this.state.prevScreen==='photoPreview') && <LayoutPhotoPreview
                    onClose={this.closePhoto}
                    onNext={this.showNextPhoto}
                    onPrev={this.showPrevPhoto}

                    disableLeft={this.isFirstPhoto}
                    disableRight={this.isLastPhoto}

                    photo={this.photo}
                    ref="photoPreview" />}

            </div>

        );
    }
});

module.exports = Component;