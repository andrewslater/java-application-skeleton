var $ = require("jquery");
var Fluxxor = require("fluxxor");
var app = require("./app");
var constants = require("./constants");
var AdminUsersStore = require("./stores/AdminUsersStore");
var AdminUserStore = require("./stores/AdminUserStore");
var SystemSettingsStore = require("./stores/SystemSettingsStore");
var AdminUsersActions = require("./actions/AdminUsersActions");
var SystemSettingsActions = require("./actions/SystemSettingsActions");

var stores = {
    AdminUsersStore: new AdminUsersStore(),
    AdminUserStore: new AdminUserStore(),
    SystemSettingsStore: new SystemSettingsStore()
};

var actions = {
    admin: {
        users: AdminUsersActions,
        settings: SystemSettingsActions
    }
};

var flux = new Fluxxor.Flux(stores, actions);

flux.on("dispatch", function(type, payload) {
    if (console && console.log) {
        console.log("[Dispatch]", type, payload);
    }
});

module.exports = flux;
