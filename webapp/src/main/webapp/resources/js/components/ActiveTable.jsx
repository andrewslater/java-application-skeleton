var React = require("react");
var Fluxxor = require("fluxxor");
var Router = require("router");
var APIClient = require("../APIClient");

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Link = Router.Link;

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
                return <tr key={APIClient.getLink(rowData, this.props.keyLinkName)}>
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
        )
    }
});
