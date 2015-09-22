require("./stylesheets");
require("i18n");
require("noty");
require("bootstrap");

var $ = require("jquery"),
    _ = require("underscore"),
    React = require("react"),
    ReactRouter = require("react-router"),
    APIClient = require("./APIClient"),
    Spinner = require("./components/Spinner");

var Router = ReactRouter.Router,
    Route = ReactRouter.Route;

module.exports = {
    csrf: "",
    apiToken: "",
    client: new APIClient(),

    run: function(csrf) {
        React.render(<Spinner />, document.body);

        this.csrf = csrf;
        this.configureI18n();
        this.configureNotifications();

        if (!localStorage.getItem("apiToken")) {

            $.get("/ajax/token", {
                success: function(data) {
                    localStorage.setItem("apiToken", data.access_token);
                    this.renderRoutes();
                }.bind(this),

                error: function(jqXhr, textStatus) {
                    console.log("Failed to retrieve API token: " + textStatus);
                    // TODO: Show error page?
                }
            });

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
        var Preferences = require("./pages/Preferences");
        var Profile = require("./pages/Profile");
        var Home = require("./pages/Home");

        this.apiToken = localStorage.getItem("apiToken");
        this.client = new APIClient("/api/", this.apiToken, csrf);

        this.configureAutoTokenRefresh();
        flux.actions.principal.loadUser();

        var createElement = function(Component, props) {
            return <Component {...props} flux={flux} />
        };

        var createBrowserHistory = require('history/lib/createBrowserHistory');
        var history = createBrowserHistory();
        React.render(
            <Router createElement={createElement} history={history}>
                <Route component={Home} path="/">
                    <Route component={Profile} path="profile" />
                    <Route component={Preferences} path="preferences" />
                    <Route path="admin">
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
    },

    configureNotifications: function() {
        _.extend($.noty.defaults, {
            layout: "topCenter",
            timeout: 2000,
            theme: $.noty.themes.bootstrapTheme,
            animation: {
                open: 'animated bounceInDown',
                close: 'animated bounceOutUp'
            }
        });
    }
};
