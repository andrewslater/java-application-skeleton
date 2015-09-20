var _ = require("underscore");
var $ = require("jquery");
var util = require("util");
var React = require("react");
var ReactRouter = require("react-router");
var Fluxxor = require("fluxxor");
var ActiveTable = require("./ActiveTable");
var APIClient = require("../APIClient");
var TextInput = require("./form/TextInput");

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

    loadPage: function(pageNum, sortQuery, filter) {
        this.getFlux().actions.admin.users.loadUsers(pageNum, sortQuery, filter);
    },

    componentDidMount: function() {
        this.loadPage(this.props.page, this.props.sort, this.props.filter);
    },

    componentWillReceiveProps: function(nextProps) {
        this.loadPage(nextProps.page, nextProps.sort, nextProps.filter);
    },

    getDefaultProps: function() {
        return {
            page: 1,
            sort: null,
            filter: null
        }
    },

    render: function() {
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
            {name: $.i18n.prop('name'), component: NameColumn, sortProperty: "fullName"},
            {name: $.i18n.prop('email'), component: EmailColumn, sortProperty: "email"},
            {name: $.i18n.prop('created-at'), component: CreatedAtColumn, sortProperty: "createdAt"},
            {name: $.i18n.prop('last-login'), component: LastLoginColumn, sortProperty: "lastLogin"},
            {name: $.i18n.prop('actions'), component: ActionsColumn}
        ];

        var keyFunction = function(rowData) {
            return APIClient.getLink(rowData, "admin-self")
        };

        var pageChangeCallback = function(pageNum) {
            var query = APIClient.collapseQuery({
                page: pageNum,
                sort: this.props.sort,
                filter: this.props.filter
            });
            this.history.pushState(null, "/admin/users", query);
        }.bind(this);

        var sortChangeCallback = function(sort) {
            var query = APIClient.collapseQuery({
                sort: sort,
                filter: this.props.filter
            });
            this.history.pushState(null, "/admin/users", query);
        }.bind(this);

        var filterChangeCallback = function(event) {
            var query = APIClient.collapseQuery({
                filter: event.target.value,
                sort: this.props.sort
            });
            this.history.replaceState(null, "/admin/users", query);
        }.bind(this);

        return (
            <div>
                <div className="form-row">
                    {$.i18n.prop('search')}:<input name="filterInput" defaultValue={this.props.filter} onChange={filterChangeCallback}/>
                </div>
                <ActiveTable page={this.state.page}
                             error={this.state.error}
                             loading={this.state.loading}
                             sorts={APIClient.parseSort(this.props.sort)}
                             pageChangeCallback={pageChangeCallback}
                             sortChangeCallback={sortChangeCallback}
                             keyFunction={keyFunction}
                             columns={columns} />
            </div>);
    }
});
