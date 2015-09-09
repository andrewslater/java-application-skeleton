var React = require("react");
var Router = require("router");

var RouteHandler = Router.RouteHandler;

module.exports = React.createClass({
    render: function() {
        return <RouteHandler {...this.props} />;
    }
});
