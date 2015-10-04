var React = require("react");

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            percentComplete: null
        }
    },

    render: function() {
        if (!this.props.percentComplete) {
            return null;
        }

        var style = {
            width: this.props.percentComplete + '%'
        };

        return (
            <div className="progress">
                <div className="progress-bar"
                     role="progressbar"
                     aria-valuenow={this.props.percentComplete}
                     aria-valuemin="0"
                     aria-valuemax="100"
                     style={style}>
                </div>
            </div>
        );
    }

});
