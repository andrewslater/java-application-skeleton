var React = require("react");

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            percentComplete: null
        }
    },

    render: function() {
        if (this.props.percentComplete == null) {
            return null;
        }

        return <progress value={this.props.percentComplete} max="100"></progress>;
    }

});
