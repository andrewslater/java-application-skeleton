var React = require("react");
var ReactRouter = require("react-router");
var Fluxxor = require("fluxxor");
var Header = require("../components/Header");

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

