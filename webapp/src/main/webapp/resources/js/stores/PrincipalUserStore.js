var $ = require("jquery");
var Fluxxor = require("fluxxor");
var constants = require("../constants");

module.exports = Fluxxor.createStore({
    initialize: function() {
        this.loading = false;
        this.error = null;
        this.principal = null;

        this.bindActions(
            constants.LOAD_PRINCIPAL_USER, this.onLoadUser,
            constants.LOAD_PRINCIPAL_USER_SUCCESS, this.onLoadUserSuccess,
            constants.LOAD_PRINCIPAL_USER_FAIL, this.onLoadUserFail
        );
    },

    onLoadUser: function() {
        this.loading = true;
        this.principal = null;
        this.error = null;
        this.emit("change");
    },

    onLoadUserSuccess: function(payload) {
        this.loading = false;
        this.error = null;
        this.principal = payload.user;
        this.emit("change");
    },

    onLoadUserFail: function(payload) {
        this.loading = false;
        this.principal = null;
        this.error = payload.error;
        if (this.error.message === undefined) {
            this.error.message = $.i18n.prop('error.something-went-wrong');
        }
        this.emit("change");
    }

});
