var React = require('react');
var cx = require('classnames');
var _ = require('lodash');
var {Navigation} = require('react-router');

var BE = require('utils/BE');
var ImgUploader = require('components/ImgUploader');
var AdminController = require('controllers/AdminController');

var Component = React.createClass({
    mixins: [
        Navigation,
        React.addons.LinkedStateMixin
    ],

    getInitialState: function() {
        return {
            photos: [],
            uploadOpened: false,
            loading: false
        }
    },

    componentDidMount: function() {
        this.updatePhotos();
    },

    upload: function(file) {
        this.closeUploader();
        this.setState({loading: true});
        BE.uploadPhoto(file,'dataURI').then(()=>{
            this.updatePhotos();
        });
    },

    updatePhotos: function() {
        BE.getPhotos().then((photos)=>{
            this.setState({photos: photos, loading: false})
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
        if (!this.state.photos.length) return <div className="admin-photos-chooser" >
            <h3>Выбор фото: </h3>
            <img className="admin-loading" src="images/admin-loading.gif" />
        </div>;

        return (
            <div className="admin-photos-chooser" >
                <h3>Выбор фото: </h3>
                <div className="actions">
                    <button className="btn admin-margin-1" onClick={this.openUploader} >добавить фото</button>
                    <button className="btn admin-margin-1" onClick={this.close} >закрыть</button>
                    {(this.state.loading) && <img className="admin-loading" src="images/admin-loading.gif" />}
                </div>
                <div className="admin-photos-container">
                    {this.state.photos.map((ph,id)=>{
                        return <div onClick={this.select.bind(this,ph)} className="admin-photo-item">
                            <img ref={'img_'+id} src={'images/photos/'+ph} />
                        </div>;
                    })}
                </div>
                {(this.state.uploadOpened) && <ImgUploader onSubmit={this.upload} onClose={this.closeUploader} />}
            </div>
        );
    }
});

module.exports = Component;