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
        BE.uploadPhoto(blob).then(()=>{
            this.updatePhotos();
        });
    },

    _files: null,

    handleFile: function(e) {
        var self = this;
        var reader = new FileReader();
        var file = e.target.files[0];
        reader.onload = function(upload) {
            self.setState({
                img: upload.target.result
            });
        };
        reader.readAsDataURL(file);
    },

    submit: function() {
        if (typeof(this.props.onSubmit)==='function') this.props.onSubmit(this.refs.cropper.getCroppedCanvas().toDataURL());
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
                        toggleDragModeOnDblclick = {true}
                        cropBoxResizable = {true}
                        />
                }
                {(!this.state.img) && <label for="fileinput" className="placeholder">
                    <h3>+ Загрузить файл</h3>
                    <input type="file" id="fileinput" onChange={this.handleFile}/>
                </label>}

                {(this.state.img) && <label className="btn new-img" for="fileinputnew" >
                    выбрать другое фото
                    <input type="file" id="fileinputnew" onChange={this.handleFile}/>
                </label>}

                {(this.state.img) &&<button className="btn done" onClick={this.submit}>готово</button>}
                <button className="btn close" onClick={this.close} >закрыть</button>
            </div>
        );
    }
});

module.exports = Component;