var $ = require("jquery");
var React = require("react");
var Router = require("router");
var Fluxxor = require("fluxxor");
var classnames = require("classnames");
var APIClient = require("../APIClient");
var Spinner = require("./Spinner");


var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Link = Router.Link;

module.exports = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("AdminUsersStore")],

    componentDidMount: function() {
        this.loadPage();
    },

    loadPage: function() {
        this.getFlux().actions.admin.users.loadUsers();
    },

    getStateFromFlux: function() {
        var store = this.getFlux().store("AdminUsersStore");
        return {
            loading: store.loading,
            error: store.error,
            page: store.page
        };
    },

    render: function () {
        var tableContent = null;

        if (this.state.error) {
            tableContent = <tr><td colSpan="5" className="text-center">
                <div className="alert alert-warning" role="alert">
                    <span className="glyphicon glyphicon-exclamation-sign gi-3x" aria-hidden="true"></span>
                    {this.state.error.message}
                    <a href="#" onClick={this.loadPage} className="alert-link">{$.i18n.prop('retry')}</a>
                </div>
            </td></tr>;
        } else if (this.state.page) {
            tableContent = this.state.page.content.map(function(user) {
                return <tr key={APIClient.getLink(user, 'admin-self')}>
                    <td>
                        <Link to="admin-view-user" params={{userId: user.userId}}>{user.fullName}</Link>
                    </td>
                    <td>
                        <Link to="admin-view-user" params={{userId: user.userId}}>{user.email}</Link>
                    </td>
                    <td>{user.createdAt}</td>
                    <td>{user.lastLogin}</td>
                    <td>
                        <a>Edit</a>
                    </td>
                </tr>;
            });
        }

        if (this.state.loading) {
            tableContent = <tr><td colSpan="5"><Spinner /></td></tr>
        }

        return (
            <div>
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>{$.i18n.prop('name')}</th>
                        <th>{$.i18n.prop('email')}</th>
                        <th>{$.i18n.prop('created-at')}</th>
                        <th>{$.i18n.prop('last-login')}</th>
                        <th>{$.i18n.prop('actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableContent}
                    </tbody>
                </table>
                {this.renderPagination()}
            </div>
        );
    },

    navigateToPage: function(pageNum) {
        console.log("loading page: " + pageNum);
    },

    renderPagination: function() {
        if (!this.state.page || this.state.page.totalPages == 1) {
            return null;
        }

        var maxPageLinks = 5;
        var page = this.state.page;
        var previousClasses = classnames({
            "disabled": page.first
        });
        var nextClasses = classnames({
            "disabled": page.last
        });
        var firstPageNum = Math.max(page.number - 2, 0);
        var lastPageNum = Math.min(firstPageNum + maxPageLinks - 1, page.totalPages);
        var pageLinks = [];

        for (var i = firstPageNum; i <= lastPageNum; i++) {
            pageLinks.push(<li className={i == page.number ? "active" : ""} onclick={this.navigateToPage}><a href="#">{i+1}</a></li>);
        }

        return <nav>
            <ul className="pagination">
                <li className={previousClasses}>
                    <a href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                {pageLinks}
                <li className={nextClasses}>
                    <a href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>;
    },



});
