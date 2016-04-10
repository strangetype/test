var React = require('react');
var cx = require('classnames');
var _ = require('lodash');
var {Navigation} = require('react-router');
var BE = require('utils/BE');
var Reflux = require('reflux');

var TimerMixin = require('react-timer-mixin');

var ImgUploader = require('components/ImgUploader');

var PhotosChooser = require('layouts/Admin/PhotosChooser');
var PhotosGallery = require('layouts/Admin/PhotosGallery');
var MainCollection = require('layouts/Admin/MainCollection');
var Feedbacks = require('layouts/Admin/Feedbacks');
var AllPhotos = require('layouts/Admin/AllPhotos');
var Categories = require('layouts/Admin/Categories');
var Services = require('layouts/Admin/Services');

var AdminController = require('controllers/AdminController');

var menu = [
    {tab: 'allPhotos',title: 'все фото'},
    {tab: 'categories',title: 'категории'},
    {tab: 'main',title: 'главная'},
    {tab: 'feedbacks',title: 'отзывы'},
    {tab: 'services',title: 'услуги'},
   // {tab: 'contacts',title: 'контакты'}
];

var Component = React.createClass({
    mixins: [
        Navigation,
        TimerMixin,
        React.addons.LinkedStateMixin,
        Reflux.listenTo(AdminController.openPhotosChooser,'openPhotosChooser'),
        Reflux.listenTo(AdminController.openPhotosGallery,'openPhotosGallery'),
        Reflux.listenTo(AdminController.openPhotosGallery.close,'closePhotosGallery'),
        Reflux.listenTo(AdminController.openPhotosChooser.completed,'closePhotosChooser'),
        Reflux.listenTo(AdminController.openPhotosChooser.failed,'closePhotosChooser')
    ],

    getInitialState: function() {
        return {
            tab: 'allPhotos',
            photosChooserOpened: false,
            photosGalleryOpened: false,
            galleryCategory: null,
            login: null,
            pass: null,
            loginErrorMessage: null,
            isAuth: false,
            isLoginWaiting: false
        }
    },

    data: null,

    componentDidMount: function() {
        this._loadData();
        this._startAuthCheck();
    },

    _startAuthCheck: function() {
        this.setInterval(()=>{
            if (this.state.isAuth) {
                BE.isAuth().then((res)=> {
                    this.setState({
                        isAuth: res
                    });
                    if (!res) {
                        this.setState({
                            loginErrorMessage: "сбой авторизации, войдите заново"
                        });
                    }
                });
            }
        },5000);
    },

    _loadData: function() {
        BE.isAuth().then((res)=> {
            this.setState({
                isAuth: res
            });
            if (res) {
                BE.getData().then((data)=>{
                    this.data = data;
                    this.forceUpdate();
                });
            }
        });
    },

    upload: function(file) {

    },

    setTab: function(tab) {
        this.setState({tab: tab});
    },

    openPhotosChooser: function() {
        this.setState({photosChooserOpened: true});
    },

    closePhotosChooser: function() {
        this.setState({photosChooserOpened: false});
    },

    openPhotosGallery: function(cname) {
        this.setState({photosGalleryOpened: true, galleryCategory: cname});
    },

    closePhotosGallery: function() {
        this.setState({photosGalleryOpened: false});
    },

    changeLogin: function(e) {
        this.setState({
            login: e.target.value
        });
    },

    changePassword: function(e) {
        this.setState({
            pass: e.target.value
        });
    },

    login: function() {
        this.setState({
            loginErrorMessage: null
        });
        BE.login(this.state.login, this.state.pass).then((data)=>{
            if (data.error) {
                this.setState({
                    loginErrorMessage: data.errorMessage
                });
            } else {
                this.setState({
                    isAuth: data.isAuth,
                    loginErrorMessage: null
                });
                this._loadData();
            }
        });
    },

    render: function() {
        if (!this.data && this.state.isAuth) return <img className="admin-loading admin-margin-1" src="images/admin-loading.gif" />;

        if (!this.state.isAuth) return <div className="layout-admin">
                <div className="admin-login-form">
                    <h3>Вход в Админку</h3>
                    <input className="admin-input" value={this.state.login} onChange={this.changeLogin} type="text" placeholder="login" />
                    <input className="admin-input" value={this.state.pass} onChange={this.changePassword} type="password" placeholder="password" />
                    {(!this.state.isLoginWaiting) && <label className="admin-input" style={{"cursor": "pointer"}} onClick={this.login} >вход</label>}
                    {(this.state.isLoginWaiting) && <img className="admin-loading admin-margin-1" src="images/admin-loading.gif" />}
                    {!!(this.state.loginErrorMessage) && <div><div className="admin-error-message admin-margin-1">
                        {this.state.loginErrorMessage}
                    </div></div>}
                </div>
        </div>;

        return (
            <div className="layout-admin" >
                <div className="top-menu">
                    {menu.map((item)=>{
                        return <button className={(item.tab===this.state.tab) && 'active'} onClick={this.setTab.bind(this,item.tab)}>{item.title}</button>;
                    })}
                </div>
                <div className="admin-body">
                    {(this.state.tab==='allPhotos') && <AllPhotos />}
                    {(this.state.tab==='categories') && <Categories />}
                    {(this.state.tab==='main') && <MainCollection />}
                    {(this.state.tab==='feedbacks') && <Feedbacks />}
                    {(this.state.tab==='services') && <Services />}
                </div>
                {(this.state.photosGalleryOpened) && <PhotosGallery categoryName = {this.state.galleryCategory} />}
                {(this.state.photosChooserOpened) && <PhotosChooser  />}
            </div>
        );
    }
});

module.exports = Component;