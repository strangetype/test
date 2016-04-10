var React = require('react');

var ReactDom = require('react-dom');

var cx = require('classnames');
var _ = require('lodash');
var {Navigation} = require('react-router');

var BE = require('utils/BE');

var AdminController = require('controllers/AdminController');

var EditableDiv = require('react-wysiwyg-editor');


var AdminPhotosGallery = React.createClass({
    mixins: [
        Navigation,
        React.addons.LinkedStateMixin
    ],

    getInitialState: function() {
        return {
            loading: false,
            loaded: false,
            servicesInfo: ''
        }
    },

    bootstrapCssLink: null,

    componentDidMount: function() {
        var link = document.createElement('link');
        link.setAttribute('data-require', 'bootstrap-css@3.3.6');
        link.setAttribute('data-semver', '3.3.6');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.css');
        document.getElementsByTagName('head')[0].insertBefore(link, document.getElementsByTagName('link')[0]);
        this.updateServicesInfo();
        this.bootstrapCssLink = link;
    },

    componentWillUnmount: function() {
        this.bootstrapCssLink.remove();
    },

    updateServicesInfo: function() {
        this.setState({loading: true});
        BE.getServicesInfo().then((info)=>{
            this.setState({servicesInfo: info, loading: false, loaded: true});
        });
    },

    save: function() {
        this.setState({loading: true});
        BE.saveServicesInfo(this.state.servicesInfo).then(this.updateServicesInfo);
    },

    onChange: function(e) {
        this.setState({servicesInfo: e.target.value});
    },

    saveServicesInfo: function() {

    },

    render: function() {

        if (!this.state.loaded) return <div className="admin-services" >
            <img className="admin-loading" src="images/admin-loading.gif" />
        </div>;

        return (
            <div className="admin-services" >
                <div className="actions">
                    {(this.state.loading) && <img className="admin-loading" src="images/admin-loading.gif" />}
                    {(!this.state.loading) && <div>
                        <button className="btn admin-margin-1" onClick={this.save} >сохранить</button>
                    </div>}
                </div>
                <div className="admin-services-container">

                    <EditableDiv className="admin-services-editor rich-editor" content={this.state.servicesInfo} onChange={this.onChange} />
                </div>
            </div>
        );
    }
});

module.exports = AdminPhotosGallery;