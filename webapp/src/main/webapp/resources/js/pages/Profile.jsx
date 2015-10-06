var util = require("util"),
    _ = require("underscore"),
    React = require("react"),
    Fluxxor = require("fluxxor");

var app = require("../app"),
    APIClient = require("../APIClient"),
    Avatar = require("../components/Avatar"),
    AvatarEditor = require("../components/AvatarEditor"),
    Spinner = require("../components/Spinner");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

module.exports = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("PrincipalUserStore", "PrincipalAvatarStore")],

    getStateFromFlux: function() {
        var userStore = this.getFlux().store("PrincipalUserStore");
        var avatarStore = this.getFlux().store("PrincipalAvatarStore");
        return {
            principal: userStore.principal,
            error: userStore.error,
            avatarUploadProgress: avatarStore.uploadProgress
        }
    },

    render: function() {

        var principal = this.state.principal;

        if (!this.state.principal) {
            return <Spinner />;
        }

        return (
            <div className="row">
                <div className="col-md-3">
                    <AvatarEditor user={principal}
                                  uploadAction={this.getFlux().actions.principal.uploadAvatar}
                                  uploadProgress={this.state.avatarUploadProgress} />
                </div>
                <div className="col-md-9">
                    <h1>{principal.fullName}</h1>
                    <h3>{principal.email}</h3>
                </div>
            </div>
        );
    }
});
