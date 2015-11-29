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
            this.setState({photos: BE.getCategoryPhotos(this.props.categoryName), loaded: true});
        } else {
            BE.getData().then((data)=>{
                this.setState({photos: BE.getCategoryPhotos(this.props.categoryName), loaded: true});
            });
        }
    },

    addPhoto: function() {
        AdminController.openPhotosChooser.triggerPromise().then((ph,id)=>{
            this.setState({loading: true});
            BE.addPhotoToCategory(ph,this.props.categoryName).then((photos)=>{
                this.setState({
                    loading: false,
                    photos: photos
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
            BE.changeCategoryPhoto(ph,nph,this.props.categoryName).then((photos)=>{
                this.setState({
                    loading: false,
                    photos: photos
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

    close: function() {
        AdminController.openPhotosGallery.close();
    },

    removePhoto: function(ph) {
        this.setState({loading: true});
        BE.deletePhotoFromCategory(ph,this.props.categoryName).then((photos)=>{
            this.setState({
                loading: false,
                photos: photos
            });
        }).catch((er)=>{
            console.warn(er);
            this.setState({
                loading: false
            });
        });
    },

    render: function() {
        if (!this.state.loaded) return <div className="admin-photos-gallery" >
            <h3>Фото категории "{this.props.categoryName}"</h3>
            <img className="admin-loading" src="images/admin-loading.gif" />
        </div>;

        return (
            <div className="admin-photos-gallery" >
                <h3>Фото категории "{this.props.categoryName}"</h3>
                <div className="actions">
                    {(this.state.loading) ? <img className="admin-loading" src="images/admin-loading.gif" />
                    :
                        <div >
                            <button className="btn admin-margin-1" onClick={this.addPhoto} >добавить фото</button>
                            <button className="btn admin-margin-1" onClick={this.close} >закрыть</button>
                        </div>}
                </div>
                <div className="admin-photos-gallery-container">
                    {this.state.photos.map((ph,id)=>{
                        return <div key={ph+this.props.categoryName} className="admin-gallery-photo-item">
                            <AutoImg ref={'img_'+id}
                                     showSize={true}
                                     showSizeClass="admin-photo-item-size"
                                     className="admin-photo-auto-img"
                                     loadingPlaceholderSrc = "images/admin-loading.gif"
                                     src={'images/photos/'+ph} />
                            <div className = "admin-gallery-item-menu">
                                <button className="btn" onClick={this.changePhoto.bind(this,ph)}>другое фото</button>
                            </div>
                            <button onClick={this.removePhoto.bind(this,ph)} className="btn admin-btn-delete">x</button>
                        </div>;
                    })}
                </div>
            </div>
        );
    }
});

module.exports = AdminPhotosGallery;