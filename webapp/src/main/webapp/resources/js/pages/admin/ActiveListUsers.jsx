var $ = require("jquery");
var React = require("react");
var Router = require("router");
var Fluxxor = require("fluxxor");
var ActiveTable = require("../../components/ActiveTable");

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Link = Router.Link;

module.exports = React.createClass({
    mixins: [FluxMixin],

    render: function() {
        var query = this.props.query || {};
        var page = query.page || this.props.page;

        var NameColumn = React.createClass({
            render: function() {
                var user = this.props.rowData;
                return (<Link to="admin-view-user" params={{userId: user.userId}}>{user.fullName}</Link>)
            }
        });

        var EmailColumn = React.createClass({
            render: function() {
                var user = this.props.rowData;
                return (<Link to="admin-view-user" params={{userId: user.userId}}>{user.email}</Link>)
            }
        });

        var CreatedAtColumn = React.createClass({
            render: function() {
                var user = this.props.rowData;
                return (<span>{user.createdAt}</span>)
            }
        });

        var LastLoginColumn = React.createClass({
            render: function() {
                var user = this.props.rowData;
                return (<span>{user.lastLogin}</span>)
            }
        });

        var ActionsColumn = React.createClass({
            render: function() {
                var user = this.props.rowData;
                return (<span><a>Edit</a></span>)
            }
        });

        var columns = [
            {name: $.i18n.prop('name'), component: NameColumn, sortable: true},
            {name: $.i18n.prop('email'), component: EmailColumn, sortable: true},
            {name: $.i18n.prop('created-at'), component: CreatedAtColumn, sortable: true},
            {name: $.i18n.prop('last-login'), component: LastLoginColumn, sortable: true},
            {name: $.i18n.prop('actions'), component: ActionsColumn, sortable: false}
        ];

        return (<ActiveTable pageLinkName="admin-view-user" keyLinkName="admin-self" columns={columns} />);
    }
});
