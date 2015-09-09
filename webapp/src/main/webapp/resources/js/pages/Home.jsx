var React = require("react");
var Router = require("router");
var Fluxxor = require("fluxxor");
var Header = require("../components/Header");

var RouteHandler = Router.RouteHandler;
var FluxMixin = Fluxxor.FluxMixin(React);

module.exports = React.createClass({
    mixins: [FluxMixin],

    render: function() {
        return (
            <div>
                <Header />
                <div className="container">
                    <RouteHandler />
                </div>
            </div>

        )
    }
});

