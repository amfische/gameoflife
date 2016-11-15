import React from 'react';
import ReactDOM from 'react-dom';

class Game extends React.Component {
	constructor(props) {
		super(props);
		const cells = [];
		for (let i = this.props.height - 1; i >= 0; i--) {
			for (let j = 0; j < this.props.width; j++) {
				cells.push({
					xCoordinate: j,
					yCoordinate: i,
					alive: false
				});
			};
		};
		this.state = {cells: cells};
	}
	handleMutate(alteredCell) {
		const cells = this.state.cells;
		const alteredCellIndex = this.state.cells.findIndex(function(cell,index) {
			return (cell.xCoordinate === alteredCell.xCoordinate && cell.yCoordinate === alteredCell.yCoordinate);
		});
		cells[alteredCellIndex].alive = alteredCell.alive;
		this.setState({cells: cells});
	}
	findNeighbor(x, y) {
		return this.state.cells.findIndex((neighbor) => (neighbor.xCoordinate === x && neighbor.yCoordinate === y));
	}
	bottomLeftNeighbors(cell) {
		const x = cell.xCoordinate;
		const y = cell.yCoordinate;
		const n1 = this.findNeighbor(x - 1 < 0 ? 49 : x - 1, y - 1 < 0 ? 34 : y - 1);
		const n2 = this.findNeighbor(x - 1 < 0 ? 49 : x - 1, y);
		const n3 = this.findNeighbor(x, y - 1 < 0 ? 34 : y - 1);

		return [n1, n2, n3];
	}
	topRightNeighbors(cell) {
		const x = cell.xCoordinate;
		const y = cell.yCoordinate;
		const n1 = this.findNeighbor(x + 1 > 49 ? 0 : x + 1, y + 1 > 34 ? 0 : y + 1);
		const n2 = this.findNeighbor(x + 1 > 49 ? 0 : x + 1, y);
		const n3 = this.findNeighbor(x, y + 1 > 34 ? 0 : y + 1);

		return [n1, n2, n3];
	}
	topLeftAndBottomRightNeighbors(cell) {
		const x = cell.xCoordinate;
		const y = cell.yCoordinate;
		const n1 = this.findNeighbor(x - 1 < 0 ? 49 : x - 1, y + 1 > 34 ? 0 : y + 1);
		const n2 = this.findNeighbor(x + 1 > 49 ? 0 : x + 1, y - 1 < 0 ? 34 : y - 1);

		return [n1, n2];
	}
	neighborStatuses(cell) {
		const cells = this.state.cells;
		let counter = 0;
		const neighbors = this.topRightNeighbors(cell).concat(this.bottomLeftNeighbors(cell)).concat(this.topLeftAndBottomRightNeighbors(cell));
		neighbors.forEach((cellIndex) => {
			if (cells[cellIndex].alive) {
				counter++;
			}
		});
		return counter;
	}
	generationCycle() {
		const cells = this.state.cells.map(function(cell){
			let newCell = {
				xCoordinate : cell.xCoordinate,
				yCoordinate : cell.yCoordinate
			};
			switch(this.neighborStatuses(cell)) {
				case 0:
				case 1:
					newCell.alive = false;
					break;
				case 2:
					cell.alive ? newCell.alive = true : newCell.alive = false;
					break;
				case 3:
					newCell.alive = true;
					break;
				default:
					newCell.alive = false;
			}
			return newCell;
		}.bind(this));
		this.setState({cells : cells});
	}
	componentDidMount() {
		const cells = this.state.cells;
		const arr = Array(200).fill(1);
		const randomIndicies = arr.map((num) => num * Math.floor(Math.random() * 1750));
		randomIndicies.forEach((value) => cells[value].alive = true);
		this.setState({cells: cells});

		// this.timerID = setInterval(() => this.generationCycle(), 100);
	}
	componentWillUnmount() {
		clearInterval(this.timerID);
		const cells = this.state.cells.map(function(cell) {
			let newCell = {
				alive : false,
				xCoordinate : cell.xCoordinate,
				yCoordinate : cell.yCoordinate
			};
			return newCell;
		});
		this.setState({cells : cells});
		console.log('component unmounted');
	}
	handleStart() {
		this.timerID = setInterval(() => this.generationCycle(), 250);
	}
	handlePause() {
		clearInterval(this.timerID);
	}
	render() {
		return (
				<Board
					cells={this.state.cells}
					width={this.props.width}
					height={this.props.height}
					onMutate={this.handleMutate.bind(this)} />
		)
	}
}

class Board extends React.Component {
	render() {
		const cellNodes = this.props.cells.map(function(cell,i) {
			return (
				<Cell
					key={i}
					xCoordinate={cell.xCoordinate}
					yCoordinate={cell.yCoordinate}
					alive={cell.alive}
					mutate={this.props.onMutate} />
			)
		}.bind(this));
	    return (
	    	<div className="board">
	    		{cellNodes}
	    	</div>
	    )
  	}
}

class Cell extends React.Component {
	handleClick() {
		const alive = !this.props.alive;
		const x = this.props.xCoordinate;
		const y = this.props.yCoordinate;
		this.props.mutate({xCoordinate: x, yCoordinate: y, alive: alive });
	}
	render() {
		const cellStatus = this.props.alive
			? <div className="cell alive" onClick={this.handleClick.bind(this)} />
			: <div className="cell dead" onClick={this.handleClick.bind(this)} />
		return (cellStatus)
	}
}

function renderBoard() {
		ReactDOM.render(<Game size={1750} width={50} height={35} />, document.getElementById('board-container'));
}
ReactDOM.render(<Game size={1750} width={50} height={35} />, document.getElementById('board-container'));

const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const clearButton = document.getElementById('clear');

startButton.onclick = function() {
	console.log('start');
}

pauseButton.onclick = function() {
	console.log('pause');
}

clearButton.onclick = function() {
	console.log('clear');
}
