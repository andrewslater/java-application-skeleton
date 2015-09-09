require("./stylesheets");
var $ = require("jquery");
var _ = require("underscore");
var React = require("react");
var Router = require("router");
require("i18n");
require("noty");
require("bootstrap");
var APIClient = require("./APIClient");
var Spinner = require("./components/Spinner");

_.extend($.noty.defaults, {
    layout: "topCenter",
    timeout: 2000,
    theme: $.noty.themes.bootstrapTheme,
    animation: {
        open: 'animated bounceInDown',
        close: 'animated bounceOutUp'
    }
});

module.exports = {
    contextPath: "",
    csrf: "",
    apiToken: "",
    client: new APIClient(),

    run: function(contextPath, csrf) {

        console.log("Running application...");
        this.contextPath = contextPath;
        this.csrf = csrf;

        this.configureI18n();

        if (!localStorage.getItem("apiToken")) {
            React.render(React.createElement(Spinner), document.body);
            $.get(contextPath + "/ajax/token", function (data) {
                localStorage.setItem("apiToken", data.access_token);
                this.renderRoutes();
            }.bind(this));
        } else {
            this.renderRoutes();
        }
    },

    renderRoutes: function() {
        var routes = require("./routes")(contextPath);
        var flux = require("./flux");

        this.apiToken = localStorage.getItem("apiToken");
        this.client = new APIClient(this.contextPath + "/api/", this.apiToken, csrf);

        this.configureAutoTokenRefresh();

        Router.run(routes, Router.HistoryLocation, function(Handler) {
            var handler = React.createElement(Handler, {flux: flux});
            React.render(handler, document.body);
        });
    },

    configureI18n: function() {
        $.i18n.properties({
            name:'messages',
            path: this.contextPath + '/i18n/',
            mode:'map',
            language:'en_US'
        });
    },

    configureAutoTokenRefresh: function() {
        var app = this;
        $.ajaxSetup({
            statusCode: {
                401: function(error){
                    if (error.responseJSON.error == "invalid_token") {
                        $.ajax(app.contextPath + "/ajax/token", {
                            method: "GET",
                            success: function(data) {
                                app.client.setAPIToken(data.access_token);
                            },

                            error: function(req, status, errorThrown) {
                                console.log("Error encountered for token refresh: " + req + " (" + status + "): " + errorThrown);
                                // TODO: Force sign out and redirect to login page
                            }
                        })
                    } else {
                        // TODO: Force sign out and redirect to login page
                    }
                }
            }
        });

    }

};
