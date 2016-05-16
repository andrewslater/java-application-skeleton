import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import translate from '../functions/translate'
import ActiveTable from './ActiveTable'
import APIClient from '../APIClient'
import Avatar from './Avatar'
import Timestamp from './Timestamp'

class NameColumn extends Component {
    render() {
        var user = this.props.rowData;
        return (
            <div>
                <Link to={"/admin/users/" + user.userId}><Avatar user={user} size="micro" />&nbsp;{user.fullName}</Link>
            </div>
        );
    }
}

class EmailColumn extends Component {
    render() {
        var user = this.props.rowData;
        return (<Link to={"/admin/users/" + user.userId}>{user.email}</Link>)
    }
}

class CreatedAtColumn extends Component {
    render() {
        return (<Timestamp value={this.props.rowData.createdAt} />);
    }
}

class LastLoginColumn extends Component {
    render() {
        return (<Timestamp value={this.props.rowData.lastLogin} nullDisplayValue={translate('never')} />);
    }
}

class ActionsColumn extends Component {
    render() {
        return (<span><a>Edit</a></span>)
    }
}

class AdminUsersList extends Component {

    render() {
        return (
            <div>
                <ActiveTable
                    columns={this.props.columns}
                    loadPage={this.props.loadUsers}
                    pagination={this.props.pagination}
                    syncToHistoryUrl={this.props.syncToHistoryUrl}
                    filterPlaceholder={translate('search-users')} />
            </div>);
    }
}

AdminUsersList.defaultProps = {
    columns: [
        {name: translate('name'), component: NameColumn, sortProperty: 'fullName'},
        {name: translate('email'), component: EmailColumn, sortProperty: 'email'},
        {name: translate('created-at'), component: CreatedAtColumn, sortProperty: 'createdAt'},
        {name: translate('last-login'), component: LastLoginColumn, sortProperty: 'lastLogin'},
        {name: translate('actions'), component: ActionsColumn}
    ]
};

AdminUsersList.propTypes = {
    columns: React.PropTypes.array.isRequired,
    loadUsers: React.PropTypes.func.isRequired,
    pagination: PropTypes.object,
    syncToHistoryUrl: PropTypes.string
};

export default AdminUsersList
