import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

class ProgressBar extends Component {

    render() {
        if (this.props.percentComplete == null) {
            return null;
        }

        var style = {
            width: this.props.percentComplete + '%'
        };

        var classes = classNames("progress",
            "progress-" + this.props.size,
            {"active": this.props.percentComplete == 100});

        return (
            <div className={classes} {...this.props}>
                <div className="progress-bar progress-bar-striped"
                     role="progressbar"
                     aria-valuenow={this.props.percentComplete}
                     aria-valuemin="0"
                     aria-valuemax="100"
                     style={style}>
                </div>
            </div>
        );
    }
}

ProgressBar.propTypes = {
    percentComplete: PropTypes.number,
    size: PropTypes.string
};

ProgressBar.defaultProps = {
    percentComplete: null,
    size: "medium"
};

export default ProgressBar
