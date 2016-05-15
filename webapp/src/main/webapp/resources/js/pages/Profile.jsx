import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Formsy from 'formsy-react'

import app from '../app'
import { Schemas, denormalize } from '../middleware/api'
import { patchUser, uploadAvatar } from '../actions/UserActions'

import APIClient from '../APIClient'
import Avatar from '../components/Avatar'
import AvatarEditor from '../components/AvatarEditor'
import InlineTextInput from '../components/form/InlineTextInput'
import Spinner from '../components/Spinner'

class Profile extends Component {

    onFullNameSubmit(fullName) {
        if (fullName != this.props.user.fullName) {
            this.patchUser({fullName: fullName});
        }
    }

    onEmailSubmit(email) {
        if (email != this.props.user.email) {
            this.patchUser({email: email});
        }
    }

    patchUser(properties) {
        this.props.patchUser(Object.assign({}, properties, { userId: this.props.user.userId }));
    }

    uploadAvatar(dataURI) {
        this.props.uploadAvatar(this.props.user.userId, dataURI);
    }

    render() {
        const user = this.props.user;

        if (!user) {
            return <Spinner />;
        }

        return (
            <div className="row">
                <div className="col-md-3">
                    <AvatarEditor user={user}
                                  onSubmit={this.uploadAvatar.bind(this)} />
                </div>
                <div className="col-md-9">
                    <h1>
                        <InlineTextInput value={user.fullName}
                                         onSubmit={this.onFullNameSubmit.bind(this)}
                                         name="fullName" />
                    </h1>
                    <h3>
                        <InlineTextInput value={user.email}
                                         onSubmit={this.onEmailSubmit.bind(this)}
                                         name="email" />
                    </h3>
                </div>
            </div>
        );
    }
}

Profile.propTypes = {
    user: PropTypes.object,
    patchUser: PropTypes.func.isRequired,
    uploadAvatar: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        user: denormalize(state, `entities.users.${state.principalUserId}`, Schemas.USER)
    }
};

export default connect(mapStateToProps, {
    patchUser,
    uploadAvatar
})(Profile)
