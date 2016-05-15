import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import ActiveTable from './ActiveTable'
import APIClient from '../APIClient'
import Avatar from './Avatar'
import TextInput from './form/TextInput'

class AdminUsersList extends Component {

    loadPage(pageNum, sortQuery, filter) {
        this.getFlux().actions.admin.users.loadUsers(pageNum, sortQuery, filter);
    }

    componentDidMount() {
        this.loadPage(this.props.page, this.props.sort, this.props.filter);
    }

    componentWillReceiveProps(nextProps) {
        this.loadPage(nextProps.page, nextProps.sort, nextProps.filter);
    }

    pageChangeCallback(pageNum) {
        this.pushHistoryState({
            page: pageNum,
            sort: this.props.sort,
            filter: this.props.filter
        });
    }

    sortChangeCallback(sort) {
        this.pushHistoryState({
            sort: sort,
            filter: this.props.filter
        });
    }

    filterChangeCallback(event) {
        this.replaceHistoryState({
            filter: event.target.value,
            sort: this.props.sort
        })
    }

    pushHistoryState(query) {
        this.history.pushState(null, "/admin/users", APIClient.collapseQuery(query));
    }

    replaceHistoryState(query) {
        this.history.replaceState(null, "/admin/users", APIClient.collapseQuery(query));
    }

    render() {
        var NameColumn = React.createClass({
            render() {
                var user = this.props.rowData;
                return (
                    <div>
                        <Link to={"/admin/users/" + user.userId}><Avatar user={user} size="micro" />&nbsp;{user.fullName}</Link>
                    </div>
                );
            }
        });

        var EmailColumn = React.createClass({
            render() {
                var user = this.props.rowData;
                return (<Link to={"/admin/users/" + user.userId}>{user.email}</Link>)
            }
        });

        var CreatedAtColumn = React.createClass({
            render() {
                return (<span>{this.props.rowData.createdAt}</span>)
            }
        });

        var LastLoginColumn = React.createClass({
            render() {
                return (<span>{this.props.rowData.lastLogin}</span>)
            }
        });

        var ActionsColumn = React.createClass({
            render() {
                return (<span><a>Edit</a></span>)
            }
        });

        var columns = [
            {name: $.i18n.prop('name'), component: NameColumn, sortProperty: "fullName"},
            {name: $.i18n.prop('email'), component: EmailColumn, sortProperty: "email"},
            {name: $.i18n.prop('created-at'), component: CreatedAtColumn, sortProperty: "createdAt"},
            {name: $.i18n.prop('last-login'), component: LastLoginColumn, sortProperty: "lastLogin"},
            {name: $.i18n.prop('actions'), component: ActionsColumn}
        ];

        var keyFunction = function(rowData) {
            return APIClient.getLink(rowData, "admin-self")
        };

        return (
            <div>
                <div className="form-row">
                    <input name="filterInput" placeholder={$.i18n.prop('search')} defaultValue={this.props.filter} onChange={this.filterChangeCallback}/>
                </div>
                <ActiveTable page={this.state.page}
                             error={this.state.error}
                             loading={this.state.loading}
                             sorts={APIClient.parseSort(this.props.sort)}
                             pageChangeCallback={this.pageChangeCallback}
                             sortChangeCallback={this.sortChangeCallback}
                             keyFunction={keyFunction}
                             columns={columns} />
            </div>);
    }
}

AdminUsersList.defaultProps = {
    page: 1,
    sort: null,
    filter: null
};

export default AdminUsersList
