import React, { Component, PropTypes } from 'react'
import { Route } from 'react-router'

import Chrome from './containers/Chrome'
import Dashboard from './pages/Dashboard'
import ListUsers from './pages/admin/ListUsers'
import ViewUser from './pages/admin/ViewUser'
import AdminDashboard from './pages/admin/AdminDashboard'
import SystemSettings from './pages/admin/SystemSettings'
import Preferences from './pages/Preferences'
import Profile from './pages/Profile'

var routes = (
    <Route component={Chrome} path="/">
        <Route component={Dashboard} path="dashboard" />
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
