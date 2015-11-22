var React = require('react');
var cx = require('classnames');
var _ = require('lodash');
var {Navigation} = require('react-router');
var BE = require('utils/BE');

var ImgUploader = require('components/ImgUploader');
var AllPhotos = require('layouts/Admin/AllPhotos');
var Categories = require('layouts/Admin/Categories');

var menu = [
    {tab: 'allPhotos',title: 'все фото'},
    {tab: 'categories',title: 'категории'},
    {tab: 'main',title: 'главная'},
    {tab: 'feedback',title: 'отзывы'},
    {tab: 'service',title: 'услуги'},
    {tab: 'contacts',title: 'контакты'}
];

var Component = React.createClass({
    mixins: [
        Navigation,
        React.addons.LinkedStateMixin
    ],

    getInitialState: function() {
        return {
            tab: 'allPhotos'
        }
    },

    data: null,

    componentDidMount: function() {
        BE.getData().then((data)=>{
            console.info(data);
            this.data = data;
            this.forceUpdate();
        });
    },

    upload: function(file) {

    },

    setTab: function(tab) {
        this.setState({tab: tab});
    },

    render: function() {
        if (!this.data) return <img className="admin-loading" src="images/admin-loading.gif" />;

        return (
            <div className="layout-admin" >
                <div className="top-menu">
                    {menu.map((item)=>{
                        return <button className={(item.tab===this.state.tab) && 'active'} onClick={this.setTab.bind(this,item.tab)}>{item.title}</button>;
                    })}
                </div>
                <div className="admin-body">
                    {(this.state.tab==='allPhotos') && <AllPhotos />}
                    {(this.state.tab==='categories') && <Categories />}
                </div>
            </div>
        );
    }
});

module.exports = Component;