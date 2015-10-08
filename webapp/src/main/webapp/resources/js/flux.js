var $ = require("jquery");
var Fluxxor = require("fluxxor");
var app = require("./app");
var constants = require("./constants");

var AdminUsersStore = require("./stores/AdminUsersStore");
var AdminUserStore = require("./stores/AdminUserStore");
var SystemSettingsStore = require("./stores/SystemSettingsStore");
var PrincipalUserStore = require("./stores/PrincipalUserStore");
var PrincipalAvatarStore = require("./stores/PrincipalAvatarStore");

var AdminUsersActions = require("./actions/AdminUsersActions"),
    SystemSettingsActions = require("./actions/SystemSettingsActions"),
    PrincipalUserActions = require("./actions/PrincipalUserActions"),
    UserActions = require("./actions/UserActions");

var stores = {
    AdminUsersStore: new AdminUsersStore(),
    AdminUserStore: new AdminUserStore(),
    SystemSettingsStore: new SystemSettingsStore(),
    PrincipalUserStore: new PrincipalUserStore(),
    PrincipalAvatarStore: new PrincipalAvatarStore()
};

var actions = {
    admin: {
        users: AdminUsersActions,
        settings: SystemSettingsActions
    },
    principal: PrincipalUserActions,
    users: UserActions
};

var flux = new Fluxxor.Flux(stores, actions);

flux.on("dispatch", function(type, payload) {
    if (console && console.log) {
        console.log("[Dispatch]", type, payload);
    }
});

module.exports = flux;
