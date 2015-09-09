var React = require("react");
var Router = require("router");
var Fluxxor = require("fluxxor");

var FluxMixin = Fluxxor.FluxMixin(React);
var RouteHandler = Router.RouteHandler;

module.exports = React.createClass({
    mixins: [FluxMixin],

    render: function() {
        return (
            <div className="container">
                <RouteHandler />
            </div>
        )
    }
});

