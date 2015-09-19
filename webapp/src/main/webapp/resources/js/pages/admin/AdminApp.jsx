var React = require("react");
var Fluxxor = require("fluxxor");

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

