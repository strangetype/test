var http = require('superagent');
var Q = require('q');
var _ = require('lodash');
var md5 = require('js-md5');

var BE = {
    url: 'BE/index.php',
    data: null,
    isAuth: function () {
        var resolver = Q.defer();
        http.get('BE/index.php').set('action','admin-is-auth')
            .end((a,res)=>{
                resolver.resolve(res.body.isAuth);
            });
        return resolver.promise;
    },
    login: function (login, pass) {
        var resolver = Q.defer();
        http.post('BE/index.php').set('action','admin-authorisation').send({data: {
            username: login, password: md5(pass)
        }})
            .end((a,b)=>{
                resolver.resolve(b.body);
            });
        return resolver.promise;
    },
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
                this.data = b.body;
                resolver.resolve(b.body);
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
    uploadPhoto: function(file,type,crop) {
        var cr = {};
        if (crop) cr = {x: Math.round(crop.x), y: Math.round(crop.y),
            w: Math.round(crop.width), h: Math.round(crop.height)};
        var resolver = Q.defer();
        var fd = new FormData();
        if (type==='dataURI') {
            file = this._dataURItoBlob(file);
        }
        fd.append('file',file);
        fd.append('data',JSON.stringify(cr));
        http
            .post(this.url).set('action','admin-upload-photo')
            .send(fd)
            .end((a,b)=>{
                console.log('upload result: ',a,b);
                resolver.resolve(b.body);
            });
        return resolver.promise;
    },
    uploadClientPhoto: function(file,type,crop) {
        var cr = {};
        if (crop) cr = {x: Math.round(crop.x), y: Math.round(crop.y),
            w: Math.round(crop.width), h: Math.round(crop.height)};
        var resolver = Q.defer();
        var fd = new FormData();
        if (type==='dataURI') {
            file = this._dataURItoBlob(file);
        }
        fd.append('file',file);
        fd.append('data',JSON.stringify(cr));
        http
            .post(this.url).set('action','admin-upload-client-photo')
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
    removePhotoFromBkg: function(ph) {
        var resolver = Q.defer();
        _.remove(this.data.bkgPhotos,(p)=>{
            return p === ph;
        });
        this.saveData(this.data).then((a)=>{
            resolver.resolve(this.data);
        });
        return resolver.promise;
    },
    changeBkgPhoto: function(ph,nph) {
        var resolver = Q.defer();
        var id = _.indexOf(this.data.bkgPhotos,ph);
        if (id!==-1) {
            this.data.bkgPhotos[id] = nph;
            this.saveData(this.data).then((a)=>{
                resolver.resolve(this.data);
            });
        } else {
            resolver.reject('no_such_photo_to_change');
        }

        return resolver.promise;
    },
    addCategory: function(name,title,imgSrc) {
        var resolver = Q.defer();
        var repeated = false;
        var newCategory = {name: name, title: title, imgSrc: imgSrc, photos: []};
        _.forEach(this.data.categories,(cat)=>{
            if (cat.name===name) {
                console.warn('try to create repeating category');
                repeated = true;
            }
        });
        if (repeated) {
            resolver.reject('repeated_category');
        } else {
            this.data.categories.push(newCategory);
            this.saveData(this.data).then((a)=>{
                resolver.resolve(this.data,newCategory);
            });
        }
        return resolver.promise;
    },
    addSubcategory: function(ownerName,name,title,imgSrc) {
        console.log(ownerName,name,title,imgSrc);
        var resolver = Q.defer();
        var repeated = false;
        var newSubcategory = {name: name, title: title, imgSrc: imgSrc, photos: []};
        var id = null;
        _.forEach(this.data.categories,(c,i)=>{
            if (c.name===ownerName) {
                id = i;
                if (c.subCategories && c.subCategories.length) {
                    _.forEach(c.subCategories,(sc)=>{
                        if (sc.name===name) {
                            console.warn('try to create repeating subcategory');
                            repeated = true;
                        }
                    });
                }
            }
        });
        if (!id && id!==0) {
            resolver.reject('no_such_owner_category');
        } else {
            if (repeated) {
                resolver.reject('repeated_subscategory');
            } else {
                if (!this.data.categories[id].subCategories) {
                    this.data.categories[id].subCategories = [];
                }
                this.data.categories[id].subCategories.push(newSubcategory);
                this.saveData(this.data).then((a)=>{
                    resolver.resolve(this.data,newSubcategory);
                });
            }
        }
        return resolver.promise;
    },
    changeCategory: function(originalName,category) {
        var resolver = Q.defer();
        var cat = null;
        _.forEach(this.data.categories,(c,id)=>{
            if (c.name===originalName) {
                cat = this.data.categories[id];
            }
        });
        if (cat) {
            cat.name = category.name || cat.name;
            cat.title = category.title || cat.title;
            cat.imgSrc = category.imgSrc || cat.imgSrc;
            this.saveData(this.data).then((a)=>{
                resolver.resolve(this.data,cat);
            });
        } else {
            console.warn('no such category to change');
            resolver.reject(this.data,cat,'no_such_category');
        }
        return resolver.promise;
    },
    changeSubcategory: function(originalName,subcategory) {
        var resolver = Q.defer();
        var scat = null;
        _.forEach(this.data.categories,(c,i)=>{
            if (c.subCategories && c.subCategories.length) {
                _.forEach(c.subCategories, (sc,id)=>{
                    if (sc.name===originalName) {
                        scat = this.data.categories[i].subCategories[id];
                    }
                });
            }
        });
        if (scat) {
            scat.name = subcategory.name || scat.name;
            scat.title = subcategory.title || scat.title;
            scat.imgSrc = subcategory.imgSrc || scat.imgSrc;
            this.saveData(this.data).then((a)=>{
                resolver.resolve(this.data);
            });
        } else {
            console.warn('no such subcategory to change');
            resolver.reject(this.data,scat,'no_such_category');
        }
        return resolver.promise;
    },
    deleteCategory: function(categoryName) {
        var resolver = Q.defer();
        _.remove(this.data.categories,function(cat){
            return cat.name===categoryName;
        });
        this.saveData(this.data).then((a)=>{
            resolver.resolve(this.data);
        }).catch(()=>{
            resolver.reject('response_error');
        });
        return resolver.promise;
    },
    deleteSubcategory: function(scname) {
        var resolver = Q.defer();
        var id = null;
        _.forEach(this.data.categories,(c,i)=>{
            if (c.subCategories && c.subCategories.length) {
                _.forEach(c.subCategories, (sc,j)=>{
                    if (sc.name===scname) {
                        id = i;
                    }
                });
            }
        });
        if (id || id===0) {
            _.remove(this.data.categories[id].subCategories,function(sc){
                return sc.name===scname;
            });
            this.saveData(this.data).then((a)=>{
                resolver.resolve(this.data);
            }).catch(()=>{
                resolver.reject('response_error');
            });
        } else {
            resolver.reject('cant_find_cat_with_such_scat');
        }
        return resolver.promise;
    },
    getCategoryPhotos: function(cname) {
        var photos = [];
        _.forEach(this.data.categories,(c)=>{
            if (c.name===cname && c.photos) {
                photos = c.photos;
            }
            if (c.subCategories && c.subCategories.length) {
                _.forEach(c.subCategories, (sc)=>{
                    if (sc.name===cname && sc.photos) {
                        photos = sc.photos;
                    }
                });
            }
        });
        return photos;
    },
    addPhotoToCategory: function(ph,cname, order) {
        var resolver = Q.defer();
        var id = null; sid = null;
        if (!order) order = 0;
        _.forEach(this.data.categories,(c,i)=> {
            if (c.name === cname) id = i;
            if (c.subCategories && c.subCategories.length) {
                _.forEach(c.subCategories, (sc,j)=>{
                    if (sc.name===cname) {
                        sid = j;
                        id = i;
                    }
                });
            }
        });
        if (id!==null && sid === null) {
            if (!this.data.categories[id].photos) {
                this.data.categories[id].photos = [];
            }
            if (_.indexOf(this.data.categories[id].photos, ph)===-1) {
                this.data.categories[id].photos.splice(order,0,ph);
                this.saveData(this.data).then((data)=>{
                    resolver.resolve(this.data.categories[id].photos);
                });
            } else {
                resolver.reject('such_photo_exist');
            }
        }
        if (id!==null && sid!== null) {
            if (!this.data.categories[id].subCategories[sid].photos) {
                this.data.categories[id].subCategories[sid].photos = [];
            }
            if (_.indexOf(this.data.categories[id].subCategories[sid].photos, ph)===-1) {
                this.data.categories[id].subCategories[sid].photos.splice(order,0,ph);
                this.saveData(this.data).then((data)=>{
                    resolver.resolve(this.data.categories[id].subCategories[sid].photos);
                });
            } else {
                resolver.reject('such_photo_exist');
            }
        }
        if (id===null && sid === null) {
            resolver.reject('no_such_category');
        }
        return resolver.promise;
    },
    deletePhotoFromCategory: function(ph,cname) {
        var resolver = Q.defer();
        var id = null; sid = null;
        _.forEach(this.data.categories,(c,i)=> {
            if (c.name === cname) id = i;
            if (c.subCategories && c.subCategories.length) {
                _.forEach(c.subCategories, (sc,j)=>{
                    if (sc.name===cname) {
                        sid = j;
                        id = i;
                    }
                });
            }
        });
        if (id!==null && sid === null) {
            if (!this.data.categories[id].photos) {
                this.data.categories[id].photos = [];
            }
            if (_.indexOf(this.data.categories[id].photos, ph)!==-1) {
                _.remove(this.data.categories[id].photos,(p)=>{
                    return p===ph;
                });
                this.saveData(this.data).then((data)=>{
                    resolver.resolve(this.data.categories[id].photos);
                });
            } else {
                resolver.reject('such_photo_no_exist');
            }
        }
        if (id!==null && sid!== null) {
            if (!this.data.categories[id].subCategories[sid].photos) {
                this.data.categories[id].subCategories[sid].photos = [];
            }
            if (_.indexOf(this.data.categories[id].subCategories[sid].photos, ph)!==-1) {
                _.remove(this.data.categories[id].subCategories[sid].photos,(p)=>{
                    return p===ph;
                });
                this.saveData(this.data).then((data)=>{
                    resolver.resolve(this.data.categories[id].subCategories[sid].photos);
                });
            } else {
                resolver.reject('such_photo_no_exist');
            }
        }
        if (id===null && sid === null) {
            resolver.reject('no_such_category');
        }
        return resolver.promise;
    },
    changeCategoryPhoto: function(ph,nph,cname) {
        var resolver = Q.defer();
        var id = null; sid = null;
        _.forEach(this.data.categories,(c,i)=> {
            if (c.name === cname) id = i;
            if (c.subCategories && c.subCategories.length) {
                _.forEach(c.subCategories, (sc,j)=>{
                    if (sc.name===cname) {
                        sid = j;
                        id = i;
                    }
                });
            }
        });
        if (id!==null && sid === null) {
            var pid = _.indexOf(this.data.categories[id].photos,ph);
            if (pid!==-1) {
                this.data.categories[id].photos[pid] = nph;
                this.saveData(this.data).then((data)=>{
                    resolver.resolve(this.data.categories[id].photos);
                });
            } else {
                resolver.reject('no_such_photo');
            }
        }
        if (id!==null && sid!== null) {
            var pid = _.indexOf(this.data.categories[id].subCategories[sid].photos,ph);
            if (pid!==-1) {
                this.data.categories[id].subCategories[sid].photos[pid] = nph;
                this.saveData(this.data).then((data)=>{
                    resolver.resolve(this.data.categories[id].subCategories[sid].photos);
                });
            } else {
                resolver.reject('no_such_photo');
            }
        }
        if (id===null && sid === null) {
            resolver.reject('no_such_category');
        }
        return resolver.promise;
    },
    sendMessage: function(message) {
        var resolver = Q.defer();
        http.post('BE/index.php').set('action','send-email')
            .send({data: {name: message.name, email: message.email, message: message.message, phone: message.phone}})
            .end((a,b)=>{
                resolver.resolve(b);
            });
        return resolver.promise;
    },
    leaveFeedback: function(fb) {
        var resolver = Q.defer();
        if (fb && fb.name && fb.text) {
            fb.confirmed = false;
            fb.date = Date.now();
            if (!this.data.feedbacks) this.data.feedbacks = [];
            this.data.feedbacks.push({
                name: fb.name,
                text: fb.text,
                confirmed: fb.confirmed,
                date: fb.date
            });
            this.saveData(this.data).then((data)=>{
                resolver.resolve(data.feedbacks);
            }).catch(()=>{
                resolver.reject('saving_error');
            });
        } else {
            resolver.reject('incorrect_message');
        }
        return resolver.promise;
    },
    saveFeedback: function(fb,id) {
        var resolver = Q.defer();
        if (!this.data.feedbacks) this.data.feedbacks = [];
        if (this.data.feedbacks[id]) {
            var nfb = {
                text: fb.text,
                name: fb.name,
                confirmed: fb.confirmed,
                date: fb.date,
                photo: fb.photo
            };
            this.data.feedbacks[id] = nfb;
            this.saveData(this.data).then((data)=>{
                resolver.resolve(data.feedbacks);
            }).catch(()=>{
                resolver.reject('saving_error');
            });
        } else {
            resolver.reject('incorrect_id');
        }
        return resolver.promise;
    },
    deleteFeedback: function (f) {
        var resolver = Q.defer();
        if (!this.data.feedbacks) {
            this.data.feedbacks = [];
            resolver.reject('no_feedbacks');
        }
        var fid = _.findIndex(this.data.feedbacks, function(_f) {
            return (_f.name===f.name && _f.date===f.date);
        });
        if (fid!==-1) {
            _.remove(this.data.feedbacks, function(_f,id) {
                return id === fid;
            });
            this.saveData(this.data).then((data)=>{
                resolver.resolve(data.feedbacks);
            }).catch(()=>{
                resolver.reject('saving_error');
            });
        } else {
            resolver.reject('no_such_feedback');
        }
        return resolver.promise;
    },
    getServicesInfo: function() {
        var resolver = Q.defer();
        http.get('BE/services-info.html').set('content-type', 'html').end((a,b)=>{
            resolver.resolve(b.text);
        });
        return resolver.promise;
    },
    saveServicesInfo: function(servicesInfo) {
        var resolver = Q.defer();
        http.post('BE/index.php').set('action','admin-save-services-info').send({data: {
            servicesInfo: servicesInfo
        }}).end((a,b)=>{
                resolver.resolve(b.body);
            });
        return resolver.promise;
    }
};

module.exports = BE;