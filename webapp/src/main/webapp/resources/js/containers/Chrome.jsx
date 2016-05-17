import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'

import app from '../app'
import { Schemas, denormalize } from '../middleware/api'
import { loadPrincipalUser } from '../actions/PrincipalActions'
import Header from '../components/Header'

class Chrome extends Component {

    componentDidMount() {
        if (this.props.location.pathname == '/') {
            // TODO: Redirect using routes.jsx
            app.replaceHistory('/dashboard');
        }
    }

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

Chrome.propTypes = {
    principal: PropTypes.object
};

const mapStateToProps = (state) => {
    return {
        principal: denormalize(state, `entities.users.${state.principalUserId}`, Schemas.USER)
    }
};

export default connect(mapStateToProps, {

})(Chrome);


