import React, { Component, PropTypes } from 'react'
import { Route } from 'react-router'
import ListUsers from './pages/admin/ListUsers'
import ViewUser from './pages/admin/ViewUser'
import AdminDashboard from './pages/admin/AdminDashboard'
import SystemSettings from './pages/admin/SystemSettings'
import Preferences from './pages/Preferences'
import Profile from './pages/Profile'
import Home from './pages/Home'

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
