import React, { Component, PropTypes } from 'react'
import moment from 'moment'

/**
 * Renders an ISO-8601 timestamp string according the user's preferences
 * TODO: Honor user-specific timestamp display preferences
 */
class Timestamp extends Component {
    render() {
        var displayValue = this.props.nullDisplayValue;
        if (this.props.value) {
            var valueMoment = moment(this.props.value);
            displayValue = this.props.format ? valueMoment.format(this.props.format) : valueMoment.fromNow();
        }

        return <span>{displayValue}</span>;
    }
}

Timestamp.propTypes = {
    value: React.PropTypes.string,
    format: React.PropTypes.string,
    nullDisplayValue: React.PropTypes.any
};

Timestamp.defaultProps = {
    nullDisplayValue: ""
};

export default Timestamp
