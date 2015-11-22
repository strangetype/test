var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var {Navigation} = require('react-router');

var http = require('superagent');

var BE = require('utils/BE');

var Cropper = require('react-cropper');

var dataURItoBlob = function (dataURI) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
};

var Component = React.createClass({
    mixins: [
        Navigation,
        React.addons.LinkedStateMixin
    ],


    getInitialState: function() {
        return {
            data_uri: 'images/van.jpg',
            cropped: '',
            photos: []
        }
    },

    data: null,

    componentWillMount: function() {
        BE.getData().then((data)=>{
            this.data = data;
            console.info(this.data);
            this.forceUpdate();
            BE.saveData(data);
        });


        http.post('BE/index.php')
            .set('Content-Type', 'application/json')
            //.type('json')
            .send({action: 'admin-authorisation',
                data: {username: 'maria', password: '123456'}
            })
            .end((a,b)=>{
                console.log(JSON.parse(b.text));

            });


        http.post('BE/index.php')
            .set('Content-Type', 'application/json')
            //.type('json')
            .send({action: 'admin-is-auth'})
            .end((a,b)=>{
                console.log(JSON.parse(b.text));
            });
    },


    componentDidMount: function() {
        this.updatePhotos();
    },

    updatePhotos: function() {
        BE.getPhotos().then((ph)=>{
            this.setState({photos: ph})
        });
    },

    upload: function(){
        var dataURL = this.refs.cropper.getCroppedCanvas().toDataURL();
        var blob = dataURItoBlob(dataURL);
        BE.uploadPhoto(blob).then(()=>{
            this.updatePhotos();
        });
    },

    _files: null,

    handleFile: function(e) {
        var self = this;
        var reader = new FileReader();
        var file = e.target.files[0];
        this._files = e.target.files;

        reader.onload = function(upload) {
            self.setState({
                data_uri: upload.target.result
            });
        };

        reader.readAsDataURL(file);

        console.log(this.refs.cropper.getCroppedCanvas().toDataURL());
    },

    deletePhoto: function(id) {
        BE.deletePhoto(id).then(()=>{
            this.updatePhotos();
        });
    },

    addToBkg: function(id) {
        BE.addPhotoToBkg(id).then(()=>{
            alert('resolved and added');
        });
    },

    removeFromBkg: function(id) {
        BE.removePhotoFromBkg(id).then(()=>{
            alert('resolved and remoced!');
        });
    },

    _crop: function() {
        //var u = this.refs.cropper.getCroppedCanvas().toDataURL();
        //this.refs.croppedImg.getDOMNode().src = u;
    },

    saveData: function() {
        BE.saveData(this.data);
    },

    changeCategory: function(originalName,category) {
        BE.changeCategory(originalName,category);
        this.forceUpdate();
    },

    render: function() {
        if (!this.data) return <div style={{color: '#fff'}} >loading...</div>;

        return (
            <div className="layout-admin" >
                <h1>Admin!</h1>
                <Cropper
                    ref='cropper'
                    src={this.state.data_uri}
                    style={{height: 400, width: '50%'}}

                    guides={false}
                    toggleDragModeOnDblclick = {true}
                    cropBoxResizable = {true}
                    crop={this._crop} />

                <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                    <input type="file" onChange={this.handleFile} />
                </form>

                <button onClick={this.upload} >upload</button>
                <hr />
                <div>
                    {this.state.photos.map((ph)=>{
                        return <div>
                            <img style={{width: "30%", height: "30%"}} src={"images/photos/"+ph}  />
                            <button onClick={this.addToBkg.bind(this,ph)}>add to bkg</button>
                            <button onClick={this.removeFromBkg.bind(this,ph)}>remove from bkg</button>
                            <button onClick={this.deletePhoto.bind(this,ph)}>delete</button>
                        </div>
                    })}
                </div>
                <div>
                    {this.data.categories.map((cat)=>{

                        var newCat = {};

                        var change = (field,e)=>{
                            newCat[field] = e.target.value;
                            console.log(newCat);
                        };

                        return <div>
                            <h2>name:</h2>
                            <input type="text" onChange={change.bind(this,'name')} placeholder={cat.name}></input>
                            <h2>title:</h2>
                            <input type="text" onChange={change.bind(this,'title')}  placeholder={cat.title}></input>
                            <h2>img:</h2>
                            <input type="text" onChange={change.bind(this,'imgSrc')}  placeholder={cat.imgSrc}></input>
                            <div>
                                <button onClick={this.changeCategory.bind(this,cat.name,newCat)}>save</button>
                            </div>
                        </div>;
                    })}
                </div>
            </div>
        );
    }
});

module.exports = Component;