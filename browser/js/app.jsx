/** @jsx React.DOM */

var React = require('react');
var Cell = require('./cell.jsx');
var _ = require('underscore');

var WIDTH = 100;
var HEIGHT = 100;

var MAX_ITERATIONS = 9999;

var TICK_LENGTH = 100;

var App = React.createClass({
	getInitialState: function() {
		return {
			board: this.props.board
		}
	},

	render: function () {
		var cells = this.state.board.map(function(isAlive) {
			return <Cell alive={isAlive}/>
		});

		return (
			<div className="app">
				{cells}
			</div>);
	},

	componentDidMount: function() {
		this.iterations = 0;
		this.start();
		var self = this;

		window.addEventListener('keyup', function(e) {
			console.log(e.keyCode);
			if (e.keyCode !== 32) return;
			if (self.interval) self.stop();
			else self.start();
		});
	},

	tick: function() {
		var prevState = this.state.board;
		var newState = _.clone(prevState);
		var self = this;
		var d = new Date();

		var prevRow = undefined;
		_(prevState).each(function(isAlive, index) {
			var row = Math.floor(index / WIDTH);
			var offset = index % WIDTH;

			if (prevRow != row) {
				prevRow = row;
				prevRowOffset = index-offset;
				nextRowOffset = index+(WIDTH-offset);
			}
			
			var neighbours = 0;

			// above to the left
			if (row > 0 && offset > 0 && prevState[(row-1)*WIDTH + offset-1]) neighbours++;
			// above
			if (row > 0 && prevState[(row-1)*WIDTH + offset]) neighbours++;
			// above to the right
			if (row > 0 && offset < WIDTH-1 && prevState[(row-1)*WIDTH + offset+1]) neighbours++;
			// left
			if (index > 0 && prevState[index-1]) neighbours++;
			// right
			if (index < prevState.length && prevState[index+1]) neighbours++;
			// below to the left
			if (row < HEIGHT-1 && offset > 0 && prevState[(row+1)*WIDTH + offset-1]) neighbours++;
			// below
			if (row < HEIGHT-1 && prevState[(row+1)*WIDTH + offset]) neighbours++;
			// below to the right
			if (row < HEIGHT-1 && offset < WIDTH-1 && prevState[(row+1)*WIDTH + offset+1]) neighbours++;

			if (isAlive && (neighbours === 2 || neighbours === 3)) newState[index] = true;
			else newState[index] = false;
			if (!isAlive && neighbours === 3) newState[index] = true;
		});

		this.setState({ board: newState });
		var elapsed = (new Date()) - d;
		if (this.iterations % 10 === 0) console.log('Time used for all nodes: ', elapsed);

		this.iterations++;
		if (this.iterations > MAX_ITERATIONS) this.stop();
		if (!_.any(newState)) this.stop();
	},
	start: function() {
		this.interval = setInterval(this.tick, TICK_LENGTH);
	},
	stop: function() {
		clearInterval(this.interval);
		this.interval = undefined;
	}
});

var startState = [];

_(WIDTH*HEIGHT).times(function(index) {
	startState[index] = Math.random() > 0.5;
});

React.renderComponent(<App board={startState} />, document.body);