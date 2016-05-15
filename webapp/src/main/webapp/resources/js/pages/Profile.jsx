import util from 'util'
import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import Fluxxor from 'fluxxor'
import Formsy from 'formsy-react'

import app from '../app'
import APIClient from '../APIClient'
import Avatar from '../components/Avatar'
import AvatarEditor from '../components/AvatarEditor'
import Spinner from '../components/Spinner'
import InlineTextInput from '../components/form/InlineTextInput'

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
