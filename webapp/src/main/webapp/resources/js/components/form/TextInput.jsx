var React = require('react');
var Formsy = require('formsy-react');

var TextInput = React.createClass({
    mixins: [Formsy.Mixin],

    changeValue: function changeValue(event) {
        var value = event.currentTarget.value;
        this.setValue(value);
    },

    render: function() {
        return (
            <input type="text" onChange={this.changeValue} defaultValue={this.props.value} name={this.props.name} />
        );
    }
});

module.exports = TextInput;
