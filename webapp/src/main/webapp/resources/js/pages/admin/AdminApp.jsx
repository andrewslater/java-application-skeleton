import React, { Component, PropTypes } from 'react'
import Fluxxor from 'fluxxor'

var FluxMixin = Fluxxor.FluxMixin(React);

module.exports = React.createClass({
    mixins: [FluxMixin],

    render: function() {
        return (
            <div className="admin-app-container">
                {this.props.children}
            </div>
        )
    }
});

