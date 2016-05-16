import classnames from 'classnames'
import Formsy from 'formsy-react'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import translate from '../../../functions/translate'
import Checkbox from '../../../components/form/Checkbox'
import CollapsibleSection from '../../../components/CollapsibleSection'
import TextInput from '../../../components/form/TextInput'

import { patchSettings } from '../../../actions/SystemSettingsActions'

class RegistrationSettings extends Component {

    submitForm(model) {
        this.props.patchSettings(model);
    }

    onFormChange(currentValues, isChanged) {

    }

    render() {
        return (
            <CollapsibleSection label={translate('user-registration-settings')}
                                icon="users"
                                description={translate('user-registration-settings.description')}>
                <Formsy.Form onSubmit={this.submitForm.bind(this)} onChange={this.onFormChange.bind(this)}>
                <div className="form-row">
                    <Checkbox id="allowRegistrationCheckbox"
                              name="allowRegistration"
                              label={translate('system-settings.allow-registration')}
                              value={this.props.settings.allowRegistration} />

                    <Checkbox id="requireEmailConfirmationCheckbox"
                              name="requireEmailConfirmation"
                              label={translate('system-settings.require-email-confirmation')}
                              value={this.props.settings.requireEmailConfirmation} />

                    <Checkbox id="restrictRegistrationDomainsCheckbox"
                              name="restrictRegistrationDomains"
                              label={translate('system-settings.restrict-registration-domains')}
                              value={this.props.settings.restrictRegistrationDomains} />

                    {this.renderDomainNameInputs()}
                </div>
                <div className="row">
                    <input className="btn btn-primary" type="submit" defaultValue={translate('save-setting')} />
                </div>
                </Formsy.Form>
            </CollapsibleSection>
        );
    }

    renderDomainNameInputs() {
        var domainNameInputs = null;

        if (this.props.settings.allowedDomains) {
            var domainCounter = 0;
            domainNameInputs = this.props.settings.allowedDomains.map(function(domain) {
                return (
                    <div className="form-row" key={'domainName-' + domainCounter}>
                        <TextInput name={'allowedDomains[' + (domainCounter++) + ']'} value={domain} />
                    </div>
                );
            });
        }

        var classes = classnames({
            "form-group" : true,
            "hidden": !this.props.settings.restrictRegistrationDomains
        });

        return (
            <div className={classes}>
                {domainNameInputs}
            </div>
        );

    }
}

RegistrationSettings.propTypes = {
    settings: PropTypes.object,
    patchSettings: PropTypes.func.isRequired
};

RegistrationSettings.defaultProps = {
    settings: { }
};

export default RegistrationSettings
