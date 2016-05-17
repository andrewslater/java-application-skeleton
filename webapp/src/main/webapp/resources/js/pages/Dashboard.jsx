import React, { Component, PropTypes } from 'react'

import translate from '../functions/translate'

class Dashboard extends Component {
    render() {
        return (
            <div>
                <h2>{translate('dashboard')}</h2>
            </div>
        );
    }
}

export default Dashboard
