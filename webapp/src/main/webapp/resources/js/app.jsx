import $ from 'jquery'
import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import { push, replace, syncHistoryWithStore } from 'react-router-redux'

require("./stylesheets");
require("i18n");
require("bootstrap");

import configureStore from './store/configureStore';
import { loadPrincipalUser } from './actions/PrincipalActions'
import APIClient from './APIClient'
import Spinner from './components/Spinner'

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
        ReactDOM.render(<Spinner />, document.getElementById("app"));

        this.store = configureStore();
        this.history = syncHistoryWithStore(browserHistory, this.store);

        this.csrf = csrf;
        this.configureI18n();
        this.disableFileDropping();

        if (!localStorage.getItem("apiToken")) {

            $.get("/ajax/token", (data) => {
                    localStorage.setItem("apiToken", data.access_token);
                    this.renderRoutes();
                }
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
        const routes = require('./routes');

        this.apiToken = localStorage.getItem("apiToken");
        this.client = new APIClient("/api/", this.apiToken);

        this.configureAutoTokenRefresh();
        this.store.dispatch(loadPrincipalUser());

        var createElement = function(Component, props) {
            return <Component {...props} />
        };

        ReactDOM.render(
            <Provider store={this.store}>
                <Router createElement={createElement} history={this.history} routes={routes} />
            </Provider>,
            document.getElementById("app")
        );
    },

    pushHistory: function(location, params) {
        setTimeout(() => {
            this.store.dispatch(push({pathname: location, query: params}));
        }, 1);

    },

    replaceHistory: function(location, params) {
        setTimeout(() => {
            this.store.dispatch(replace({pathname: location, query: params}));
        }, 1);
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
