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

    render: function() {
        if (!this.state.photos.length) return <img className="admin-loading" src="images/admin-loading.gif" />;

        return (
            <div className="admin-categories" >
                <div className="actions">
                    <button className="btn" onClick={this.openUploader} >добавить фото</button>
                    {(this.state.loading) && <img className="admin-loading" src="images/admin-loading.gif" />}
                </div>
            </div>
        );
    }
});

module.exports = Component;