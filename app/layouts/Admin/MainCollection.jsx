var React = require('react');
var cx = require('classnames');
var _ = require('lodash');
var {Navigation} = require('react-router');

var BE = require('utils/BE');
var ImgUploader = require('components/ImgUploader');
var AdminController = require('controllers/AdminController');
var AutoImg = require('components/AutoImg');


var AdminPhotosGallery = React.createClass({
    mixins: [
        Navigation,
        React.addons.LinkedStateMixin
    ],

    getInitialState: function() {
        return {
            loaded: false,
            photos: [],
            loading: false
        }
    },

    componentDidMount: function() {
        this.updatePhotos();
    },

    updatePhotos: function() {
        if (BE.data) {
            this.setState({photos: BE.data.bkgPhotos, loaded: true});
        } else {
            BE.getData().then((data)=>{
                this.setState({photos: data.bkgPhotos, loaded: true});
            });
        }
    },

    addPhoto: function() {
        AdminController.openPhotosChooser.triggerPromise().then((ph,id)=>{
            this.setState({loading: true});
            BE.addPhotoToBkg(ph).then((data)=>{
                this.setState({
                    loading: false,
                    photos: data.bkgPhotos
                });
            }).catch((er)=>{
                console.warn(er);
                this.setState({
                    loading: false
                });
            });
        }).catch((res)=>{

        });
    },

    changePhoto: function(ph) {
        AdminController.openPhotosChooser.triggerPromise().then((nph,id)=>{
            this.setState({loading: true});
            BE.changeBkgPhoto(ph,nph).then((data)=>{
                this.setState({
                    loading: false,
                    photos: data.bkgPhotos
                });
            }).catch((er)=>{
                console.warn(er);
                this.setState({
                    loading: false
                });
            });
        }).catch((res)=>{

        });
    },

    removePhoto: function(ph,id) {
        this.setState({loading: true}, ()=>{
            this.refs['img_'+id].setState({processing: true});
            BE.removePhotoFromBkg(ph).then((data)=>{
                this.setState({
                    loading: false,
                    photos: data.bkgPhotos
                });
            }).catch((er)=>{
                console.warn(er);
                this.setState({
                    loading: false
                });
            });
        });

    },

    render: function() {
        if (!this.state.loaded) return <div className="admin-photos-main-gallery" >
            <h3>Фото слайдер главной страницы</h3>
            <img className="admin-loading" src="images/admin-loading.gif" />
        </div>;

        return (
            <div className="admin-photos-main-gallery" >
                <h3>Фото слайдер главной страницы</h3>
                <div className="actions">
                    {(this.state.loading) ? <img className="admin-loading" src="images/admin-loading.gif" />
                    :
                        <div >
                            <button className="btn admin-margin-1" onClick={this.addPhoto} >добавить</button>
                        </div>}
                </div>
                <div className="admin-photos-main-gallery-container">
                    {this.state.photos.map((ph,id)=>{
                        return <div key={'main_collection'+ph} className="admin-main-gallery-photo-item">
                            <AutoImg ref={'img_'+id}
                                     showSize={true}
                                     showSizeClass="admin-photo-item-size"
                                     className="admin-photo-auto-img"
                                     loadingPlaceholderSrc = "images/admin-loading.gif"
                                     src={'images/photos/'+ph} />
                            <div className = "admin-main-gallery-item-menu">
                                <h2>{id+1}</h2>
                                <div><button className="btn" onClick={this.changePhoto.bind(this,ph)}>другое фото</button></div>
                            </div>
                            <button onClick={this.removePhoto.bind(this,ph,id)} className="btn admin-btn-delete">x</button>
                        </div>;
                    })}
                    {(!this.state.photos.length) && <h2>Добавьте фото для главной страницы</h2>}
                </div>
            </div>
        );
    }
});

module.exports = AdminPhotosGallery;