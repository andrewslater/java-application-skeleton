import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Formsy from 'formsy-react'
import { Input } from 'formsy-react-components'

import translate from '../../../functions/translate'
import { patchSettings } from '../../../actions/SystemSettingsActions'
import CollapsibleSection from '../../../components/CollapsibleSection'
import Spinner from '../../../components/Spinner'

class AwsSettings extends Component {

    submitForm(model) {
        this.props.patchSettings(model);
    }

    render() {
        if (!this.props.settings) {
            return <Spinner />;
        }

        return (
            <CollapsibleSection label={translate('aws-settings')}
                                icon="cloud"
                                description={translate('aws-settings.description')}>
                <Formsy.Form onSubmit={this.submitForm.bind(this)}>
                <div className="form-row">
                    <Input
                        name="awsAccessKey"
                        id="awsAccessKey"
                        value={this.props.settings.awsAccessKey}
                        label={translate('aws-access-key')}
                        type="text"
                        placeholder=""
                        help="" />
                </div>
                <div className="form-row">
                    <Input
                        name="awsSecretAccessKey"
                        id="awsSecretAccessKey"
                        value={this.props.settings.awsSecretAccessKey}
                        label={translate('aws-secret-access-key')}
                        type="text"
                        placeholder=""
                        help="" />
                </div>
                <div className="row">
                    <input className="btn btn-primary" type="submit" defaultValue={translate('save-setting')} />
                </div>
                </Formsy.Form>
            </CollapsibleSection>
        );
    }
}

AwsSettings.propTypes = {
    settings: PropTypes.object,
    patchSettings: PropTypes.func.isRequired
};

export default AwsSettings
