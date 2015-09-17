var util = require("util");
var React = require("react");
var Fluxxor = require("fluxxor");
var AdminUsersList = require("../../components/AdminUsersList");

var FluxMixin = Fluxxor.FluxMixin(React);

module.exports = React.createClass({
    mixins: [FluxMixin],

    render: function() {
        return (<AdminUsersList query={this.props.location.query} />);
    }
});
