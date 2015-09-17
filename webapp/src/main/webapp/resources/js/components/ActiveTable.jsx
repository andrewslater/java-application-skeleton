var React = require("react");
var ReactRouter = require("react-router");

var Link = ReactRouter.Link;

module.exports = React.createClass({

    getDefaultProps: function() {
        return {
            columns: [],
            maxPaginationLinks: 5
        }
    },

    render: function() {

        var tableContent;

        if (this.props.error) {
            tableContent = <tr><td colSpan="5" className="text-center">
                <div className="alert alert-warning" role="alert">
                    <span className="glyphicon glyphicon-exclamation-sign gi-3x" aria-hidden="true"></span>
                    {this.props.error.message}
                    <a href="#" onClick={this.loadPage} className="alert-link">{$.i18n.prop('retry')}</a>
                </div>
            </td></tr>;
        } else if (this.props.page) {
            tableContent = this.props.page.content.map(function(rowData) {
                return <tr key={this.props.keyFunction(rowData)}>
                    {this.props.columns.map(function(column) {
                        var contents = React.createElement(column.component, {rowData: rowData});
                        return <td key={'column-contents-' + column.name}>{contents}</td>
                    })}
                </tr>;
            }.bind(this));
        }

        if (this.props.page === undefined) {
            tableContent = <tr><td colSpan="5"><Spinner /></td></tr>
        }

        return (
            <div>
                <table className="table table-hover">
                    <thead>
                    <tr>
                        {this.props.columns.map(function(column) {
                            return <th key={'column-heading-' + column.name}>{column.name}</th>
                        })}
                    </tr>
                    {tableContent}
                    </thead>
                </table>
                {this.renderPagination()}
            </div>
        )
    },

    renderPagination: function() {
        if (!this.props.page || this.props.page.totalPages == 1) {
            return null;
        }

        var page = this.props.page;
        var firstPageNum = Math.max(page.number - Math.floor(this.props.maxPaginationLinks / 2), 0);
        var lastPageNum = Math.min(firstPageNum + this.props.maxPaginationLinks - 1, page.totalPages - 1);
        var pageLinks = [];

        for (var i = firstPageNum; i <= lastPageNum; i++) {
            pageLinks.push(
                <li key={i}
                    className={i == page.number ? "active" : ""}>
                    <a href="javascript:void(0)" onClick={this.props.pageChangeCallback.bind(this, i+1)}>{i+1}</a>
                </li>);
        }

        var prevLink = <a href="javascript:void(0)">&laquo;</a>;
        var nextLink = <a href="javascript:void(0)">&raquo;</a>;

        if (!page.first) {
            prevLink = (<a href="javascript:void(0)" onClick={this.props.pageChangeCallback.bind(this, page.number)} aria-label={$.i18n.prop('previous')}>
                <span aria-hidden="true">&laquo;</span>
            </a>);
        }

        if (!page.last) {
            nextLink = (<a href="javascript:void(0)" onClick={this.props.pageChangeCallback.bind(this, page.number + 2)} aria-label={$.i18n.prop('next')}>
                <span aria-hidden="true">&raquo;</span>
            </a>);
        }

        return <nav>
            <ul className="pagination">
                <li className={page.first ? 'disabled' : ''}>
                    {prevLink}
                </li>
                {pageLinks}
                <li className={page.last ? 'disabled' : ''}>
                    {nextLink}
                </li>
            </ul>
        </nav>;
    }
});
