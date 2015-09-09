var $ = require("jquery");
var Fluxxor = require("fluxxor");
var constants = require("../constants");

module.exports = Fluxxor.createStore({
    initialize: function() {
        this.loading = false;
        this.error = null;
        this.page = null;

        this.bindActions(
            constants.ADMIN_LOAD_USERS, this.onLoadUsers,
            constants.ADMIN_LOAD_USERS_SUCCESS, this.onLoadUsersSuccess,
            constants.ADMIN_LOAD_USERS_FAIL, this.onLoadUsersFail
        );
    },

    onLoadUsers: function() {
        this.loading = true;
        this.error = null;
        this.emit("change");
    },

    onLoadUsersSuccess: function(payload) {
        this.loading = false;
        this.error = null;
        this.page = payload.page;
        this.emit("change");
    },

    onLoadUsersFail: function(payload) {
        this.loading = false;
        this.error = payload.error;
        if (this.error.message === undefined) {
            this.error.message = $.i18n.prop('error.something-went-wrong');
        }
        this.emit("change");
    }

});
