import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import ControlLabel from './ControlLabel'

class FormGroup extends Component {
    render() {
        let classes = classNames("form-group", this.props.className);
        let label = this.props.label ? <ControlLabel value={this.props.label} htmlFor={this.props.labelFor} /> : null;
        return(
            <div className={classes}>
                {label}
                {this.props.children}
            </div>
        )
    }
}

FormGroup.propTypes = {
    label: PropTypes.string,
    labelFor: PropTypes.string
};

export default FormGroup
