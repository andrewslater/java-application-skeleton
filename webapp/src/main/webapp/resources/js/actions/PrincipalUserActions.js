var noty = require("noty");
var constants = require("../constants");
var app = require('../app');

module.exports = {

    loadUser: function() {
        this.dispatch(constants.LOAD_PRINCIPAL_USER);
        app.client.get("/user/principal", {
            success: function(data, status) {
                this.dispatch(constants.LOAD_PRINCIPAL_USER_SUCCESS, {user: data});
            }.bind(this),

            error: function(error) {
                this.dispatch(constants.LOAD_PRINCIPAL_USER_FAIL, {error: error.responseJSON});
            }.bind(this)
        });
    },

    uploadAvatar: function(imageData) {
        console.log("Uploading avatar: " + imageData);
        this.dispatch(constants.UPLOAD_PROFILE_AVATAR);
        app.client.post("/user/principal/avatar", {

            data: imageData,
            contentType: "image/png",

            success: function (data, status) {
                this.dispatch(constants.UPLOAD_PROFILE_AVATAR_SUCCESS, {user: data});
                noty({text: $.i18n.prop('avatar-updated')});
                app.flux.actions.principal.loadUser();
            }.bind(this),

            error: function (error) {
                this.dispatch(constants.UPLOAD_PROFILE_AVATAR_FAIL, {error: error.responseJSON});
            }.bind(this),

            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function (event) {
                    if (event.lengthComputable) {
                        var progressPercentage = Math.round((event.loaded * 100) / event.total);
                        this.dispatch(constants.UPLOAD_PROFILE_AVATAR_PROGRESS, {progress: progressPercentage});
                    }
                }.bind(this), false);
                return xhr;
            }
        });
    }

};

