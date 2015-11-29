var React = require('react');
var cx = require('classnames');
var _ = require('lodash');
var {Navigation} = require('react-router');

var BE = require('utils/BE');
var ImgUploader = require('components/ImgUploader');
var AdminController = require('controllers/AdminController');
var AutoImg = require('components/AutoImg');


var Component = React.createClass({
    mixins: [
        Navigation,
        React.addons.LinkedStateMixin
    ],

    getInitialState: function() {
        return {
            photos: [],
            uploadOpened: false,
            loading: false,
            loaded: false
        }
    },

    componentDidMount: function() {
        this.updatePhotos();
    },

    upload: function(file,fileURI,crop) {
        this.closeUploader();
        this.setState({loading: true});
        BE.uploadPhoto(file,'file',crop).then(()=>{
            this.updatePhotos();
        });
    },

    updatePhotos: function() {
        BE.getPhotos().then((photos)=>{
            this.setState({photos: photos, loading: false, loaded: true})
        });
    },

    openUploader: function() {
        this.setState({uploadOpened: true});
    },

    closeUploader: function() {
        this.setState({uploadOpened: false});
    },

    close: function() {
        AdminController.openPhotosChooser.failed();
    },

    select: function(ph) {
        AdminController.openPhotosChooser.completed(ph);
    },

    render: function() {
        if (!this.state.loaded) return <div className="admin-photos-chooser" >
            <h3>Выбор фото: </h3>
            <img className="admin-loading" src="images/admin-loading.gif" />
        </div>;

        return (
            <div className="admin-photos-chooser" >
                <h3>Выберите фото: </h3>
                <div className="actions">
                    <button className="btn admin-margin-1" onClick={this.openUploader} >загрузить фото</button>
                    <button className="btn admin-margin-1" onClick={this.close} >закрыть</button>
                    {(this.state.loading) && <img className="admin-loading" src="images/admin-loading.gif" />}
                </div>
                <div className="admin-photos-container">
                    {this.state.photos.map((ph,id)=>{
                        return <div onClick={this.select.bind(this,ph)} className="admin-photo-item">
                            <AutoImg ref={'img_'+id}
                                     showSize={true}
                                     showSizeClass="admin-photo-item-size"
                                     className="admin-photo-auto-img"
                                     loadingPlaceholderSrc = "images/admin-loading.gif"
                                     src={'images/photos/'+ph} />
                        </div>;
                    })}
                    {(!this.state.photos.length) && <h2>Не загружено ни одного фото</h2>}
                </div>
                {(this.state.uploadOpened) && <ImgUploader onSubmit={this.upload} onClose={this.closeUploader} />}
            </div>
        );
    }
});

module.exports = Component;