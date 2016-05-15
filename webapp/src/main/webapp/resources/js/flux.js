import $ from 'jquery'
import Fluxxor from 'fluxxor'

import app from './app'
import constants from './constants'

import AdminUsersStore from './stores/AdminUsersStore'
import AdminUserStore from './stores/AdminUserStore'
import SystemSettingsStore from './stores/SystemSettingsStore'
import PrincipalAvatarStore from './stores/PrincipalAvatarStore'
import UsersStore from './stores/UsersStore'

import AdminUsersActions from './actions/AdminUsersActions'
import SystemSettingsActions from './actions/SystemSettingsActions'
import UserActions from './actions/UserActions'

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
