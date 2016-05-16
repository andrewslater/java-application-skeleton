import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import app from "../app"
import APIClient from '../APIClient'
import Spinner, { SpinnerType } from './Spinner'
import TextInput from './form/TextInput'

/**
 * Takes care of table rendering logic which isn't fun to reinvent:
 *  - Table headers incl. multi-column sort
 *  - Pagination controls
 *
 *  It exposes callback properties which the wrapping element is expected to implement in order to load the next page
 *  of records.
 *
 */
class ActiveTable extends Component {
    renderError(optionalMessage) {
        var retryLink = null;

        if (this.props.retryCallback) {
            retryLink = <a href="#" onClick={this.props.retryCallback} className="alert-link">{$.i18n.prop('retry')}</a>;
        }

        const message = optionalMessage || this.props.error.message;

        return (
            <tr>
                <td colSpan={this.props.columns.length} className="text-center">
                    <div className="alert alert-warning" role="alert">
                        <span className="glyphicon glyphicon-exclamation-sign gi-3x" aria-hidden="true"></span>
                        {message}
                        {retryLink}
                    </div>
                </td>
            </tr>
        );
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.syncToHistoryUrl || !newProps.pagination) {
            return;
        }

        const newPagination = newProps.pagination;
        const pagination = this.props.pagination;

        if (!pagination || (pagination.number != newPagination.number ||
            pagination.filter != newPagination.filter ||
            !_.isEqual(pagination.sort, newPagination.sort))) {
            const query = {
                page: newPagination.number,
                sort: APIClient.sortToQueryParam(newPagination.sort),
                filter: newPagination.filter
            };

            app.replaceHistory(newProps.syncToHistoryUrl, APIClient.collapseQuery(query));
        }
    }

    pageChangeCallback(page) {
        const pagination = this.props.pagination;
        if (_.isFunction(this.props.loadPage)) {
            this.props.loadPage(page, pagination.sort, pagination.filter);
        }

        if (_.isFunction(this.props.pageChangeCallback)) {
            this.props.pageChangeCallback(page);
        }
    }

    sortChangeCallback(sort) {
        const pagination = this.props.pagination;
        if (_.isFunction(this.props.loadPage)) {
            this.props.loadPage(1, sort, pagination.filter);
        }

        if (_.isFunction(this.props.sortChangeCallback)) {
            this.props.sortChangeCallback(sort);
        }
    }

    filterChangeCallback(event) {
        const filter = event.target.value;
        const pagination = this.props.pagination;
        if (_.isFunction(this.props.loadPage)) {
            this.props.loadPage(1, pagination.sort, filter);
        }

        if (_.isFunction(this.props.filterChangeCallback)) {
            this.props.filterChangeCallback(filter);
        }
    }

    renderHeaders() {
        const sort = _.get(this.props.pagination, "sort", {}) || {};

        return <tr>
            {this.props.columns.map(function(column) {
                let sortIcon = null;
                let currentSort = null;

                if (column.sortProperty) {
                    if (sort[column.sortProperty]) {
                        currentSort = sort[column.sortProperty].toLowerCase();
                        sortIcon = <span>&nbsp;<i className={'fa fa-sort-' + currentSort}></i></span>;
                    }
                }
                var headingText = <span>{column.name}&nbsp;{sortIcon}</span>;
                if (column.sortProperty) {
                    var newDirection = currentSort == 'asc' ? 'DESC' : 'ASC';
                    headingText = <a href="javascript:void(0)" onClick={this.sortChangeCallback.bind(this, column.sortProperty + ':' + newDirection)}>{headingText}</a>
                }

                var alignmentClass = column.alignContent == "center" ? "text-center" : null;
                return <th className={alignmentClass} key={'column-heading-' + column.name}>{headingText}</th>
            }.bind(this))}
        </tr>;
    }

    renderTableRows() {

        if (this.props.error) {
            return this.renderError();
        }

        if (!_.isFunction(this.props.keyFunction)) {
            return this.renderError("Invalid or missing key function provided to ActiveTable");
        }

        var records = this.getRecords();

        if (records != null && records.length == 0 && this.props.emptyView) {
            return (
                <div className="container">
                    {this.props.emptyView}
                </div>
            );
        }

        if (!records) {
            return <tr><td colSpan={this.props.columns.length}><Spinner /></td></tr>;
        }

        var content = [];
        var rowCount = 0;

        if (!_.isFunction(this.props.keyFunction)) {
            return this.renderError("Internal")
        }

        const actions = this.props.actions;

        records.map(function(rowData) {
            rowCount++;
            var className = null;
            if (this.props.rowClassNameCallback) {
                className = this.props.rowClassNameCallback(rowData);
            }
            content.push(<tr key={this.props.keyFunction(rowData)} className={className}>
                {this.props.columns.map(function(column) {
                    var contents = React.createElement(column.component, {actions: actions, rowData: rowData});
                    return <td key={'column-contents-' + column.name}>{contents}</td>
                })}
            </tr>);
        }.bind(this));

        if (this.getMinRows() > 0) {
            _.range(rowCount, this.getMinRows()).map(function(i) {;
                content.push(<tr key={'blank-row-' + i}><td colSpan={this.props.columns.length}>&nbsp;</td></tr>);
            }.bind(this));
        }

        return content;
    }

    getRecords() {
        return (this.props.pagination ? this.props.pagination.content : this.props.records);
    }

    getMinRows() {
        if (this.props.minRows) {
            return this.props.minRows;
        } else if (this.props.pagination) {
            return this.props.pagination.size;
        }
        return 0;
    }

    hasRecords() {
        var records = this.getRecords();
        return records && records.length > 0;
    }

    renderFilter() {
        const placeholder = this.props.filterPlaceholder || $.i18n.prop("placeholder.search");
        const pagination = this.props.pagination || {};

        return (
            <div className="form-row">
                <div className="col-lg-4 col-lg-offset-4">
                    <TextInput name="filterInput"
                               placeholder={placeholder}
                               defaultValue={pagination.filter}
                               onChange={this.filterChangeCallback.bind(this)}
                               promptIcon="search" />
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderFilter()}
                {this.renderLoadingSpinner()}
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
                </div>
                <div className="row">
                    <div className="col-xs-12 text-center">
                        {this.renderPagination()}
                    </div>
                </div>
            </div>
        )
    }

    renderLoadingSpinner() {
        const isLoading = _.get(this.props.pagination, "loading", false);
        return <Spinner hidden={true} type={SpinnerType.CIRCLE} />;
    }

    renderEmptyView() {
        return (
            <div className="row">
                <div className="col-xs-12 text-center">
                    <h2>{this.props.noResultsFoundMessage}</h2>
                </div>
            </div>
        );
    }

    renderPagination() {
        if (!this.props.pagination || this.props.pagination.totalPages <= 1) {
            return <div />;
        }

        // TODO: Figure out a more clear way of performing these pagination calculations
        var pagination = this.props.pagination;
        var firstPageNum = Math.max(pagination.number - Math.floor(this.props.maxPaginationLinks / 2), 1);
        var lastPageNum = Math.min(firstPageNum + this.props.maxPaginationLinks - 1, pagination.totalPages - 1);
        var numLinks = lastPageNum - firstPageNum + 1;
        var pageLinks = [];

        if (numLinks < this.props.maxPaginationLinks) {
            firstPageNum = Math.max(1, firstPageNum - (this.props.maxPaginationLinks - numLinks));
        }

        for (var i = firstPageNum; i <= lastPageNum; i++) {
            pageLinks.push(
                <li key={'pageLink-' + i}
                    className={i == pagination.number ? "active" : ""}>
                    <a href="javascript:void(0)" onClick={this.pageChangeCallback.bind(this, i)}>{i}</a>
                </li>);
        }

        var prevLink = <a href="javascript:void(0)">&laquo;</a>;
        var nextLink = <a href="javascript:void(0)">&raquo;</a>;

        if (!pagination.first) {
            prevLink = (<a href="javascript:void(0)" onClick={this.pageChangeCallback.bind(this, pagination.number - 1)} aria-label={$.i18n.prop('previous')}>
                <span aria-hidden="true">&laquo;</span>
            </a>);
        }

        if (!pagination.last) {
            nextLink = (<a href="javascript:void(0)" onClick={this.pageChangeCallback.bind(this, pagination.number + 1)} aria-label={$.i18n.prop('next')}>
                <span aria-hidden="true">&raquo;</span>
            </a>);
        }

        return (
            <nav>
                <ul className="pagination">
                    <li className={pagination.first ? 'disabled' : ''}>
                        {prevLink}
                    </li>
                    {pageLinks}
                    <li className={pagination.last ? 'disabled' : ''}>
                        {nextLink}
                    </li>
                </ul>
            </nav>
        );
    }
}

function restObjectKeyFunction(obj) {
    return APIClient.getLink(obj, "self");
}

ActiveTable.defaultProps = {
    columns: [],
    maxPaginationLinks: 5,
    keyFunction: restObjectKeyFunction
};

/**
 * TODO: Two modes supported by one component is a clear indication this should be split up into two components
 * Provides support for two modes: Records and Pagination
 * Records Mode
 *      Used to display a table for which all records are known. All sorting and filtering is handled within the client.
 *      You must specify these properties in Records Mode: records, sort, filter
 *
 *
 * Pagination Mode
 *      Used to display paginated results. Usually this is the case where there is a large number of records and it's infeasible to
 *              load them all initially. When the user changes page, sort, or filter an asynchronous call is made to load the correct
 *              page from the server (supplied by you!).
 *              You must specify these properties in Pagination Mode: pagination, loadPage
 *
 *
 */
ActiveTable.propTypes = {
    columns: PropTypes.array.isRequired,     // Column definitions
    records: PropTypes.array,                // Records (used when the table contains a fixed number of records -- no pagination)
    pagination: PropTypes.object,            // The pagination object corresponding to the currently visible page (records are loading asynchronously page by page)
    pageChangeCallback: PropTypes.func,      // Called whenever the user selects a new page
    sortChangeCallback: PropTypes.func,      // Called whenever the user selects a new sort
    filterChangeCallback: PropTypes.func,    // Called whenever the user changes the results filter (search)
    rowClassNameCallback: PropTypes.func,    // Allows the parent to modify the style applied to rows (e.g. show deleted rows with a red background
    keyFunction: PropTypes.func,             // Callback to derive a unique key for each row (default is to use a HATEOAS 'self' link)
    loadPage: PropTypes.func,                // Callback to load a new page of results based on pageNum, sort, & filter.
    maxPaginationLinks: PropTypes.number,    // Maximum number of pagination links to show at a time
    noResultsFoundMessage: PropTypes.string, // Message to display when there are no results found for a search
    retryCallback: PropTypes.func,           // Function to retry the load TODO: Remove? is this necessary?
    filter: PropTypes.string,                // The filter the user has supplied
    sort: PropTypes.object,                  // The sorts provided by the user (e.g. {"name": "DESC"})
    error: PropTypes.object,                 // The error? TODO: Remove? Improve error handling
    syncToHistoryUrl: PropTypes.string       // If supplied this control will rewrite the history to reflect the page, sort, & filter
};

export default ActiveTable
