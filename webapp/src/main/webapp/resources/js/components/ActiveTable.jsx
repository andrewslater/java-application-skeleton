var _ = require("underscore");
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
        var fillerRows = [];

        if (this.props.error) {
            tableContent = <tr><td colSpan="5" className="text-center">
                <div className="alert alert-warning" role="alert">
                    <span className="glyphicon glyphicon-exclamation-sign gi-3x" aria-hidden="true"></span>
                    {this.props.error.message}
                    <a href="#" onClick={this.loadPage} className="alert-link">{$.i18n.prop('retry')}</a>
                </div>
            </td></tr>;
        } else if (this.props.page) {
            var rowCount = 0;
            tableContent = this.props.page.content.map(function(rowData) {
                rowCount++;
                return <tr key={this.props.keyFunction(rowData)}>
                    {this.props.columns.map(function(column) {
                        var contents = React.createElement(column.component, {rowData: rowData});
                        return <td key={'column-contents-' + column.name}>{contents}</td>
                    })}
                </tr>;
            }.bind(this));

            _.range(rowCount, this.props.page.size).map(function(i) {
                fillerRows.push(<tr><td colSpan={this.props.columns.length}>&nbsp;</td></tr>);
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
                            var sortIcon = null;
                            var currentSort = null;

                            if (column.sortProperty) {
                                if (this.props.sorts.hasOwnProperty(column.sortProperty)) {
                                    currentSort = this.props.sorts[column.sortProperty].toLowerCase();
                                    sortIcon = <span>&nbsp;<i className={'fa fa-sort-' + currentSort}></i></span>;
                                }
                            }
                            var headingText = <span>{column.name}{sortIcon}</span>;
                            if (column.sortProperty) {
                                var newDirection = currentSort == 'asc' ? 'DESC' : 'ASC';
                                headingText = <a href="javascript:void(0)" onClick={this.props.sortChangeCallback.bind(null, column.sortProperty + ':' + newDirection)}>{headingText}</a>
                            }
                            return <th key={'column-heading-' + column.name}>{headingText}</th>
                        }.bind(this))}
                    </tr>
                    {tableContent}
                    {fillerRows}
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

        // TODO: Figure out a more clear way of performing these pagination calculations
        var page = this.props.page;
        var firstPageNum = Math.max(page.number - Math.floor(this.props.maxPaginationLinks / 2), 0);
        var lastPageNum = Math.min(firstPageNum + this.props.maxPaginationLinks - 1, page.totalPages - 1);
        var numLinks = lastPageNum - firstPageNum + 1;
        var pageLinks = [];

        if (numLinks < this.props.maxPaginationLinks) {
            firstPageNum = Math.max(0, firstPageNum - (this.props.maxPaginationLinks - numLinks));
        }

        for (var i = firstPageNum; i <= lastPageNum; i++) {
            pageLinks.push(
                <li key={i}
                    className={i == page.number ? "active" : ""}>
                    <a href="javascript:void(0)" onClick={this.props.pageChangeCallback.bind(null, i+1)}>{i+1}</a>
                </li>);
        }

        var prevLink = <a href="javascript:void(0)">&laquo;</a>;
        var nextLink = <a href="javascript:void(0)">&raquo;</a>;

        if (!page.first) {
            prevLink = (<a href="javascript:void(0)" onClick={this.props.pageChangeCallback.bind(null, page.number)} aria-label={$.i18n.prop('previous')}>
                <span aria-hidden="true">&laquo;</span>
            </a>);
        }

        if (!page.last) {
            nextLink = (<a href="javascript:void(0)" onClick={this.props.pageChangeCallback.bind(null, page.number + 2)} aria-label={$.i18n.prop('next')}>
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
