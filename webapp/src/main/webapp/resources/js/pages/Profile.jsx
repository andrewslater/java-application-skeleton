var util = require("util"),
    _ = require("underscore"),
    React = require("react"),
    Fluxxor = require("fluxxor");

var app = require("../app"),
    APIClient = require("../APIClient"),
    AvatarEditor = require("../components/AvatarEditor"),
    Spinner = require("../components/Spinner");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

module.exports = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("PrincipalUserStore")],

    getStateFromFlux: function() {
        var store = this.getFlux().store("PrincipalUserStore");
        return {
            loading: store.loading,
            principal: store.principal,
            error: store.error
        }
    },

    render: function() {

        var principal = this.state.principal;

        if (this.state.loading) {
            return <Spinner />;
        }

        return (
            <div className="row">
                <div className="col-md-3">
                    <AvatarEditor user={principal} uploadAction={this.getFlux().actions.principal.uploadAvatar} />
                </div>
                <div className="col-md-9">
                    <h1>{principal.fullName}</h1>
                    <h3>{principal.email}</h3>
                </div>
            </div>
        );
    }
});
