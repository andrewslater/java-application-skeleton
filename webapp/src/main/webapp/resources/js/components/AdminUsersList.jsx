var $ = require("jquery");
var React = require("react");
var Router = require("router");
var Fluxxor = require("fluxxor");
var ActiveTable = require("./ActiveTable");
var APIClient = require("../APIClient");

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Link = Router.Link;

module.exports = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("AdminUsersStore")],

    getStateFromFlux: function() {
        var store = this.getFlux().store("AdminUsersStore");
        return {
            loading: store.loading,
            error: store.error,
            page: store.page
        };
    },

    loadPage: function(pageNum) {
        this.getFlux().actions.admin.users.loadUsers(pageNum);
    },

    componentDidMount: function() {
        this.loadPage(this.props.query.page);
    },

    componentWillReceiveProps: function(nextProps) {
        this.loadPage(nextProps.query.page);
    },

    getDefaultProps: function() {
        return {
            query: {page: 1}
        }
    },

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
                return (<span>{this.props.rowData.createdAt}</span>)
            }
        });

        var LastLoginColumn = React.createClass({
            render: function() {
                return (<span>{this.props.rowData.lastLogin}</span>)
            }
        });

        var ActionsColumn = React.createClass({
            render: function() {
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

        var keyFunction = function(rowData) {
            return APIClient.getLink(rowData, "admin-self")
        };

        return (<ActiveTable page={this.state.page}
                             error={this.state.error}
                             loading={this.state.loading}
                             pageLinkName="admin-list-users"
                             keyFunction={keyFunction}
                             columns={columns} />);
    }
});
