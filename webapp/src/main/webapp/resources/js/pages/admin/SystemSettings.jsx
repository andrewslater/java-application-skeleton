import $ from 'jquery'
import React, { Component, PropTypes } from 'react'
import Fluxxor from 'fluxxor'
import Formsy from 'formsy-react'
import FormData from 'form-data-to-object'
import classnames from 'classnames'

import Spinner from '../../components/Spinner'
import Checkbox from '../../components/form/Checkbox'
import TextInput from '../../components/form/TextInput'


var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

module.exports = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("SystemSettingsStore")],

    componentDidMount: function() {
        this.loadSettings();
    },

    loadSettings: function() {
        this.getFlux().actions.admin.settings.loadSettings();
    },

    getStateFromFlux: function() {
        var store = this.getFlux().store("SystemSettingsStore");
        return {
            loading: store.loading,
            loadError: store.loadError,
            settings: store.settings
        };
    },

    mapInputs: function(inputs) {
        // TODO: Next version of Formsy should do this automatically; Remove when upgraded
        return FormData.toObj(inputs);
    },

    submitForm: function(model) {
        this.getFlux().actions.admin.settings.saveSettings(model);
    },

    onFormChange: function(currentValues, isChanged) {
        this.setState({settings: this.mapInputs(currentValues)});
    },

    render: function() {

        if (this.state.loading || this.state.loading === null) {
            return <Spinner />;
        }

        if (this.state.loadError) {
            return this.renderErrorMessage();
        }

        return (
        <div id="container">
            <Formsy.Form onSubmit={this.submitForm} onChange={this.onFormChange} mapping={this.mapInputs}>
                <legend>{$.i18n.prop('system-settings')}</legend>

                <Checkbox id="allowRegistrationCheckbox"
                          name="allowRegistration"
                          label={$.i18n.prop('system-settings.allow-registration')}
                          value={this.state.settings.allowRegistration} />

                <Checkbox id="requireEmailConfirmationCheckbox"
                          name="requireEmailConfirmation"
                          label={$.i18n.prop('system-settings.require-email-confirmation')}
                          value={this.state.settings.requireEmailConfirmation} />

                <Checkbox id="restrictRegistrationDomainsCheckbox"
                          name="restrictRegistrationDomains"
                          label={$.i18n.prop('system-settings.restrict-registration-domains')}
                          value={this.state.settings.restrictRegistrationDomains} />

                {this.renderDomainNameInputs()}

                <div className="row">
                    <input className="btn btn-primary" type="submit" defaultValue={$.i18n.prop('save-settings')} />
                </div>
            </Formsy.Form>
        </div>
        );
    },

    renderDomainNameInputs: function() {
        var domainNameInputs = null;

        if (this.state.settings.allowedDomains) {
            var domainCounter = 0;
            domainNameInputs = this.state.settings.allowedDomains.map(function(domain) {
                return (
                    <div className="form-row" key={'domainName-' + domainCounter}>
                        <TextInput name={'allowedDomains[' + (domainCounter++) + ']'} value={domain} />
                    </div>
                );
            });
        }

        var classes = classnames({
            "form-group" : true,
            "hidden": !this.state.settings.restrictRegistrationDomains
        });

        return (
            <div className={classes}>
                {domainNameInputs}
            </div>
        );

    },

    renderErrorMessage: function() {
        return (
            <div className="alert alert-danger" role="alert">
                <span className="glyphicon glyphicon-exclamation-sign gi-3x" aria-hidden="true"></span>
                {this.state.loadError.message}
                <a href="#" onClick={this.loadSettings} className="alert-link">{$.i18n.prop('retry')}</a>
            </div>
        );
    }
});
