import React, { Component, PropTypes } from 'react'

import AnimatedGroup from './AnimatedGroup'
import Icon from './Icon'

class CollapsibleSection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: props.isInitiallyCollapsed
        }
    }

    openSection() {
        this.setState({
            isCollapsed: false
        });
    }

    closeSection() {
        this.setState({
            isCollapsed: true
        });
    }

    toggleSection() {
        var func = null;
        if (this.state.isCollapsed && this.props.onOpen) {
            func = this.props.onOpen;
        } else if (!this.state.isCollapsed && this.props.onClose) {
            func = this.props.onClose;
        }
        this.setState({
            isCollapsed: !this.state.isCollapsed
        }, func);
    }

    render() {
        var contents = this.state.isCollapsed ? null : <div className="animated">{this.props.children}</div>;
        var icon = this.props.icon ? <span><Icon type={this.props.icon} />&nbsp;</span> : null;

        return (
            <div>
                <div className="row">
                    <div className="col-xs-8">
                        <h3 className="collapsible-section-label" onClick={this.toggleSection.bind(this)}>
                            {icon}{this.props.label}&nbsp;
                            {this.renderCaret()}
                        </h3>
                    </div>
                    <div className="col-xs-4 text-right">
                        {this.renderButton()}
                    </div>
                </div>
                <p>{this.props.description}</p>
                {contents}
            </div>
        );
    }

    renderButton() {
        var button = null;
        if (this.props.mode == "button") {
            var buttonTextProp = this.state.isCollapsed ? 'expand' : 'close';
            button = (
                <button type="button" className="btn btn-info btn-sm" onClick={this.toggleSection.bind(this)}>
                    {$.i18n.prop(buttonTextProp)}
                </button>
            );
        }
        return button;
    }

    renderCaret() {
        var caret = null;
        if (this.props.mode == "caret") {
            var caretDirection = this.state.isCollapsed ? 'right' : 'down';
            caret = <i className={'fa fa-caret-' + caretDirection}></i>;
        }
        return caret;
    }
}

CollapsibleSection.propTypes = {
    label: React.PropTypes.string,
    icon: React.PropTypes.string,
    description: React.PropTypes.any,
    mode: React.PropTypes.string,
    initiallyOpen: React.PropTypes.string,
    onOpen: React.PropTypes.func,
    onClose: React.PropTypes.func
};

CollapsibleSection.defaultProps = {
    mode: "button",
    isInitiallyCollapsed: true
};

export default CollapsibleSection
