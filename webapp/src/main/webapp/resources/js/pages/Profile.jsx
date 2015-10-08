var util = require("util"),
    _ = require("underscore"),
    React = require("react"),
    Fluxxor = require("fluxxor"),
    Formsy = require("formsy-react");

var app = require("../app"),
    APIClient = require("../APIClient"),
    Avatar = require("../components/Avatar"),
    AvatarEditor = require("../components/AvatarEditor"),
    Spinner = require("../components/Spinner"),
    InlineTextInput = require("../components/form/InlineTextInput");

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

    onFullNameSubmit: function(fullName) {
        if (fullName != this.state.principal.fullName) {
            this.getFlux().actions.users.patchUser(this.state.principal.userId, {fullName: fullName});
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
                <Formsy.Form onSubmit={this.submitForm} onChange={this.onFormChange} mapping={this.mapInputs}>
                <div className="col-md-9">
                    <h1><InlineTextInput value={principal.fullName} onSubmit={this.onFullNameSubmit} name="fullName" /></h1>
                    <h3>{principal.email}</h3>
                </div>
                </Formsy.Form>
            </div>
        );
    }
});
