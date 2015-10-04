var $ = require("jquery"),
    _ = require("underscore"),
    React = require("react"),
    ReactRouter = require("react-router"),
    APIClient = require("./APIClient"),
    Spinner = require("./components/Spinner");

require("jq-ajax-progress");
require("./stylesheets");
require("i18n");
require("noty");
require("bootstrap");


var Router = ReactRouter.Router,
    Route = ReactRouter.Route;

/**
 * This is the main entry point for the client-side browser application.
 */
module.exports = {
    csrf: "",
    apiToken: "",
    client: new APIClient(),

    /**
     * Think of this as equivalent to the main() function
     * @param csrf
     */
    run: function(csrf) {
        React.render(<Spinner />, document.body);

        this.csrf = csrf;
        this.configureI18n();
        this.configureNotifications();
        this.disableFileDropping();

        if (!localStorage.getItem("apiToken")) {

            $.get("/ajax/token", function(data, status) {
                    localStorage.setItem("apiToken", data.access_token);
                    this.renderRoutes();
                }.bind(this)
            );

        } else {
            this.renderRoutes();
        }
    },

    /**
     * Here we set up all of the routes using react-router (https://github.com/rackt/react-router)
     * This really helps the application feel responsive because we do not have to load a full
     * page as the user navigates between pages.
     */
    renderRoutes: function() {
        var routes = require("./routes");
        var flux = require("./flux");
        var history = require('history/lib/createBrowserHistory')();

        this.apiToken = localStorage.getItem("apiToken");
        this.client = new APIClient("/api/", this.apiToken, csrf);

        this.configureAutoTokenRefresh();
        flux.actions.principal.loadUser();

        var createElement = function(Component, props) {
            return <Component {...props} flux={flux} />
        };

        React.render(
            <Router createElement={createElement} history={history} routes={routes} />,
            document.body
        );
    },

    /**
     * Configures the jQuery internationalization (i18n) plugin
     * This allows us to easily translate text within the application.
     * All user-facing strings live server-side in messages*.properties files
     * In the browser we can simply call:
     *
     *      $.i18n.prop('propName')
     *
     * and this will render the property defined in the message.properties file for the correct language
     */
    configureI18n: function() {
        $.i18n.properties({
            name:'messages',
            path: '/i18n/',
            mode:'map',
            language:'en_US'
        });
    },

    /**
     * Configures jQuery so that any 401 Unauthorized responses will trigger logic to prompt the user
     * to sign back in.
     */
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

    /**
     * Sets up noty (http://ned.im/noty/)
     * Easy, consistent Growl-style notifications
     */
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
    },

    /**
     * Disallow files to be dragged and dropped onto the page.
     * This can be overriden in specific places we want to allow file drops (such as the AvatarEditor)
     */
    disableFileDropping: function() {
        var preventEvent = function(event) {
            event.stopPropagation();
            event.preventDefault();
        };

        window.addEventListener('dragover', preventEvent);
        window.addEventListener('drop', preventEvent);
    }
};
