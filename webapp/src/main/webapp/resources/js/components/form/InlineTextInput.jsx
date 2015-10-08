var React = require('react');
var Formsy = require('formsy-react');

var TextInput = React.createClass({
    mixins: [Formsy.Mixin],

    getInitialState: function() {
        return {
            editing: false,
        }
    },

    changeValue: function changeValue(event) {
        var value = event.currentTarget.value;
        this.setValue(value);
    },

    onClickHandler: function(event) {
        this.setState({
            editing: true
        });
    },

    onBlurHandler: function(event) {
        this.props.onSubmit(this.getValue());
        this.setState({
            editing: false
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

    render: function() {
        if (this.state.editing) {
            return (
                <input type="text"
                       className="inline-text-input"
                       onChange={this.changeValue}
                       defaultValue={this.props.value}
                       onBlur={this.onBlurHandler}
                       name={this.props.name}
                       autoFocus={true} />

            );
        }

        return <span className="inline-text-input" onClick={this.onClickHandler}>{this.props.value}</span>;
    }
});

module.exports = TextInput;
