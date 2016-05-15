import util from 'util'
import React, { Component, PropTypes } from 'react'
import Fluxxor from 'fluxxor'
import AdminUsersList from '../../components/AdminUsersList'

var FluxMixin = Fluxxor.FluxMixin(React);

module.exports = React.createClass({
    mixins: [FluxMixin],

    render: function() {
        var query = this.props.location.query;
        return (<AdminUsersList page={query.page} sort={query.sort} filter={query.filter} />);
    }
});
