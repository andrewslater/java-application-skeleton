import _ from 'lodash'
import classNames from 'classnames'
import { HOC } from 'formsy-react';
import React, { Component, PropTypes } from 'react'

import AnimatedGroup from '../AnimatedGroup'
import FormGroup from './FormGroup'
import Icon from '../Icon'

class _TextInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showingSaveSuccess: false
        };
    }
    render() {
        let inputId = this.props.id ? this.props.id : this.props.name;
        let classes = classNames("form-control", {
            "input-lg": this.props.size == 'large',
            "input-md": this.props.size == 'medium'
        });
        let groupClasses = classNames("has-feedback", {
            "has-error": !this.props.isValid()
        });

        let promptCue = this.getPromptIcon();
        let savingCue = this.props.isSaving ? <i className="fa fa-spinner fa-spin fa-fw"></i> : null;
        let saveSuccessCue = this.state.showingSaveSuccess ? <i className="animated fa fa-check-circle fa-fw"></i> : null;
        let errorCue = null;
        let errorMessage = null;
        let animatedGroup = this.props.isValid() ? <AnimatedGroup enabled={this.props.isValid()} inEffect="flipInX">{saveSuccessCue}</AnimatedGroup> : null;

        if (!this.props.isValid()) {
            savingCue = null;
            saveSuccessCue = null;
            promptCue = null;
            errorCue = <span className="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>;
            errorMessage = <small className="help-block">{this.getErrorMessage()}</small>;
        }

        var input = (
            <FormGroup label={this.props.label} labelFor={inputId} className={groupClasses}>
                <input type="text"
                       ref={(c) => this.htmlInput = c}
                       disabled={this.props.isSaving}
                       id={inputId}
                       className={classes}
                       onChange={this.changeValue.bind(this)}
                       value={this.props.getValue()} {...this.props} />
                {errorCue}
                <span className="form-control-feedback">
                    {promptCue}
                    {savingCue}
                    {animatedGroup}
                </span>
                {errorMessage}
            </FormGroup>
        );

        return input;
    }

    focus() {
        if (this.htmlInput) {
            this.htmlInput.focus();
        }
    }

    changeValue(event) {
        var value = event.currentTarget.value;
        this.props.setValue(value);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isSaving && !nextProps.isSaving) {
            this.setState({showingSaveSuccess: true, submittedValue: null}, function() {
                if (this.props.saveSuccessDisplayTimeout == 0) {
                    return;
                }
                setTimeout(function() {
                    this.setState({showingSaveSuccess: false});
                }.bind(this), this.props.saveSuccessDisplayTimeout);
            });
        }
    }

    getPromptIcon() {
        var icon = this.props.promptIcon;
        if (_.isString(icon)) {
            icon = <Icon type={this.props.promptIcon} />
        }
        return icon;
    }
}

_TextInput.defaultProps = {
    saveSuccessDisplayTimeout: 1250
};

let HOCComponent = HOC(_TextInput);

class TextInput extends Component {
    render() {
        let input = <HOCComponent ref={(c) => this.textInput = c} {...this.props} />;
        return <Formsy.Form autoComplete="off"
                            onSubmit={this.props.onSubmit}
                            validationErrors={this.props.validationErrors}>{input}</Formsy.Form>;
    }

    focus() {
        this.textInput.focus();
    }

    clear() {
        this.textInput.setValue("");
    }
}

TextInput.propTypes = _TextInput.propTypes = {
    size: PropTypes.string,
    isSaving: PropTypes.bool,
    onSubmit: PropTypes.func,
    promptIcon: PropTypes.any
};


export default TextInput

