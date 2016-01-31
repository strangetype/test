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
            feedbacks: [],
            loading: false
        }
    },

    componentDidMount: function() {
        this.updateFeedbacks();
    },

    updateFeedbacks: function() {
        if (BE.data) {
            this.setState({feedbacks: BE.data.feedbacks, loaded: true});
        } else {
            BE.getData().then((data)=>{
                this.setState({feedbacks: data.feedbacks, loaded: true});
            });
        }
    },


    render: function() {
        if (!this.state.loaded) return <div className="admin-feedbacks" >
            <img className="admin-loading" src="images/admin-loading.gif" />
        </div>;

        return (
            <div className="admin-feedbacks" >
                <div className="actions">
                    {(this.state.loading) && <img className="admin-loading" src="images/admin-loading.gif" />}


                </div>
                <div className="admin-feedbacks-container">
                    {(this.state.feedbacks && this.state.feedbacks.length) && this.state.feedbacks.map((f)=> {
                        return <div className="feedback">
                            {(!f.photo) && <img className="feedback-photo" src="images/img-placeholder.png" />}
                            {(f.photo) && <img className="feedback-photo" src={'images/photos_mini/'+f.photo} />}
                            <div className="feedback-message">
                                <h2 className="feedback-client-name">{f.name}</h2>
                                {f.text}
                            </div>
                        </div>
                    })}
                </div>
            </div>
        );
    }
});

module.exports = AdminPhotosGallery;