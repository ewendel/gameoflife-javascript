/** @jsx React.DOM */

var React = require('react');

var Cell = React.createClass({
	render: function () {
		var classes = this.props.alive ? "cell alive" : "cell test";
		
		return (
			<div className={classes} onClick={this.toggle}>
			</div>);
	},
	toggle: function() {
		this.props.alive = !this.props.alive();
	}
});


module.exports = Cell;
