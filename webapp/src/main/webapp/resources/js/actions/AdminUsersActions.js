var util = require('util');
var constants = require("../constants");
var app = require('../app');

module.exports = {
    loadUsersRequest: null,

    loadUsers: function(pageNum, sortQuery, filter ) {
        // The API uses zero-indexed page numbers
        pageNum = pageNum ? pageNum - 1 : 0;
        this.dispatch(constants.ADMIN_LOAD_USERS);

        if (this.loadUsersRequest) {
            this.loadUsersRequest.abort();
        }

        this.loadUsersRequest = app.client.get("admin/users", {
            data: {
                page: pageNum,
                sort: sortQuery,
                filter: filter
            },

            success: function(data, status) {
                this.loadUsersRequest = null;
                this.dispatch(constants.ADMIN_LOAD_USERS_SUCCESS, {page: data});
            }.bind(this),

            error: function(error) {
                this.loadUsersRequest = null;
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

