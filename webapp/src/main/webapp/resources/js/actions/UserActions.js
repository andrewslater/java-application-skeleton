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
    }
};
