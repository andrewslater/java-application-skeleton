var React = require("react");
var Fluxxor = require("fluxxor");
var AdminUsersList = require("../../components/AdminUsersList");
var ActiveTable = require("../../components/ActiveTable");

var FluxMixin = Fluxxor.FluxMixin(React);

module.exports = React.createClass({
    mixins: [FluxMixin],

    render: function() {
        var query = this.props.query || {};
        var page = query.page || this.props.page;
        return (<AdminUsersList page={page} />);
    }
});
