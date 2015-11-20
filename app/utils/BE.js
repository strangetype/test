var http = require('superagent');

var Q = require('q');

var _ = require('lodash');

var BE = {
    url: 'BE/index.php',
    data: null,
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
        http.get('BE/data.json')
            .end((a,b)=>{
                setTimeout(()=>{
                    this.data = b.body;
                    resolver.resolve(b.body);
                },1000);
            });
        return resolver.promise;
    },
    getPhotos: function() {
        var resolver = Q.defer();
        http.get('BE/index.php').set('action','get-photos')
            .end((a,b)=>{
                resolver.resolve(b.body.photos);
            });
        return resolver.promise;
    },
    saveData: function(data) {
        var resolver = Q.defer();
        http.post('BE/index.php').set('action','admin-save-data').send({data: {data: data}})
            .end((a,b)=>{
                resolver.resolve(b.body);
            });
        return resolver.promise;
    },
    deletePhoto: function(id) {
        var resolver = Q.defer();
        _.remove(this.data.bkgPhotos, (p)=>{
            return p===id;
        });
        _.forEach(this.data.categories,(c)=>{
            if (c.photos && c.photos.length) {
                _.remove(c.photos, (p)=>{
                    return p===id;
                });
            }
            if (c.subCategories && c.subCategories.length) {
                _.forEach(c.subCategories,(sc)=> {
                    if (sc.photos.length) {
                        _.remove(sc.photos, (p)=> {
                            return p === id;
                        });
                    }
                });
            }
        });
        this.saveData(this.data).then(()=>{
            http.post('BE/index.php').set('action','admin-delete-photo').send({data: {id: id}})
                .end((a,b)=>{
                    resolver.resolve(b.body);
                });
        });
        return resolver.promise;
    },
    uploadPhoto: function(file) {
        var resolver = Q.defer();
        var fd = new FormData();
        fd.append('file',file);
        http
            .post(this.url).set('action','admin-upload-photo')
            .send(fd)
            .end((a,b)=>{
                console.log('upload result: ',a,b);
                resolver.resolve(b.body);
            });
        return resolver.promise;
    },
    addPhotoToBkg: function(id) {
        var resolver = Q.defer();
        if (_.indexOf(this.data.bkgPhotos,id)===-1) {
            this.getPhotos().then((photos)=>{
                var i = _.indexOf(photos,id);
                if (i!==-1) {
                    this.data.bkgPhotos.push(id);
                    this.saveData(this.data).then((a)=>{
                        resolver.resolve(this.data);
                    });
                } else {
                    resolver.reject('no such photo: '+id);
                }
            });
        } else {
            resolver.reject('duplicated photo: '+id);
        }
        return resolver.promise;
    },
    removePhotoFromBkg: function(id) {
        var resolver = Q.defer();
        _.remove(this.data.bkgPhotos,(p)=>{
            return p === id;
        });
        this.saveData(this.data).then((a)=>{
            resolver.resolve(this.data);
        });
        return resolver.promise;
    }
};

module.exports = BE;