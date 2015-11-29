var React = require('react');
var cx = require('classnames');
var _ = require('lodash');
var BE = require('utils/BE');

var ImgUploader = require('components/ImgUploader');
var Subcategory = require('layouts/Admin/Subcategory');

var shortid = require('shortid');

var Component = React.createClass({
    getInitialState: function() {
        return {
            name: this.props.category.name || '',
            title: this.props.category.title || '',
            loading: false,
            deleting: false,
            scOpened: false,
            newSubcategoryOpened: false,
            error: null
        }
    },

    checkChanges: function() {
        return (this.state.name!==this.props.category.name || this.state.title!==this.props.category.title);
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
            this.props.onSave(this.props.category.name, {name: this.state.name, title: this.state.title}, this);
        }
    },

    imgSelect: function() {
        if (typeof(this.props.onImgSelect)==='function') {
            this.props.onImgSelect(this.props.category, this);
        }
    },

    subImgSelect: function(sc,com) {
        if (typeof(this.props.onSubImgSelect)==='function') {
            this.props.onSubImgSelect(sc, com);
        }
    },


    deleteCategory: function() {
        if (typeof(this.props.onDelete)==='function') {
            this.setState({deleting: true});
            this.props.onDelete(this.props.category.name);
        }
    },

    toggleSubcategories: function() {
        this.setState({
            scOpened: !this.state.scOpened
        });
    },

    saveSubcategory: function(name,sc,com) {
        if (typeof(this.props.onSubSave)==='function') {
            this.props.onSubSave(name, sc, com);
        }
    },

    newScat: {name: 'new category', title: 'новая категория', imgSrc: '../img-placeholder.png'},

    changeNewScatField: function(field,e) {
        this.setState({ error: null });
        this.newScat[field] = e.target.value;
    },

    openNewSubcategory: function() {
        this.setState({newSubcategoryOpened: true});
    },

    closeNewSubcategory: function() {
        this.setState({newSubcategoryOpened: false});
    },

    addNewSubcategory: function() {
        if (typeof(this.props.onSubAdd)==='function') {
            this.props.onSubAdd(this.props.category.name, this.newScat,this);
        }
    },

    deleteSubcategory: function(scname) {
        if (typeof(this.props.onSubDelete)==='function') {
            this.props.onSubDelete(scname,this);
        }
    },

    openGallery: function(name) {
        if (typeof(this.props.onOpenGallery)==='function') {
            this.props.onOpenGallery(name);
        }
    },

    render: function() {

        if (this.state.deleting) return  <div className="admin-category">
            <img className="admin-category-image"  src={'images/photos/'+this.props.category.imgSrc} />
            <div className="admin-category-info">
                <div> <img src="images/admin-loading.gif" /> </div>
            </div>
        </div>;

        return (
            <div className="admin-category">
                <img onClick={this.imgSelect} className="admin-category-image"  src={'images/photos/'+this.props.category.imgSrc} />
                <div className="admin-category-info">
                    <div className="admin-category-field-name" >Название: </div>
                    <input type="text" className="admin-category-field-value" onChange={this.change.bind(this,'title')} value={this.state.title} />
                    <div className="admin-category-field-name" >Имя: </div>
                    <input type="text" className="admin-category-field-value" onChange={this.change.bind(this,'name')} value={this.state.name} />
                    {(!this.state.loading) && <div>
                        {(this.checkChanges()) && <button onClick={this.revert} className="btn admin-margin-05">отмена</button>}
                        {(this.checkChanges()) && <button onClick={this.save} className="btn admin-margin-05">сохранить</button>}
                    </div>}
                    <button className="btn admin-subcategories-toggle" onClick={this.toggleSubcategories}>подкатегории</button>
                    <button className="btn admin-photos-toggle" onClick={this.openGallery.bind(this,this.state.name)}>фотографии</button>
                    {(this.state.loading) && <div> <img src="images/admin-loading.gif" /> </div>}
                    <button onClick={this.deleteCategory} className="btn admin-btn-delete">x</button>
                </div>
                {(this.state.scOpened) && <div className="admin-subcategories">
                    {(!this.state.newSubcategoryOpened) && <button className="btn admin-margin-1" onClick={this.openNewSubcategory} >создать категорию</button>}
                    {(this.state.newSubcategoryOpened) && <div>
                        <label>Имя: </label><input type="text" value={this.newScat.name} onChange={this.changeNewScatField.bind(this,'name')} />
                        <label>Название: </label><input type="text" value={this.newScat.title} onChange={this.changeNewScatField.bind(this,'title')} />
                        <button className="btn admin-margin-1" onClick={this.closeNewSubcategory} >отмена</button>
                        <button className="btn admin-margin-1" onClick={this.addNewSubcategory} >создать категорию</button>
                    </div>}
                    {(this.state.error) && <div className="admin-error-message">{this.state.error}</div>}
                    {(this.props.category.subCategories && !!this.props.category.subCategories.length) && this.props.category.subCategories.map((sc,id)=>{
                        return <Subcategory onSave={this.saveSubcategory}
                                            onImgSelect={this.subImgSelect}
                                            onDelete={this.deleteSubcategory}
                                            onOpenGallery = {this.openGallery}
                                            subcategory={sc}
                                            key={sc.name}
                            />
                    })}
                </div>}
            </div>
        );
    }
});

module.exports = Component;