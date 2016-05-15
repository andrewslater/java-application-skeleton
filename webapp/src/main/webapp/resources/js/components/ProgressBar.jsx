import React, { Component, PropTypes } from 'react'

class ProgressBar extends Component {

    render() {
        if (!this.props.percentComplete) {
            return null;
        }

        var style = {
            width: this.props.percentComplete + '%'
        };

        return (
            <div className="progress">
                <div className="progress-bar"
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
    percentComplete: PropTypes.string
};

export default ProgressBar
