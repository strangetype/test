var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var {Navigation} = require('react-router');

var http = require('superagent');

var Cropper = require('react-cropper');

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

var Component = React.createClass({
    mixins: [
        Navigation,
        React.addons.LinkedStateMixin
    ],


    getInitialState: function() {
        return {
            data_uri: 'images/van.jpg',
            uploaded: ''
        }
    },

    componentWillMount: function() {

        console.log('admin');
        /*
         http.post('BE/index.php')
         .set('Content-Type', 'application/json')
         //.type('json')
         .send({action: 'admin-authorisation',
         data: {username: 'maria', password: '123456'}
         })
         .end((a,b)=>{
         console.log(JSON.parse(b.text));

         });
         */



        http.post('BE/index.php')
            .set('Content-Type', 'application/json')
            //.type('json')
            .send({action: 'admin-is-auth'})
            .end((a,b)=>{
                console.log(JSON.parse(b.text));

            });
    },

    componentDidMount: function() {

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

    render: function() {


        return (
            <div className="layout-admin" >
                <h1>Admin!</h1>
                <Cropper
                    ref='cropper'
                    src={this.state.data_uri}
                    style={{height: 400, width: '100%'}}

                    guides={false}
                    toggleDragModeOnDblclick = {true}
                    cropBoxResizable = {true}
                    crop={this._crop} />

                <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                    <input type="file" onChange={this.handleFile} />
                </form>

                <button onClick={this.upload} >upload</button><br/>
                <img src={'images/photos/'+this.state.uploaded} />
            </div>
        );
    }
});

module.exports = Component;