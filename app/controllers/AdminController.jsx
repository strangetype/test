var Reflux = require('reflux');

var AdminActions = Reflux.createActions({
    "openPhotosChooser": {asyncResult: true},
    "openPhotosGallery": {children: ['close']},
    "openPhotoUploader": {children: ["submit"]}
});



module.exports = AdminActions;