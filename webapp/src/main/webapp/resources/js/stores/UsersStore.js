var $ = require("jquery"),
    Fluxxor = require("fluxxor");

var constants = require("../constants");

module.exports = Fluxxor.createStore({
    initialize: function() {
        this.users = {};

        this.bindActions(
            constants.LOAD_USER, this.onLoadUser,
            constants.LOAD_PRINCIPAL_USER_SUCCESS, this.onLoadPrincipalUserSuccess,
            constants.LOAD_USER_SUCCESS, this.onLoadUserSuccess,
            constants.LOAD_USER_FAIL, this.onLoadUserFail,
            
            constants.PATCH_USER, this.onPatchUser,
            constants.PATCH_USER_SUCCESS, this.onPatchUserSuccess,
            constants.PATCH_USER_FAIL, this.onPatchUserFail
        );
    },

    onLoadUser: function(payload) {
        if (!payload.loadingPrincipal) {
            var userId = payload.userId;
            this.users[userId] = this.users[userId] || {};
            this.users[userId].loading = true;
            this.users[userId].loadError = null;
        }
        this.emit("change");
    },

    onLoadPrincipalUserSuccess: function(payload) {
        var user = payload.user;
        this.users[user.userId] = this.users[user.userId] || {};
        this.users[user.userId].loading = false;
        this.users[user.userId].loadError = null;
        this.users[user.userId].user = user;
        this.principalUserId = user.userId;
        this.emit("change");
    },

    onLoadUserSuccess: function(payload) {
        var user = payload.user;
        this.users[user.userId].loading = false;
        this.users[user.userId].loadError = null;
        this.users[user.userId].user = user;
        this.emit("change");
    },

    onLoadUserFail: function(payload) {
        var userId = payload.userId;
        this.users[userId].loadError = payload.error.message || $.i18n.prop('error.something-went-wrong');
        this.users[userId].user = null;
        this.users[userId].loading = false;
        this.emit("change");
    },
    
    onPatchUser: function(payload) {
        var userId = payload.userId;
        this.users[userId] = this.users[userId] || {};
        this.users[userId].saving = true;
        this.users[userId].saveError = null;
        this.emit("change");
    },

    onPatchUserSuccess: function(payload) {
        var user = payload.user;
        this.users[user.userId].saving = false;
        this.users[user.userId].saveError = null;
        this.users[user.userId].user = user;
        this.emit("change");
    },

    onPatchUserFail: function(payload) {
        var userId = payload.userId;
        this.users[userId].saveError = payload.error.message || $.i18n.prop('error.something-went-wrong');
        this.users[userId].user = null;
        this.users[userId].saving = false;
        this.emit("change");
    },

    getPrincipalUser: function() {
        if (!this.principalUserId) {
            return null;
        }

        return this.users[this.principalUserId].user;
    }



});
