import React, { Component, PropTypes } from "react"
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class AnimatedGroup extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var inEffect = this.props.inEffect;
        var outEffect = !this.props.outEffect ? this.guessOutEffect(inEffect) : this.props.outEffect;

        return (
            <ReactCSSTransitionGroup transitionEnter={this.props.enabled}
                                     transitionLeave={this.props.enabled}
                                     transitionName={{enter: inEffect, leave: outEffect, appear: inEffect}}
                                     transitionEnterTimeout={this.getEnterDuration()}
                                     transitionLeaveTimeout={this.getLeaveDuration()}>
                {this.props.children}
            </ReactCSSTransitionGroup>
        )
    }

    getEnterDuration() {
        return this.props.enterDuration ? this.props.enterDuration : this.props.duration;
    }

    getLeaveDuration() {
        return this.props.leaveDuration ? this.props.leaveDuration : this.props.duration;
    }

    guessOutEffect(inEffect) {
        var outEffect = inEffect.replace("In", "Out");

        if (inEffect.indexOf("Down") !== -1) {
            outEffect = outEffect.replace("Down", "Up")
        } else {
            outEffect = outEffect.replace("Up", "Down");
        }

        if (inEffect.indexOf("Right") !== -1) {
            outEffect = outEffect.replace("Right", "Left");
        } else {
            outEffect = outEffect.replace("Left", "Right");
        }

        return outEffect;
    }
}

AnimatedGroup.defaultProps = {
    enabled: true,
    duration: 1000
};

AnimatedGroup.propTypes = {
    enabled: PropTypes.bool,
    inEffect: PropTypes.string.isRequired,
    outEffect: PropTypes.string,
    duration: PropTypes.number,
    enterDuration: PropTypes.number,
    leaveDuration: PropTypes.number
};

export default AnimatedGroup
