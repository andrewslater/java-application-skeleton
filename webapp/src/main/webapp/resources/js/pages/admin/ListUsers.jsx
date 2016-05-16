import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { Schemas, getPagination } from '../../middleware/api'
import { loadUsers } from '../../actions/AdminUserActions'
import AdminUsersList from '../../components/AdminUsersList'

class ListUsers extends Component {

    componentDidMount() {
        const query = this.props.location.query;
        this.props.loadUsers(query.page, query.sort, query.filter);
    }

    render() {
        //return <div>adsf</div>;
        return (<AdminUsersList loadUsers={this.props.loadUsers}
                                pagination={this.props.pagination}
                                syncToHistoryUrl={this.props.location.pathname} />);
    }
}

const paginationContext = "admin/list-users";

const mapStateToProps = (state) => {
    return {
        pagination: getPagination(paginationContext, Schemas.USER, state)
    };
};

const _loadUsers = (pageNum, sortQuery, filter) => {
    return loadUsers(paginationContext, pageNum, sortQuery, filter);
};

export default connect(mapStateToProps, {
    loadUsers: _loadUsers
})(ListUsers)

