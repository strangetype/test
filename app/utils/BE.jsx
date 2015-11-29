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
    uploadPhoto: function(file,type) {
        var resolver = Q.defer();
        var fd = new FormData();
        if (type==='dataURI') {
            file = this._dataURItoBlob(file);
        }
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
    addPhotoToCategory: function(ph,cname) {
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
            if (_.indexOf(this.data.categories[id].photos, ph)===-1) {
                this.data.categories[id].photos.push(ph);
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
                this.data.categories[id].subCategories[sid].photos.push(ph);
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
    }

};

module.exports = BE;