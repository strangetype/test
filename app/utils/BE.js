var http = require('superagent');

var Q = require('q');

var BE = {
    url: 'BE/index.php',
    _dataURItoBlob: function (dataURI) {
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
    },
    getData: function() {
        var resolver = Q.defer();
        var photos = null;
        var struct = null;
        http.get(this.url).set('action','get-photos')
            .end((a,b)=>{
                photos = b.body.photos;
                _map();
            });

        http.get('BE/data.json').set('action','get-photos')
            .end((a,b)=>{
                struct = b.body;
                _map();
            });

        var _map = function() {
            if (struct && photos) {

            }
        }
    },
};

module.exports = BE;