var React = require("react");
var ReactRouter = require("react-router");
var ListUsers = require("./pages/admin/ListUsers");
var ViewUser = require("./pages/admin/ViewUser");
var AdminDashboard = require("./pages/admin/AdminDashboard");
var SystemSettings = require("./pages/admin/SystemSettings");
var Preferences = require("./pages/Preferences");
var Profile = require("./pages/Profile");
var Home = require("./pages/Home");

var Route = ReactRouter.Route;

var routes = (
    <Route component={Home} path="/">
        <Route component={Profile} path="profile" />
        <Route component={Preferences} path="preferences" />
        <Route path="admin">
            <Route component={ListUsers} path="users" />
            <Route component={ViewUser} path="users/:userId" />
            <Route component={SystemSettings} path="settings" />
        </Route>
    </Route>
);

module.exports = routes;
