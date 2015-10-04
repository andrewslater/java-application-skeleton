var $ = require("jquery");
var Fluxxor = require("fluxxor");
var constants = require("../constants");

module.exports = Fluxxor.createStore({
    initialize: function () {
        this.uploading = false;
        this.uploadProgress = null;
        this.error = null;

        this.bindActions(
            constants.UPLOAD_PROFILE_AVATAR, this.onUpload,
            constants.UPLOAD_PROFILE_AVATAR_PROGRESS, this.onUploadProgress,
            constants.UPLOAD_PROFILE_AVATAR_SUCCESS, this.onUploadSuccess,
            constants.UPLOAD_PROFILE_AVATAR_FAIL, this.onUploadFail
        );
    },

    onUpload: function() {
        this.uploading = true;
        this.error = null;
        this.emit("change");
    },

    onUploadProgress: function(payload) {
        this.uploadProgress = payload.progress;
        this.emit("change");
    },

    onUploadSuccess: function(payload) {
        this.error = null;
        this.uploadProgress = null;
        this.uploading = false;
    },

    onUploadFail: function(payload) {
        this.uploading = false;
        this.uploadProgress = null;
        this.error = payload.error;
        if (this.error.message === undefined) {
            this.error.message = $.i18n.prop('error.something-went-wrong');
        }
        this.emit("change");
    }

});
