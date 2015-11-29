var React = require('react');
var cx = require('classnames');
var _ = require('lodash');
var {Navigation} = require('react-router');
var BE = require('utils/BE');
var Reflux = require('reflux');

var ImgUploader = require('components/ImgUploader');

var PhotosChooser = require('layouts/Admin/PhotosChooser');
var PhotosGallery = require('layouts/Admin/PhotosGallery');
var MainCollection = require('layouts/Admin/MainCollection');
var AllPhotos = require('layouts/Admin/AllPhotos');
var Categories = require('layouts/Admin/Categories');

var AdminController = require('controllers/AdminController');

var menu = [
    {tab: 'allPhotos',title: 'все фото'},
    {tab: 'categories',title: 'категории'},
    {tab: 'main',title: 'главная'},
    {tab: 'feedback',title: 'отзывы'},
    {tab: 'service',title: 'услуги'},
    {tab: 'contacts',title: 'контакты'}
];

var Component = React.createClass({
    mixins: [
        Navigation,
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
            galleryCategory: null
        }
    },

    data: null,

    componentDidMount: function() {
        BE.getData().then((data)=>{
            console.info(data);
            this.data = data;
            this.forceUpdate();
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

    render: function() {
        if (!this.data) return <img className="admin-loading admin-margin-1" src="images/admin-loading.gif" />;

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
                </div>
                {(this.state.photosGalleryOpened) && <PhotosGallery categoryName = {this.state.galleryCategory} />}
                {(this.state.photosChooserOpened) && <PhotosChooser  />}
            </div>
        );
    }
});

module.exports = Component;