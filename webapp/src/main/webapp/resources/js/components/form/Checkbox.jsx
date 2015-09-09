var React = require('react');
var Formsy = require('formsy-react');

var Checkbox = React.createClass({
    mixins: [Formsy.Mixin],

    changeValue: function changeValue(event) {
        var target = event.currentTarget;
        this.setValue(target.checked);
        //this.props.onChange(this.props.name, target.checked);
    },

    render: function() {
        return (
            <div className="checkbox">
                <input type="checkbox" onChange={this.changeValue} defaultChecked={this.props.value} name={this.props.name}  />
                <label>{this.props.label}</label>
            </div>
        );
    }
});

module.exports = Checkbox;
