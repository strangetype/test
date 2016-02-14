var React = require('react');
var cx = require('classnames');
var _ = require('lodash');
var Cropper = require('react-cropper');

var Component = React.createClass({
    mixins: [
        React.addons.LinkedStateMixin
    ],

    getInitialState: function() {
        return {
            img: this.props.img || ''
        }
    },

    upload: function(){
        var dataURL = this.refs.cropper.getCroppedCanvas().toDataURL();
        var blob = dataURItoBlob(dataURL);
        BE.uploadClientPhoto(blob).then(()=>{
            this.updatePhotos();
        });
    },

    _file: null,

    handleFile: function(e) {
        var self = this;
        var reader = new FileReader();
        var file = e.target.files[0];
        this._file = file;
        reader.onload = function(upload) {
            self.setState({
                img: upload.target.result
            });
        };
        reader.readAsDataURL(file);
    },

    submit: function() {
        if (typeof(this.props.onSubmit)==='function')
            this.props.onSubmit(
                this._file,
                this.refs.cropper.getCroppedCanvas().toDataURL(),
                this.refs.cropper.getData()
            );
    },

    close: function() {
        if (typeof(this.props.onClose)==='function') this.props.onClose();
    },

    render: function() {

        return (
            <div className="img-uploader" >
                {(this.state.img) &&
                    <Cropper
                        className="cropper"
                        ref='cropper'
                        src={this.state.img}
                        style={{height: '100%', width: '100%'}}
                        guides={false}
                        aspectRatio={1/1}
                        toggleDragModeOnDblclick = {true}
                        cropBoxResizable = {true}
                        />
                }
                {(!this.state.img) && <label for="fileinput" className="placeholder">
                    <h3>+ Загрузить файл</h3>
                    <input type="file" id="fileinput" onChange={this.handleFile}/>
                </label>}

                {(this.state.img) && <label className="btn admin-margin-1 new-img" for="fileinputnew" >
                    выбрать другое фото
                    <input type="file" id="fileinputnew" onChange={this.handleFile}/>
                </label>}

                {(this.state.img) &&<button className="btn admin-margin-1 done" onClick={this.submit}>готово</button>}
                <button className="btn close admin-margin-1" onClick={this.close} >закрыть</button>
            </div>
        );
    }
});

module.exports = Component;