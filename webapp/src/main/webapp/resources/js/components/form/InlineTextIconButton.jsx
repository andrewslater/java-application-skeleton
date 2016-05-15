import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

class InlineTextIconButton extends Component {

    render() {
        var containerClasses = classNames(
            'input-group-addon',
            'inline-text-input-icon',
            {'disabled': this.props.disabled},
            {'transparent': this.props.transparent}
        );

        var iconClasses = classNames('fa', this.props.icon);
        // onMouseDown is used instead of onClick to ensure it fires before the text input's onBlur
        return (
            <span className={containerClasses} onMouseDown={this.props.onClick}>
                <i className={iconClasses}></i>
            </span>);
    }
}

InlineTextIconButton.proptypes = {
    icon: React.PropTypes.string,
    onClick: React.PropTypes.func,
    disabled: React.PropTypes.bool,
    transparent: React.PropTypes.bool
};

export default InlineTextIconButton
