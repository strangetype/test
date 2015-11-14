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

    componentWillMount: function() {

        BE.getData();

        console.log('admin');

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
        http.get('BE/index.php').set('action','get-photos').end((a,b)=>{
            var res = JSON.parse(b.text);
            this.setState({photos: res.photos})
        });
    },

    updatePhotos: function() {
        http.get('BE/index.php').set('action','get-photos').end((a,b)=>{
            var res = JSON.parse(b.text);
            this.setState({photos: res.photos})
        });
    },

    upload: function(){
        //console.log(this.refs.cropper.getCroppedCanvas().toDataURL());
        //getCropBoxData


        var dataURL = this.refs.cropper.getCroppedCanvas().toDataURL();
        var blob = dataURItoBlob(dataURL);
        var fd = new FormData(document.forms[0]);
        fd.append("file", blob);

        //var formData = new FormData();
        //formData.append('file',this._files[0]);



        http.post('BE/index.php')
        .set('action', 'admin-upload-photo')
        .send(fd)
        .end((a,b,c)=>{
                console.log(a,b,c);
                var res = JSON.parse(b.text);
                console.log('res: ', res);
                this.setState({
                    uploaded: res.newFileName
                });
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
        http
            .post('BE/index.php')
            .set('action','admin-delete-photo')
            .send({data:{id: id}})
            .end((a,b,c)=>{
                console.log(a,b,c);
                var res = JSON.parse(b.text);
                console.log('res: ', res);
                this.updatePhotos();
            });
    },

    _crop: function() {
        //var u = this.refs.cropper.getCroppedCanvas().toDataURL();
        //this.refs.croppedImg.getDOMNode().src = u;
    },

    render: function() {


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
                        return <img src={"images/photos/"+ph} onClick={this.deletePhoto.bind(this,ph)} />
                    })}
                </div>

            </div>
        );
    }
});

module.exports = Component;