import _ from 'lodash'
import $ from 'jquery'
import classNames from 'classnames'
import AnimatedGroup from '../AnimatedGroup'
import Formsy from 'formsy-react'
import React, { Component, PropTypes } from "react"
import { HOC } from 'formsy-react'

import InlineTextIconButton from './InlineTextIconButton'
import getSelectedText from '../../functions/getSelectedText'

class _InlineTextInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            submittedValue: null,
            canSubmit: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.saving && !nextProps.saving) {
            this.setState({showingSaveSuccess: true, submittedValue: null}, function() {
                if (this.props.saveSuccessDisplayTimeout == 0) {
                    return;
                }
                setTimeout(function() {
                    this.setState({showingSaveSuccess: false});
                }.bind(this), this.props.saveSuccessDisplayTimeout);
            }.bind(this));
        }

        if (!this.props.error && nextProps.error) {
            this.setState({
                editing: true
            });
        }
    }

    enableButton () {
        this.setState({
            canSubmit: true
        });
    }

    disableButton () {
        this.setState({
            canSubmit: false
        });
    }

    changeValue(event) {
        this.props.setValue(event.currentTarget.value);
    }

    onClickHandler(event) {
        var selectedText = getSelectedText();
        if (!_.isEmpty(selectedText)) {
            return;
        }
        this.setState({
            editing: true
        });
    }

    onMouseEnter () {
        this.setState({
            hover: true
        });
    }

    onMouseLeave () {
        this.setState({
            hover: false
        });
    }

    onKeyDown(event) {
        if (event.keyCode == 13) {
            this.submitValue();
        }
        if (event.keyCode == 27) {
            this.abortEdit();
        }
    }

    submitValue() {
        if (!this.props.canSubmit) {
            return;
        }

        this.setState({
            editing: false,
            submittedValue: this.props.getValue(),
            hover: false
        }, this.props.onSubmit.bind(null, this.props.getValue(), this.props.name));
    }

    abortEdit() {
        this.props.resetValue();
        this.setState({
            editing: false,
            submittedValue: null,
            hover: false
        });
        if (this.props.onAbort) {
            this.props.onAbort();
        }
    }

    isMobile() {
        return false;
    }

    render() {
        var displayValue = this.state.submittedValue || this.props.value;

        if (this.props.disabled) {
            return <div>{displayValue}</div>;
        }

        var inputClasses = classNames('form-control',
            this.props.inputClassName);
        var textComponentClasses = classNames({
            'inline-text-input-hover': this.state.hover,
            'inline-text-input': !this.state.hover
        });

        var mobileEditCue = null;
        var savingCue = null;
        var saveSuccessCue = null;
        var errorCue = null;

        if (this.props.error && this.state.editing) {
            errorCue = <i className="fa fa-warning fa-fw"></i>;
        } else if (this.props.saving) {
            savingCue = <i className="fa fa-spinner fa-spin fa-fw"></i>;
        } else if (this.state.showingSaveSuccess) {
            saveSuccessCue = <i className="animated fa fa-check-circle fa-fw"></i>;
        } else {
            mobileEditCue = this.isMobile() && !this.state.hover ? <small><i className="fa fa-pencil fa-fw"></i></small> : null;
        }

        var textComponent = (
            <div className={textComponentClasses}>
                {displayValue || this.props.placeholder}
                {mobileEditCue}
                {savingCue}
                {errorCue}
                <AnimatedGroup inEffect="flipInX">
                    {saveSuccessCue}
                </AnimatedGroup>
            </div>
        );

        if (this.state.editing) {

            textComponent = (<input type="text"
                                    className={inputClasses}
                                    onChange={this.changeValue.bind(this)}
                                    defaultValue={displayValue}
                                    onBlur={this.submitValue.bind(this)}
                                    onKeyDown={this.onKeyDown.bind(this)}
                                    name={this.props.name}
                                    autoFocus={true} />
            );
        }

        var pencilIcon =  <InlineTextIconButton icon="fa-pencil" transparent={true} />;
        var commitIcon = null;
        var abortIcon = null;

        if (this.state.hover && !this.state.editing) {
            pencilIcon = <InlineTextIconButton icon="fa-pencil" />;
        }

        if (this.state.editing) {
            commitIcon = <InlineTextIconButton icon="fa-check" enabled={this.props.canSubmit} />;
            abortIcon = <InlineTextIconButton icon="fa-close" onClick={this.abortEdit} />;
            pencilIcon = null;
        }

        var errorComponent = null;
        if (this.isFormInError() || (this.props.error && this.state.editing)) {
            errorComponent = <span className="small help-block">{this.props.error || this.props.validationError}</span>;
        }

        //TODO: Correctly implement alt text on hover

        var formGroupClasses = classNames('form-group', {"has-error": this.isFormInError()});
        var inputGroupClasses = classNames('input-group', {"has-error": this.isFormInError()});
        return (
            <div className={formGroupClasses}>
                <div className={inputGroupClasses}
                     alt={this.props.altText}
                     onClick={this.onClickHandler.bind(this)}
                     onMouseEnter={this.onMouseEnter.bind(this)}
                     onMouseLeave={this.onMouseLeave.bind(this)}>
                    {textComponent}
                    {pencilIcon}
                    {commitIcon}
                    {abortIcon}
                </div>
                <div className="input-group has-error">
                    {errorComponent}
                </div>
            </div>

        );
    }

    isFormInError() {
        return this.state.editing && !this.props.canSubmit;
    }
}

_InlineTextInput.defaultProps = {
    saveSuccessDisplayTimeout: 1250,
    altText: $.i18n.prop('click-to-edit'),
    placeholder: $.i18n.prop('add-text')
};

let HOCComponent = HOC(_InlineTextInput);

class InlineTextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canSubmit: false
        }
    }

    submitValue() {
        if (!this.state.canSubmit) {
            return;
        }

        const submittedValue = this.textInput.getValue();

        this.setState({
            submittedValue
        }, this.props.onSubmit.bind(null, this.textInput.getValue(), this.props.name));
    }

    enableButton() {
        this.textInput.enableButton();
    }

    disableButton() {
        this.textInput.disableButton();
    }

    setValid() {
        this.setState({
            canSubmit: true
        });
    }

    setInvalid() {
        this.setState({
            canSubmit: false
        });
    }

    render() {
        return (
            <Formsy.Form onValidSubmit={this.submitValue.bind(this)} onValid={this.setValid.bind(this)} onInvalid={this.setInvalid.bind(this)}>
                <HOCComponent canSubmit={this.state.canSubmit} {...this.props} ref={(c) => this.textInput = c} />
            </Formsy.Form>
        )
    }
}

InlineTextInput.propTypes = _InlineTextInput.propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
    altText: React.PropTypes.string,
    value: React.PropTypes.string,
    saving: React.PropTypes.bool,
    error: React.PropTypes.string,
    inputClasses: React.PropTypes.any,
    validations: React.PropTypes.string,
    saveSuccessDisplayTimeout: React.PropTypes.number,
    placeholder: React.PropTypes.any
};

export default InlineTextInput
