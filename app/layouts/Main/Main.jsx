var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var {Navigation} = require('react-router');

var LayoutCategories= require('layouts/Gallery/Categories');
var LayoutSubCategories = require('layouts/Gallery/SubCategories');
var LayoutGallery = require('layouts/Gallery/Gallery');
var LayoutServices = require('layouts/Services/Services');
var LayoutContacts = require('layouts/Contacts/Contacts');
var LayoutFeedback = require('layouts/Feedback/Feedback');
var LayoutAdvices = require('layouts/Advices/Advices');
var LayoutPhotoPreview = require('layouts/Gallery/PhotoPreview');

var BE = require('utils/BE');

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

    data: BE.data,
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
        BE.getData().then((data)=>{
            this.data = BE.data;
            this.imagesCount = BE.data.bkgPhotos.length-1;
            this.prevImage = BE.data.bkgPhotos.length-1;
            this.forceUpdate();
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
        {name: 'contacts', title: 'Контакты'},
        {name: 'feedback', title: 'Отзывы'}
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

        if (!this.currentRoute[1]) {
            this.pushImagesChanging();
            this.setState({
                isBlured: false
            });
            this.changeScreen(null);
        } else {
            this.stopImagesChanging();
            this.setState({isBlured: true});
            if (this.currentRoute[1]==='gallery') {
                if (this.props.params) {
                    if (this.props.params.category) {
                        var c = this._findCategory(this.props.params.category);
                        if (!this.props.params.photoId) this.props.params.photoId = 0;
                        if (c) {
                            this.photos = c.photos;
                            this.changeScreen('photos');
                        }
                        return;
                    }
                }
                if (this.data.categories && this.data.categories.length===1) {
                    this.context.router.transitionTo('gallery-photos',{'category': this.data.categories[0].name});
                    return;
                }
                this.changeScreen('categories');
            }
            if (this.currentRoute[1]==='services') {
                this.changeScreen('services');
            }
            if (this.currentRoute[1]==='contacts') {
                this.changeScreen('contacts');
            }
            if (this.currentRoute[1]==='feedback') {
                this.changeScreen('feedback');
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

    photoChoose: function(photo,id) {
        this.context.router.transitionTo('gallery-photo',{'category': this.props.params.category, photoId: id});
    },

    closePhoto: function() {
        this.context.router.transitionTo('gallery-photos',{'category': this.props.params.category});
    },

    showNextPhoto: function() {
        this.isFirstPhoto = false;
        this.isLastPhoto = false;
        var c = this._findCategory(this.props.params.category);
        var id = parseInt(this.props.params.photoId);
        id = id+1;
        if (c.photos[id]) {
            if (!c.photos[id+1]) this.isLastPhoto = true;
            this.context.router.transitionTo('gallery-photo',{
                'category': this.props.params.category,
                photoId: id
            });
        }

    },

    showPrevPhoto: function() {
        this.isFirstPhoto = false;
        this.isLastPhoto = false;
        var c = this._findCategory(this.props.params.category);
        var id = parseInt(this.props.params.photoId);
        id = id-1;
        if (c.photos[id]) {
            var p = c.photos[id];
            if (!c.photos[id-1]) this.isFirstPhoto = true;
            this.context.router.transitionTo('gallery-photo', {
                'category': this.props.params.category,
                photoId: id
            });
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
            'left-menu--hidden':
            this.state.nextScreen==='photos' || this.state.prevScreen==='photos'
        });

        return (
            <div className={mainLayoutClass}>

                {this.data.bkgPhotos.map((p,i)=>{
                    var st = {
                        opacity: 0
                    };
                    if (this.activeImage === i) st.opacity = 1;
                    if (!(this.nextImage === i || this.prevImage === i || this.activeImage === i)) return null;
                    return <img key={i} className="main-image" style={st} src ={'images/photos/'+p}/>;
                })}

                <div className="main-image-shadow"></div>
                <div className="photographer-title hide-on-blur">
                    <img className="framing" src="images/framing.png" />
                </div>
                <div className = "arrows hide-on-blur">
                    <div onClick={this.prevBkg} className="left-arrow"></div>
                    <div onClick={this.nextBkg} className="right-arrow"></div>
                </div>

                {(this.state.nextScreen==='categories' || this.state.prevScreen==='categories') && <LayoutCategories categories={this.data.categories} ref="categories" onSelect = {this.categoryChoose} />}
                {(this.state.nextScreen==='subCategories' || this.state.prevScreen==='subCategories') && <LayoutSubCategories subCategories={this.subCategories} ref="subCategories" onSelect = {this.subCategoryChoose} />}
                {(this.state.nextScreen==='services' || this.state.prevScreen==='services') && <LayoutServices ref="services"  />}
                {(this.state.nextScreen==='contacts' || this.state.prevScreen==='contacts') && <LayoutContacts ref="contacts"  />}
                {(this.state.nextScreen==='feedback' || this.state.prevScreen==='feedback') && <LayoutFeedback ref="feedback" feedbacks={this.data.feedbacks} />}

                <div className = {leftMenuClass}>
                    <ul>
                        {this.routes.map((r,i)=>{
                            var c = '';
                            if (r.name===this.currentRoute[1]) {
                                c = "active";
                            } else {
                                if (i===0 && !this.currentRoute[1]) c = "active";
                            };
                            return <li className={c} onClick={this.context.router.transitionTo.bind(this,r.name)} >
                                {r.title}
                                {(i!==this.routes.length-1) && <div className="separator"></div>}
                            </li>
                        })}
                    </ul>
                </div>

                {(this.state.nextScreen==='photos' || this.state.prevScreen==='photos') && <LayoutGallery categoriesCount={this.data.categories.length} params = {this.props.params} photos={this.photos} ref="photos" onSelect={this.photoChoose} />}

            </div>

        );
    }
});

module.exports = Component;