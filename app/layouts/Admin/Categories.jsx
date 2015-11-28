var React = require('react');
var cx = require('classnames');
var _ = require('lodash');
var BE = require('utils/BE');

var PhotosChooser = require('layouts/Admin/PhotosChooser');
var Category = require('layouts/Admin/Category');

var AdminController = require('controllers/AdminController');

var shortid = require('shortid');

var Component = React.createClass({
    mixins: [
        React.addons.LinkedStateMixin
    ],

    getInitialState: function() {
        return {
            categories: [],
            loading: false,
            newCategoryOpened: false,
            error: null
        }
    },

    componentDidMount: function() {
        BE.getData().then((data)=>{
            this.setState({
                categories: data.categories
            });
        });
    },

    upload: function(file) {
        this.closeUploader();
        this.setState({loading: true});
        BE.uploadPhoto(file,'dataURI').then(()=>{
            this.updatePhotos();
        });
    },

    openNewCategory: function() {
        this.setState({newCategoryOpened: true});
    },

    closeNewCategory: function() {
        this.setState({newCategoryOpened: false, error: false});
    },

    saveCategory: function(orn,cat,com) {
        BE.changeCategory(orn,cat).then((res)=>{
            this.setState({
                categories: res.categories
            });
            com.setState({loading: false});
        });
    },

    saveSubcategory: function(orn,scat,com) {
        this.setState({
            loading: true
        },()=>{
            BE.changeSubcategory(orn,scat).then((res)=>{
                this.setState({
                    loading: false
                });
                com.setState({loading: false});
            });
        });
    },

    openPhotosChooser: function(cat,com) {
        AdminController.openPhotosChooser.triggerPromise().then((ph,id)=>{
            com.setState({loading: true});
            BE.changeCategory(cat.name,{imgSrc: ph}).then((res)=>{
                this.setState({
                    categories: res.categories
                });
                com.setState({loading: false});
            });
        }).catch((res)=>{

        });
    },

    openPhotosChooserForSubC: function(scat,com) {
        AdminController.openPhotosChooser.triggerPromise().then((ph,id)=>{
            com.setState({loading: true});
            BE.changeSubcategory(scat.name,{imgSrc: ph}).then((res)=>{
                this.setState({
                    categories: res.categories
                });
                com.setState({loading: false});
            });
        }).catch((res)=>{

        });
    },

    newCat: {name: 'new category', title: 'новая категория', imgSrc: '../img-placeholder.png'},

    changeNewCatField: function(field,e) {
        this.setState({ error: null });
        this.newCat[field] = e.target.value;
    },

    addNewCategory: function() {
        this.setState({
            loading: true,
            newCategoryOpened: false
        },()=>{
            BE.addCategory(this.newCat.name,this.newCat.title,this.newCat.imgSrc).then((res)=>{
                this.setState({
                    categories: res.categories,
                    loading: false,
                    error: null
                });
            }).catch((a)=>{
                if (a==='repeated_category') this.setState({
                    error: 'Категория с таким именем уже существует',
                    loading: false,
                    newCategoryOpened: true
                });
            });
        });
    },

    addNewSubCategory: function(ownerName,scat,com) {
        com.setState({
            loading: true,
            newSubcategoryOpened: false
        },()=>{
            BE.addSubcategory(ownerName,scat.name,scat.title,scat.imgSrc).then((res)=>{
                com.setState({
                    loading: false,
                    error: null
                });
                this.setState({
                    categories: res.categories
                })
            }).catch((a)=>{
                if (a==='repeated_subscategory') com.setState({
                    error: 'Подкатегория с таким именем уже существует',
                    loading: false,
                    newSubcategoryOpened: true
                });
            });
        });
    },

    deleteCategory: function(catName) {
        BE.deleteCategory(catName).then((res)=>{
            this.setState({
                categories: res.categories,
                loading: false,
                error: null
            });
        }).catch((a)=>{
            if (a==='response_error') {
                this.setState({
                    error: 'Ошибка сервера, перезагрузите страницу',
                    loading: false
                });
                alert('Ошибка сервера, перезагрузите страницу');
            }
        });
    },

    deleteSubcategory: function(scname,com) {
        BE.deleteSubcategory(scname).then((res)=>{
            this.setState({
                categories: res.categories
            });
            com.setState({
                loading: false,
                error: null
            });
        }).catch((a)=>{
            if (a==='response_error') {
                com.setState({
                    error: 'Ошибка сервера, перезагрузите страницу',
                    loading: false
                });
                alert('Ошибка сервера, перезагрузите страницу');
            }
        });
    },

    render: function() {
        if (!this.state.categories.length) return <img className="admin-loading" src="images/admin-loading.gif" />;

        return (
            <div className="admin-categories" >
                <div className="actions">
                    {(!this.state.newCategoryOpened) && <button className="btn admin-margin-1" onClick={this.openNewCategory} >создать категорию</button>}
                    {(this.state.newCategoryOpened) && <div>
                        <label>Имя: </label><input type="text" value={this.newCat.name} onChange={this.changeNewCatField.bind(this,'name')} />
                        <label>Название: </label><input type="text" value={this.newCat.title} onChange={this.changeNewCatField.bind(this,'title')} />
                        <button className="btn admin-margin-1" onClick={this.closeNewCategory} >отмена</button>
                        <button className="btn admin-margin-1" onClick={this.addNewCategory} >создать категорию</button>
                    </div>}
                    {(this.state.loading) && <img  className="admin-loading" src="images/admin-loading.gif" />}
                    {(this.state.error) && <div className="admin-error-message">{this.state.error}</div>}
                </div>
                <div >
                    {this.state.categories.map((c,id)=>{
                        return <Category onImgSelect={this.openPhotosChooser}
                                         onSubImgSelect={this.openPhotosChooserForSubC}
                                         onSubAdd={this.addNewSubCategory}
                                         onSave={this.saveCategory}
                                         onSubSave={this.saveSubcategory}
                                         onDelete={this.deleteCategory}
                                         onSubDelete={this.deleteSubcategory}
                                         category={c}
                                         key={c.name}
                            />
                    })}
                    {(this.state.loading) && <img  className="admin-loading" src="images/admin-loading.gif" />}
                </div>
            </div>
        );
    }
});

module.exports = Component;