var React = require('react');
var cx = require('classnames');
var _ = require('lodash');
var {Navigation} = require('react-router');
var BE = require('utils/BE');

var ImgUploader = require('components/ImgUploader');
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

    upload: function(file) {
        this.closeUploader();
        this.setState({loading: true});
        BE.uploadPhoto(file,'dataURI').then(()=>{
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

    deletePhoto: function(ph,id) {
        this.setState({loading: true});
        this.refs['img_'+id].setState({processing: true});
        this.refs['delbtn_'+id].getDOMNode().style.display = 'none';
        BE.deletePhoto(ph).then(()=>{
            this.updatePhotos();
        });
    },

    render: function() {
        if (!this.state.loaded) return <img className="admin-loading" src="images/admin-loading.gif" />;

        return (
            <div className="admin-all-photos" >
                <div className="actions">
                    <button className="btn admin-margin-1" onClick={this.openUploader} >добавить фото</button>
                    {(this.state.loading) && <img className="admin-loading" src="images/admin-loading.gif" />}
                </div>
                <div className="admin-photos-container">
                    {this.state.photos.map((ph,id)=>{
                        return <div className="admin-photo-item" key={'_img'+ph}>
                            <AutoImg ref={'img_'+id}
                                     showSize={true}
                                     showSizeClass="admin-photo-item-size"
                                     className="admin-photo-auto-img"
                                     loadingPlaceholderSrc = "images/admin-loading.gif"
                                     src={"images/photos/"+ph} />
                            <button ref={'delbtn_'+id} onClick={this.deletePhoto.bind(this,ph,id)} className="btn admin-photo-delete" >x</button>
                        </div>;
                    })}
                </div>
                {(this.state.uploadOpened) && <ImgUploader onSubmit={this.upload} onClose={this.closeUploader} />}
            </div>
        );
    }
});

module.exports = Component;