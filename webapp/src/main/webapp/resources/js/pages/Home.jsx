import React, { Component, PropTypes } from 'react'
import ReactRouter from 'react-router'
import Fluxxor from 'fluxxor'
import Header from '../components/Header'

var FluxMixin = Fluxxor.FluxMixin(React);

module.exports = React.createClass({
    mixins: [FluxMixin],

    render: function() {
        return (
            <div>
                <Header />
                <div className="container">
                    {this.props.children}
                </div>
            </div>

        )
    }
});

