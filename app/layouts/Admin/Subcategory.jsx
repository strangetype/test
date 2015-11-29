var React = require('react');
var cx = require('classnames');
var _ = require('lodash');
var BE = require('utils/BE');

var ImgUploader = require('components/ImgUploader');

var Component = React.createClass({
    getInitialState: function() {
        return {
            name: this.props.subcategory.name || '',
            title: this.props.subcategory.title || '',
            loading: false,
            deleting: false
        }
    },

    checkChanges: function() {
        return (this.state.name!==this.props.subcategory.name || this.state.title!==this.props.subcategory.title);
    },

    change: function(field,e) {
        var st = {};
        st[field] = e.target.value;
        this.setState(st);
    },

    revert: function() {
        this.setState(this.getInitialState());
    },

    save: function() {
        if (typeof(this.props.onSave)==='function') {
            this.setState({loading: true});
            this.props.onSave(this.props.subcategory.name, {name: this.state.name, title: this.state.title}, this);
        }
    },

    imgSelect: function() {
        if (typeof(this.props.onImgSelect)==='function') {
            this.props.onImgSelect(this.props.subcategory, this);
        }
    },

    deleteSubcategory: function() {
        if (typeof(this.props.onDelete)==='function') {
            this.setState({deleting: true});
            this.props.onDelete(this.props.subcategory.name);
        }
    },

    toggleSubcategories: function() {
        this.setState({
            scOpened: !this.state.scOpened
        });
    },

    openGallery: function() {
        if (typeof(this.props.onOpenGallery)==='function') {
            this.props.onOpenGallery(this.state.name);
        }
    },


    render: function() {

        if (this.state.deleting) return  <div className="admin-subcategory">
            <img className="admin-subcategory-image"  src={'images/photos/'+this.props.subcategory.imgSrc} />
            <div className="admin-subcategory-info">
                <div> <img src="images/admin-loading.gif" /> </div>
            </div>
        </div>;

        return (
            <div className="admin-subcategory">
                <img onClick={this.imgSelect} className="admin-subcategory-image"  src={'images/photos/'+this.props.subcategory.imgSrc} />
                <div className="admin-subcategory-info">
                    <div className="admin-subcategory-field-name" >Название: </div>
                    <input type="text" className="admin-subcategory-field-value" onChange={this.change.bind(this,'title')} value={this.state.title} />
                    <div className="admin-subcategory-field-name" >Имя: </div>
                    <input type="text" className="admin-subcategory-field-value" onChange={this.change.bind(this,'name')} value={this.state.name} />
                    <button className="btn admin-photos-toggle" onClick={this.openGallery}>фотографии</button>
                    {(!this.state.loading) && <div>
                        {(this.checkChanges()) && <button onClick={this.revert} className="btn admin-margin-05">отмена</button>}
                        {(this.checkChanges()) && <button onClick={this.save} className="btn admin-margin-05">сохранить</button>}
                    </div>}

                    {(this.state.loading) && <div> <img src="images/admin-loading.gif" /> </div>}
                    <button onClick={this.deleteSubcategory} className="btn admin-btn-delete">x</button>
                </div>
            </div>
        );
    }
});

module.exports = Component;