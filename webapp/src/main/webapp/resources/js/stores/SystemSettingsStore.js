var $ = require("jquery");
var Fluxxor = require("fluxxor");
var constants = require("../constants");

module.exports = Fluxxor.createStore({
    initialize: function() {
        this.loading = null;
        this.saving = null;
        this.loadError = null;
        this.saveError = null;
        this.user = null;

        this.bindActions(
            constants.ADMIN_LOAD_SETTINGS, this.onLoadSettings,
            constants.ADMIN_LOAD_SETTINGS_SUCCESS, this.onLoadSettingsSuccess,
            constants.ADMIN_LOAD_SETTINGS_FAIL, this.onLoadSettingsFail,

            constants.ADMIN_SAVE_SETTINGS, this.onSaveSettings,
            constants.ADMIN_SAVE_SETTINGS_SUCCESS, this.onSaveSettingsSuccess,
            constants.ADMIN_SAVE_SETTINGS_FAIL, this.onSaveSettingsFail
        );
    },

    onLoadSettings: function() {
        this.loading = true;
        this.settings = null;
        this.loadError = null;
        this.emit("change");
    },

    onLoadSettingsSuccess: function(payload) {
        this.loading = false;
        this.loadError = null;
        this.settings = payload.settings;
        this.emit("change");
    },

    onLoadSettingsFail: function(payload) {
        this.loading = false;
        this.loadError = payload.error;
        this.massageErrorIfNeccessary(this.loadError);
        this.emit("change");
    },

    onSaveSettings: function(payload) {
        this.saving = true;
        this.saveError = null;
        this.settings = payload.settings;
        this.emit("change");
    },

    onSaveSettingsSuccess: function(payload) {
        this.saving = false;
        this.saveError = null;
        this.settings = payload.settings;
        this.emit("change");
    },

    onSaveSettingsFail: function(payload) {
        this.saving = false;
        this.saveError = payload.error;
        this.massageErrorIfNeccessary(this.saveError);
        this.emit("change");
    },

    massageErrorIfNeccessary: function(error) {
        if (error.message === undefined) {
            error.message = $.i18n.prop('error.something-went-wrong');
        }
    }


});
