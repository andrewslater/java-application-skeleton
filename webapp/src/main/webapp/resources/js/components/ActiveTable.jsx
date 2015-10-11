var util = require("util"),
    _ = require("underscore"),
    React = require("react"),
    ReactRouter = require("react-router");

var Spinner = require("./Spinner");

module.exports = React.createClass({

    getDefaultProps: function() {
        return {
            columns: [],
            maxPaginationLinks: 5
        }
    },

    renderError: function() {
        var retryLink = null;

        if (this.props.retryCallback) {
            retryLink = <a href="#" onClick={this.props.retryCallback} className="alert-link">{$.i18n.prop('retry')}</a>;
        }

        return <tr><td colSpan={this.props.columns.length} className="text-center">
            <div className="alert alert-warning" role="alert">
                <span className="glyphicon glyphicon-exclamation-sign gi-3x" aria-hidden="true"></span>
                {this.props.error.message}
                {retryLink}
            </div>
        </td></tr>
    },

    renderHeaders: function() {
        return <tr>
            {this.props.columns.map(function(column) {
                var sortIcon = null;
                var currentSort = null;

                if (column.sortProperty) {
                    if (this.props.sorts.hasOwnProperty(column.sortProperty)) {
                        currentSort = this.props.sorts[column.sortProperty].toLowerCase();
                        sortIcon = <span>&nbsp;<i className={'fa fa-sort-' + currentSort}></i></span>;
                    }
                }
                var headingText = <span>{column.name}&nbsp;{sortIcon}</span>;
                if (column.sortProperty) {
                    var newDirection = currentSort == 'asc' ? 'DESC' : 'ASC';
                    headingText = <a href="javascript:void(0)" onClick={this.props.sortChangeCallback.bind(null, column.sortProperty + ':' + newDirection)}>{headingText}</a>
                }
                return <th key={'column-heading-' + column.name}>{headingText}</th>
            }.bind(this))}
        </tr>;
    },

    renderTableRows: function() {
        if (this.props.error) {
            return this.renderError();
        }

        if (!this.props.page) {
            return tableContent = <tr><td colSpan={this.props.columns.length}><Spinner /></td></tr>
        }

        var content = [];
        var rowCount = 0;

        this.props.page.content.map(function(rowData) {
            rowCount++;
            content.push(<tr key={this.props.keyFunction(rowData)}>
                {this.props.columns.map(function(column) {
                    var contents = React.createElement(column.component, {rowData: rowData});
                    return <td key={'column-contents-' + column.name}>{contents}</td>
                })}
            </tr>);
        }.bind(this));

        _.range(rowCount, this.props.page.size).map(function(i) {
            content.push(<tr key={'blank-row-' + i}><td colSpan={this.props.columns.length}>&nbsp;</td></tr>);
        }.bind(this));

        return content;
    },

    render: function() {
        return (
            <div className="container">
            <div className="row">
                <div className="col-xs-12">
                    <table className="table table-hover">
                        <thead>
                        {this.renderHeaders()}
                        </thead>
                        <tbody>
                        {this.renderTableRows()}
                        </tbody>
                    </table>
                </div>
                <div className="row">
                    <div className="col-xs-12 center-block text-center">
                        {this.renderPagination()}
                    </div>
                </div>
            </div>
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
                <li key={'pageLink-' + i}
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

        return <div className="center-block">
            <nav>
                <ul className="pagination">
                    <li className={page.first ? 'disabled' : ''}>
                        {prevLink}
                    </li>
                    {pageLinks}
                    <li className={page.last ? 'disabled' : ''}>
                        {nextLink}
                    </li>
                </ul>
            </nav>
        </div>;
    }
});
