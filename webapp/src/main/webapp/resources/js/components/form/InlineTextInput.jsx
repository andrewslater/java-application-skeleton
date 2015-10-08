var React = require('react');
var Formsy = require('formsy-react');

var TextInput = React.createClass({
    mixins: [Formsy.Mixin],

    getInitialState: function() {
        return {
            editing: false,
            submittedValue: null
        }
    },

    changeValue: function changeValue(event) {
        this.setValue(event.currentTarget.value);
    },

    onClickHandler: function(event) {
        this.setState({
            editing: true
        });
    },

    mouseOver: function () {
        this.setState({
            hover: true
        });
    },

    mouseOut: function () {
        this.setState({
            hover: false
        });
    },

    onKeyDown: function(event) {
        if (event.keyCode == 13) {
            this.submitValue();
        }
    },

    submitValue: function() {
        this.props.onSubmit(this.getValue());
        this.setState({
            editing: false,
            submittedValue: this.getValue()
        });
    },

    render: function() {
        var displayValue = this.state.submittedValue || this.props.value;

        if (this.state.editing) {
            return (
                <input type="text"
                       className="inline-text-input"
                       onChange={this.changeValue}
                       defaultValue={displayValue}
                       onBlur={this.submitValue}
                       onKeyDown={this.onKeyDown}
                       name={this.props.name}
                       autoFocus={true} />

            );
        }

        return <span className="inline-text-input" onClick={this.onClickHandler}>{displayValue}</span>;
    }
});

module.exports = TextInput;
