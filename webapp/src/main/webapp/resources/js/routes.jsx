var React = require("react");
var Router = require("router");
var ListUsers = require("./pages/admin/ListUsers");
var ViewUser = require("./pages/admin/ViewUser");
var AdminDashboard = require("./pages/admin/AdminDashboard");
var SystemSettings = require("./pages/admin/SystemSettings");
var AdminApp = require("./pages/admin/AdminApp");
var Home = require("./pages/Home");

var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

module.exports = function(contextPath) {
    return (
        <Route handler={Home} name="home" path={contextPath + '/?'}>
            <Route handler={AdminApp} name="adminHome" path="admin/?">
                <Route handler={ListUsers} name="admin-list-users" path="users" />
                <Route handler={ViewUser} name="admin-view-user" path="users/:userId" />
                <Route handler={SystemSettings} name="admin-edit-settings" path="settings/?" />
                <DefaultRoute handler={AdminDashboard} />
            </Route>
        </Route>);
};

