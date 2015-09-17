require("./stylesheets");
require("i18n");
require("noty");
require("bootstrap");

var $ = require("jquery");
var _ = require("underscore");
var React = require("react");
var ReactRouter = require("react-router");
var APIClient = require("./APIClient");
var Spinner = require("./components/Spinner");

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;

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
    csrf: "",
    apiToken: "",
    client: new APIClient(),

    run: function(csrf) {

        console.log("Running application...");
        this.csrf = csrf;

        this.configureI18n();

        if (!localStorage.getItem("apiToken")) {
            React.render(React.createElement(Spinner), document.body);
            $.get("/ajax/token", function (data) {
                localStorage.setItem("apiToken", data.access_token);
                this.renderRoutes();
            }.bind(this));
        } else {
            this.renderRoutes();
        }
    },

    renderRoutes: function() {
        var flux = require("./flux");
        var ListUsers = require("./pages/admin/ListUsers");
        var ViewUser = require("./pages/admin/ViewUser");
        var AdminDashboard = require("./pages/admin/AdminDashboard");
        var SystemSettings = require("./pages/admin/SystemSettings");
        var AdminApp = require("./pages/admin/AdminApp");
        var Home = require("./pages/Home");

        this.apiToken = localStorage.getItem("apiToken");
        this.client = new APIClient("/api/", this.apiToken, csrf);

        this.configureAutoTokenRefresh();

        flux.actions.principal.loadUser();

        var createElement = function(Component, props) {
            props.flux = flux;
            return <Component {...props} />
        };

        var createBrowserHistory = require('history/lib/createBrowserHistory');
        var history = createBrowserHistory();
        React.render(
            <Router createElement={createElement} history={history}>
                <Route component={Home} path="/">
                    <Route component={AdminApp} path="admin">
                        <Route component={ListUsers} path="users" />
                        <Route component={ViewUser} path="users/:userId" />
                        <Route component={SystemSettings} path="settings" />
                    </Route>
                </Route>
            </Router>, document.body)
    },

    configureI18n: function() {
        $.i18n.properties({
            name:'messages',
            path: '/i18n/',
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
                        $.ajax("/ajax/token", {
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
