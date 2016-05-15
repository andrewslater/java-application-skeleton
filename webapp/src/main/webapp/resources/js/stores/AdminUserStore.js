import $ from 'jquery'
import Fluxxor from 'fluxxor'
import constants from '../constants'

module.exports = Fluxxor.createStore({
    initialize: function() {
        this.loading = false;
        this.error = null;
        this.user = null;

        this.bindActions(
            constants.ADMIN_LOAD_USER, this.onLoadUser,
            constants.ADMIN_LOAD_USER_SUCCESS, this.onLoadUserSuccess,
            constants.ADMIN_LOAD_USER_FAIL, this.onLoadUserFail
        );
    },

    onLoadUser: function() {
        this.loading = true;
        this.user = null;
        this.error = null;
        this.emit("change");
    },

    onLoadUserSuccess: function(payload) {
        this.loading = false;
        this.error = null;
        this.user = payload.user;
        this.emit("change");
    },

    onLoadUserFail: function(payload) {
        this.loading = false;
        this.error = payload.error;
        if (this.error.message === undefined) {
            this.error.message = $.i18n.prop('error.something-went-wrong');
        }
        this.emit("change");
    }

});
