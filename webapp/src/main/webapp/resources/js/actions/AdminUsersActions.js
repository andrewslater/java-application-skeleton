var util = require('util');
var _ = require("underscore");
var constants = require("../constants");
var app = require('../app');

module.exports = {
    loadUsersRequest: null,
    loadUsersRequestData: null,

    loadUsers: function(pageNum, sortQuery, filter ) {
        // The API uses zero-indexed page numbers so we'll adjust from the one-indexed pagination of our urls
        pageNum = pageNum ? pageNum - 1 : 0;
        this.dispatch(constants.ADMIN_LOAD_USERS);

        var requestData = {
            page: pageNum,
            sort: sortQuery,
            filter: filter
        };

        if (_.isEqual(this.loadUsersRequestData, requestData)) {
            return;
        }

        this.loadUsersRequestData = requestData;

        this.loadUsersRequest = app.client.get("admin/users", {
            data: requestData,
            success: function(data, status, jqXHR) {
                if (jqXHR != this.loadUsersRequest) {
                    return;
                }
                this.loadUsersRequest = null;
                this.loadUsersRequestData = null;
                this.dispatch(constants.ADMIN_LOAD_USERS_SUCCESS, {page: data});
            }.bind(this),

            error: function(error) {
                if (jqXHR != this.loadUsersRequest) {
                    return;
                }
                this.loadUsersRequest = null;
                this.loadUsersRequestData = null;
                if (error.statusText != "abort") {
                    this.dispatch(constants.ADMIN_LOAD_USERS_FAIL, {error: error.responseJSON});                    
                }
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

