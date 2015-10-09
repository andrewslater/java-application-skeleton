var $ = require("jquery"),
    Fluxxor = require("fluxxor");

var app = require("./app"),
    constants = require("./constants");

var AdminUsersStore = require("./stores/AdminUsersStore"),
    AdminUserStore = require("./stores/AdminUserStore"),
    SystemSettingsStore = require("./stores/SystemSettingsStore"),
    PrincipalAvatarStore = require("./stores/PrincipalAvatarStore"),
    UsersStore = require("./stores/UsersStore");

var AdminUsersActions = require("./actions/AdminUsersActions"),
    SystemSettingsActions = require("./actions/SystemSettingsActions"),
    UserActions = require("./actions/UserActions");

var stores = {
    AdminUsersStore: new AdminUsersStore(),
    AdminUserStore: new AdminUserStore(),
    SystemSettingsStore: new SystemSettingsStore(),
    PrincipalAvatarStore: new PrincipalAvatarStore(),
    UsersStore: new UsersStore()
};

var actions = {
    admin: {
        users: AdminUsersActions,
        settings: SystemSettingsActions
    },
    users: UserActions
};

var flux = new Fluxxor.Flux(stores, actions);

flux.on("dispatch", function(type, payload) {
    if (console && console.log) {
        console.log("[Dispatch]", type, payload);
    }
});

module.exports = flux;
