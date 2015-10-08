var noty = require("noty");

var constants = require("../constants"),
    app = require('../app');

module.exports = {

    patchUser: function(userId, properties) {
        this.dispatch(constants.PATCH_USER);

        app.client.patch("/user/" + userId, {
            data: JSON.stringify(properties),

            success: function(data, status) {
                this.dispatch(constants.PATCH_USER_SUCCESS, {user: data});
            }.bind(this),

            error: function(error) {
                this.dispatch(constants.PATCH_USER_FAIL, {error: error.responseJSON});
            }.bind(this)
        });
    },

    uploadAvatar: function(userId, imageData) {
        this.dispatch(constants.UPLOAD_AVATAR);
        app.client.post("/user/" + userId + "/avatar", {

            data: imageData,
            contentType: "image/png",

            success: function (data, status) {
                this.dispatch(constants.UPLOAD_AVATAR_SUCCESS, {user: data});
                app.flux.actions.principal.loadUser();
            }.bind(this),

            error: function (error) {
                this.dispatch(constants.UPLOAD_AVATAR_FAIL, {error: error.responseJSON});
            }.bind(this),

            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function (event) {
                    if (event.lengthComputable) {
                        var progressPercentage = Math.round((event.loaded * 100) / event.total);
                        this.dispatch(constants.UPLOAD_AVATAR_PROGRESS, {progress: progressPercentage});
                    }
                }.bind(this), false);
                return xhr;
            }
        });
    }
};
