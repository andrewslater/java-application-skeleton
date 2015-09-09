var noty = require("noty");
var constants = require("../constants");

module.exports = {

    loadSettings: function() {
        this.dispatch(constants.ADMIN_LOAD_SETTINGS);

        app.client.get("admin/settings", {
            success: function(data, status) {
                this.dispatch(constants.ADMIN_LOAD_SETTINGS_SUCCESS, {settings: data});
            }.bind(this),

            error: function(error) {
                this.dispatch(constants.ADMIN_LOAD_SETTINGS_FAIL, {error: error.responseJSON});
            }.bind(this)
        });
    },

    saveSettings: function(settings) {
        this.dispatch(constants.ADMIN_SAVE_SETTINGS, {settings: settings});

        app.client.patch("admin/settings", {
            data: JSON.stringify(settings),

            success: function(data, status) {
                noty({text: $.i18n.prop('settings-saved')});
                this.dispatch(constants.ADMIN_SAVE_SETTINGS_SUCCESS, {settings: data});
            }.bind(this),

            error: function(error) {
                this.dispatch(constants.ADMIN_SAVE_SETTINGS_FAIL, {error: error.responseJSON});
            }.bind(this)
        })
    }
};
