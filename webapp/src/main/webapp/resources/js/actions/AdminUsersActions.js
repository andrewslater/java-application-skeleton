var constants = require("../constants");
var app = require('../app');

module.exports = {

    loadUsers: function() {
        this.dispatch(constants.ADMIN_LOAD_USERS);
        app.client.get("admin/users", {
            success: function(data, status) {
                this.dispatch(constants.ADMIN_LOAD_USERS_SUCCESS, {page: data});
            }.bind(this),

            error: function(error) {
                this.dispatch(constants.ADMIN_LOAD_USERS_FAIL, {error: error.responseJSON});
            }.bind(this)
        });
    },

    loadUser: function(userId) {
        this.dispatch(constants.ADMIN_LOAD_USER);
        app.client.get("admin/user/" + userId, {
            success: function(data, status) {
                this.dispatch(constants.ADMIN_LOAD_USER_SUCCESS, {user: data});
            }.bind(this),

            error: function(error) {
                this.dispatch(constants.ADMIN_LOAD_USER_FAIL, {error: error.responseJSON});
            }.bind(this)
        });
    }
};

