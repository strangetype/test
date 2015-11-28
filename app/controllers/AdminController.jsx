var Reflux = require('reflux');

var AdminActions = Reflux.createActions({
    "openPhotosChooser": {asyncResult: true},
    "openPhotoUploader": {children: ["submit"]}
});



module.exports = AdminActions;