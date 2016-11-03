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
			if (cell.xCoordinate === alteredCell.xCoordinate && cell.yCoordinate === alteredCell.yCoordinate) {
				return cell;
			} else {
				return false;
			}
		});
		cells[alteredCellIndex].alive = alteredCell.alive;
		const neighbors = this.neighborStatuses(alteredCell);
		console.log(neighbors);
		this.setState({cells: cells});
	}
	findNeighbor(x, y) {
		return this.state.cells.findIndex((neighbor) => (neighbor.xCoordinate === x && neighbor.yCoordinate === y) ? true : false);
	}
	bottomLeftNeighbors(cell) {
		const x = cell.xCoordinate;
		const y = cell.yCoordinate;
		const n1 = this.findNeighbor(x - 1 < 0 ? 27 : x - 1, y - 1 < 0 ? 19 : y - 1);
		const n2 = this.findNeighbor(x - 1 < 0 ? 27 : x - 1, y);
		const n3 = this.findNeighbor(x, y - 1 < 0 ? 19 : y - 1);

		return [n1, n2, n3];
	}
	topRightNeighbors(cell) {
		const x = cell.xCoordinate;
		const y = cell.yCoordinate;
		const n1 = this.findNeighbor(x + 1 > 27 ? 0 : x + 1, y + 1 > 19 ? 0 : y + 1);
		const n2 = this.findNeighbor(x + 1 > 27 ? 0 : x + 1, y);
		const n3 = this.findNeighbor(x, y + 1 > 19 ? 0 : y + 1);

		return [n1, n2, n3];
	}
	topLeftAndBottomRightNeighbors(cell) {
		const x = cell.xCoordinate;
		const y = cell.yCoordinate;
		const n1 = this.findNeighbor(x - 1 < 0 ? 27 : x - 1, y + 1 > 19 ? 0 : y + 1);
		const n2 = this.findNeighbor(x + 1 > 27 ? 0 : x + 1, y - 1 < 0 ? 19 : y - 1);
		
		return [n1, n2];
	}
	neighborStatuses(cell) {
		const cells = this.state.cells;
		let counter = 0;
		const neighbors = this.topRightNeighbors(cell).concat(this.bottomLeftNeighbors(cell)).concat(this.topLeftAndBottomRightNeighbors(cell));
		neighbors.forEach((cell,index,array) => {
			if (cells[cell].alive) {
				counter++;
			}
		});
		return counter;
	}
	generationCycle() {
		const cells = this.state.cells.map((cell,index,array) => {
			const number = this.neighborStatuses(cell);
			switch(number) {
				case 0 || 1:
					cell.alive = false;
				break;
				case ((2 || 3) && cell.alive):
					cell.alive = true;
				break;
				case 3:
					cell.alive = true;
				break;
				default:
					cell.alive = false;
			}
		});
		this.setState({cells : cells});

	}
	componentDidMount() {
		const cells = this.state.cells;
		const arr = Array(100).fill(1);
		const randomIndicies = arr.map((num) => num * Math.floor(Math.random() * 500));
		randomIndicies.forEach((value) => cells[value].alive = true);
		this.setState({cells: cells});

		this.generationCycle();
		this.generationCycle();

		// this.timerID = setInterval(
		// 	() => this.generationCycle(),
		// 	1000
		// );
	}

	componentWillUnmount() {
		clearInterval(this.timerID);
	}
	render() {
		return (
			<div className="container">
				<Board 
					cells={this.state.cells} 
					width={this.props.width} 
					height={this.props.height}
					onMutate={this.handleMutate.bind(this)} />
				<div className="controls">
					<ButtonControl name={'start'} onAction={this.componentDidMount.bind(this)} />
					<ButtonControl name={'pause'} onAction={this.handlePause} />
					<ButtonControl name={'clear'} onAction={this.componentWillUnmount.bind(this)} />
				</div>
			</div>
		)
	}
}

class ButtonControl extends React.Component {
	handleClick() {
		this.props.onAction();
	}
	render() {
		return (
			<button className="btn btn-lg btn-primary" onClick={this.handleClick.bind(this)} >
				{this.props.name}
			</button>
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


ReactDOM.render(<Game size={560} width={28} height={20} />, document.getElementById('app'));

