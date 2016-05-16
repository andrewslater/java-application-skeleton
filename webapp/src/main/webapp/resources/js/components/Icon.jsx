import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

class Icon extends Component {

    render() {
        var classes = classNames("fa", "fa-fw", "fa-"+this.props.type, this.props.className);
        return <i className={classes}></i>;
    }
}

Icon.propTypes = {
    type: PropTypes.string,
    className: PropTypes.string
};

export default Icon
