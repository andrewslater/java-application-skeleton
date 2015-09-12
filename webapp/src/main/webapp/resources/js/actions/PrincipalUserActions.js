var constants = require("../constants");
var app = require('../app');

module.exports = {

    loadUser: function() {
        this.dispatch(constants.LOAD_PRINCIPAL_USER);
        app.client.get("/user/principal", {
            success: function(data, status) {
                this.dispatch(constants.LOAD_PRINCIPAL_USER_SUCCESS, {user: data});
            }.bind(this),

            error: function(error) {
                this.dispatch(constants.LOAD_PRINCIPAL_USER_FAIL, {error: error.responseJSON});
            }.bind(this)
        });
    }

};

