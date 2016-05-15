import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'

import { Schemas, denormalize } from '../middleware/api'
import { loadPrincipalUser } from '../actions/PrincipalActions'
import Header from '../components/Header'

class Home extends Component {

    render() {
        return (
            <div>
                <Header user={this.props.principal} />
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        principal: denormalize(state, `entities.users.${state.principalUserId}`, Schemas.USER)
    }
};

export default connect(mapStateToProps, {

})(Home);


