var util = require("util"),
    _ = require("underscore"),
    React = require("react"),
    Fluxxor = require("fluxxor"),
    Dropzone = require("react-dropzone-component"),
    app = require("../app"),
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

        if (this.state.loading) {
            return <Spinner />;
        }

        return (
            <div>
                <AvatarEditor user={this.state.principal} />
            </div>
        );
    }
});
