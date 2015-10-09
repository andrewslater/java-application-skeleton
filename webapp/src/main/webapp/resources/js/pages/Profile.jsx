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
    mixins: [FluxMixin, StoreWatchMixin("UsersStore", "PrincipalAvatarStore")],

    getStateFromFlux: function() {
        var usersStore = this.getFlux().store("UsersStore");
        var avatarStore = this.getFlux().store("PrincipalAvatarStore");
        return {
            principal: usersStore.getPrincipalUser(),
            avatarUploadProgress: avatarStore.uploadProgress
        }
    },

    onFullNameSubmit: function(fullName) {
        if (fullName != this.state.principal.fullName) {
            this.patchUser({fullName: fullName});
        }
    },

    onEmailSubmit: function(email) {
        if (email != this.state.principal.email) {
            this.patchUser({email: email});
        }
    },

    patchUser: function(properties) {
        this.getFlux().actions.users.patchUser(this.state.principal.userId, properties);
    },

    uploadAvatar: function(dataURI) {
        this.getFlux().actions.users.uploadAvatar(this.state.principal.userId, dataURI);
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
                                  uploadAction={this.uploadAvatar}
                                  uploadProgress={this.state.avatarUploadProgress} />
                </div>
                <Formsy.Form onSubmit={this.submitForm} onChange={this.onFormChange} mapping={this.mapInputs}>
                <div className="col-md-9">
                    <h1>
                        <InlineTextInput value={principal.fullName}
                                         onSubmit={this.onFullNameSubmit}
                                         name="fullName" />
                    </h1>
                    <h3>
                        <InlineTextInput value={principal.email}
                                         onSubmit={this.onEmailSubmit}
                                         name="email" />
                    </h3>
                </div>
                </Formsy.Form>
            </div>
        );
    }
});
