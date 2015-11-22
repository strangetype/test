var React = require('react');
var cx = require('classnames');
var _ = require('lodash');
var {Navigation} = require('react-router');
var BE = require('utils/BE');

var ImgUploader = require('components/ImgUploader');

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

    deletePhoto: function(ph,id) {
        this.setState({loading: true});
        this.refs['img_'+id].getDOMNode().src = 'images/admin-loading.gif';
        this.refs['delbtn_'+id].getDOMNode().style.display = 'none';
        BE.deletePhoto(ph).then(()=>{
            this.updatePhotos();
        });
    },

    render: function() {
        if (!this.state.photos.length) return <img className="admin-loading" src="images/admin-loading.gif" />;

        return (
            <div className="admin-all-photos" >
                <div className="actions">
                    <button className="btn" onClick={this.openUploader} >добавить фото</button>
                    {(this.state.loading) && <img className="admin-loading" src="images/admin-loading.gif" />}
                </div>
                <div className="admin-photos-container">
                    {this.state.photos.map((ph,id)=>{
                        return <div className="admin-photo-item">
                            <img ref={'img_'+id} src={'images/photos/'+ph} />
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