var $ = require("jquery");
var util = require("util");
var React = require("react");
var ReactRouter = require("react-router");
var Fluxxor = require("fluxxor");
var ActiveTable = require("./ActiveTable");
var APIClient = require("../APIClient");

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Link = ReactRouter.Link;
var History = ReactRouter.History;
var State = ReactRouter.State;

module.exports = React.createClass({
    mixins: [FluxMixin, State, History, StoreWatchMixin("AdminUsersStore")],

    getStateFromFlux: function() {
        var store = this.getFlux().store("AdminUsersStore");
        return {
            loading: store.loading,
            error: store.error,
            page: store.page
        };
    },

    loadPage: function(pageNum, sortQuery) {
        this.getFlux().actions.admin.users.loadUsers(pageNum, sortQuery);
    },

    componentDidMount: function() {
        this.loadPage(this.props.page, this.props.sort);
    },

    componentWillReceiveProps: function(nextProps) {
        this.loadPage(nextProps.page, nextProps.sort);
    },

    getDefaultProps: function() {
        return {
            page: 1,
            sort: "fullName:ASC"
        }
    },

    render: function() {
        var page = this.props.page;

        var NameColumn = React.createClass({
            render: function() {
                var user = this.props.rowData;
                return (<Link to={"/admin/users/" + user.userId}>{user.fullName}</Link>)
            }
        });

        var EmailColumn = React.createClass({
            render: function() {
                var user = this.props.rowData;
                return (<Link to={"/admin/users/" + user.userId}>{user.email}</Link>)
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

        var pageChangeCallback = function(pageNum) {
            this.history.pushState(null, "/admin/users", {page: pageNum});
        }.bind(this);

        return (<ActiveTable page={this.state.page}
                             error={this.state.error}
                             loading={this.state.loading}
                             pageChangeCallback={pageChangeCallback}
                             keyFunction={keyFunction}
                             columns={columns} />);
    }
});
