var React = require("react");

var APIClient = require("../APIClient");

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            size: 'small'
        }
    },

    render: function() {
        var src = APIClient.getLink(this.props.user, "resource-avatar-" + this.props.size);
        return (<img className="img-rounded"
                     src={src} />);
    }
});
