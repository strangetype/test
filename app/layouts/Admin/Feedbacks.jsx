var React = require('react');
var cx = require('classnames');
var _ = require('lodash');
var {Navigation} = require('react-router');

var BE = require('utils/BE');
var ImgClientUploader = require('components/ImgClientUploader');

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
            loading: false,
            uploadOpened: false,
            filter: 2
        }
    },

    componentDidMount: function() {
        this.updateFeedbacks();
    },

    saveFeedbacks: function() {
        this.setState({
            loaded: false
        });
        BE.saveData(BE.data).then(this.updateFeedbacks);
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

    changeFilter: function(ev) {
        this.setState({
            filter: ev.target.value
        });
    },

    confirmFeedback: function(f,id) {
        f.confirmed = true;
        f.loading = true;
        this.forceUpdate();
        BE.saveFeedback(f,id).then(this.updateFeedbacks);
    },

    hideFeedback: function(f,id) {
        f.confirmed = false;
        f.loading = true;
        this.forceUpdate();
        BE.saveFeedback(f,id).then(this.updateFeedbacks);
    },

    changeFeedback: function(f,ev) {
        f._text = ev.target.value;
        this.forceUpdate();
    },

    saveFeedback: function(f,id) {
        f.text = f._text;
        f.loading = true;
        this.forceUpdate();
        BE.saveFeedback(f,id).then(function(fbs) {
            this.setState({
                feedbacks: fbs
            });
        });
    },

    cancelFeedbackChanges: function(f) {
        f._text = f.text;
        this.forceUpdate();
    },

    upload: function(file,fileURI,crop) {
        this.closeUploader();
        this.setState({loading: true});
        console.log('UPLOAD: ',file,fileURI, crop);
        BE.uploadClientPhoto(file,'file',crop).then((data)=>{
            var fb = this.state.feedbacks[this._cfbphid];
            fb.photo = data.newFileName;
            console.log('saving: ', fb, this._cfbphid);
            BE.saveFeedback(fb,this._cfbphid).then(this.updateFeedbacks);
        });
    },

    _cfbphid: null,

    openUploader: function(id) {
        this._cfbphid = id;
        this.setState({uploadOpened: true});
    },

    closeUploader: function() {
        this.setState({uploadOpened: false});
    },

    render: function() {
        if (!this.state.loaded) return <div className="admin-feedbacks" >
            <img className="admin-loading" src="images/admin-loading.gif" />
        </div>;

        return (
            <div className="admin-feedbacks" >
                <div className="actions">
                    {(this.state.loading) && <img className="admin-loading" src="images/admin-loading.gif" />}
                    <select className="btn admin-margin-1" onChange={this.changeFilter}>
                        <option value="0" >неподтвержденные</option>
                        <option value="1" >подтвержденные</option>
                        <option value="2" >все</option>
                    </select>
                </div>
                <div className="admin-feedbacks-container">
                    {(this.state.feedbacks && this.state.feedbacks.length) && this.state.feedbacks.map((f,id)=> {
                        if (!f._text) f._text = f.text;
                        if ((this.state.filter == 2) ||
                            (this.state.filter == 1 && f.confirmed) ||
                            (this.state.filter == 0 && !f.confirmed)
                        )
                        return <div className="feedback">
                            {(!f.photo) && <img onClick={this.openUploader.bind(this,id)} className="feedback-photo" src="images/img-placeholder.png" />}
                            {(f.photo) && <img onClick={this.openUploader.bind(this,id)} className="feedback-photo" src={'images/client_photo/'+f.photo} />}
                            <div className="feedback-message">
                                <h2 className="feedback-client-name">{f.name}</h2>
                                <textarea className="admin-input" style={{marginLeft: 0}} onChange={this.changeFeedback.bind(this,f)}
                                          value={f._text} >
                                </textarea>
                                {(f.loading) && <img className="admin-loading" src="images/admin-loading.gif" />}
                                {(f._text!==f.text && !f.loading) && <button onClick={this.saveFeedback.bind(this,f,id)} className="btn admin-margin-1" >сохранить</button>}
                                {(f._text!==f.text && !f.loading) && <button onClick={this.cancelFeedbackChanges.bind(this,f, id)} className="btn admin-margin-1" >отмена</button>}
                            </div>
                            <div>
                                {(!f.confirmed && !f.loading) && <button onClick={this.confirmFeedback.bind(this, f, id)} className="btn admin-margin-1" >подтвердить</button>}
                                {(f.confirmed && !f.loading) && <button onClick={this.hideFeedback.bind(this, f, id)} className="btn admin-margin-1" >спрятать</button>}
                            </div>
                        </div>
                    })}
                </div>
                {(this.state.uploadOpened) && <ImgClientUploader onSubmit={this.upload} onClose={this.closeUploader} />}
            </div>
        );
    }
});

module.exports = AdminPhotosGallery;