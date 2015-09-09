var React = require("react");
var Fluxxor = require("fluxxor");
var Spinner = require("../../components/Spinner");

var FluxMixin = Fluxxor.FluxMixin(React),
StoreWatchMixin = Fluxxor.StoreWatchMixin;

module.exports = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("AdminUserStore")],

    componentDidMount: function() {
        this.loadUser();
    },

    loadUser: function() {
        this.getFlux().actions.admin.users.loadUser(this.props.params.userId);
    },

    getStateFromFlux: function() {
        var store = this.getFlux().store("AdminUserStore");
        return {
            loading: store.loading,
            error: store.error,
            user: store.user
        };
    },

    render: function() {
        if (this.state.error) {
            return this.renderError();
        } else if (this.state.loading || !this.state.user) {
            return <Spinner />
        }

        return (<h1>{this.state.user.email}</h1>);
    },

    renderError: function() {
        return (<div className="alert alert-warning" role="alert">
            <span className="glyphicon glyphicon-exclamation-sign gi-3x" aria-hidden="true"></span>
            {this.state.error.message}
            <a href="#" onClick={this.loadUser} className="alert-link">{$.i18n.prop('retry')}</a>
        </div>);
    }

});
