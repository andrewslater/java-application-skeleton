import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import app from '../../app'
import translate from '../../functions/translate'
import AwsSettings from './settings/AwsSettings'
import RegistrationSettings from './settings/RegistrationSettings'
import Spinner from '../../components/Spinner'

import { denormalize, Schemas } from '../../middleware/api'
import { loadSettings, patchSettings } from '../../actions/SystemSettingsActions'

class SystemSettings extends Component {

    constructor(props) {
        super(props);
        this.state = { };
    }

    componentDidMount() {
        this.props.loadSettings();
    }

    onFormChange(currentValues, isChanged) {
        if (isChanged !== true && isChanged !== false) {
            return;
        }

        this.setState({settings: currentValues});
    }

    render() {

        if (!this.props.settings) {
            return <Spinner />;
        }

        if (this.state.loadError) {
            return this.renderErrorMessage();
        }

        var sections = [
            <RegistrationSettings settings={this.props.settings} patchSettings={this.props.patchSettings} />,
            <AwsSettings settings={this.props.settings} patchSettings={this.props.patchSettings} />
        ];

        var formattedSections = [];
        _.forEach(sections, function(section, index) {
            formattedSections.push(<div key={'section-' + index}>{section}</div>);
            if (index < sections.length - 1) {
                formattedSections.push(<hr key={'hr-' + index} />);
            }
        });

        return (
            <div id="container">
                {formattedSections}
            </div>
        );
    }

    renderErrorMessage() {
        return (
            <div className="alert alert-danger" role="alert">
                <span className="glyphicon glyphicon-exclamation-sign gi-3x" aria-hidden="true"></span>
                {this.state.loadError.message}
                <a href="#" onClick={this.loadSettings} className="alert-link">{translate('retry')}</a>
            </div>
        );
    }
}

const mapStateToProps = (state) => {

    return {
        settings: denormalize(state, 'entities.systemSettings.1', Schemas.SYSTEM_SETTINGS)
    };
};

export default connect(mapStateToProps, {
    loadSettings,
    patchSettings
})(SystemSettings)

