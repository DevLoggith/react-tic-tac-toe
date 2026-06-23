import { useState } from "react";

function Square({ className, value, onSquareClick }) {
	return (
		<button className={"square " + className} onClick={onSquareClick}>
			{value}
		</button>
	);
}

function Board({ xIsNext, squares, onPlay }) {
	function handleClick(i, coordinate) {
		if (calculateWinner(squares).winner || squares[i]) {
			return;
		}
		const nextSquares = squares.slice();

		if (xIsNext) {
			nextSquares[i] = "X";
		} else {
			nextSquares[i] = "O";
		}

		onPlay(nextSquares, coordinate);
	}

	const { winner, winningSquares } = calculateWinner(squares);
	let status;
	if (winner) {
		status = "Winner: " + winner;
	} else if (!squares.includes(null)) {
		status = "Cat's game";
	} else {
		status = "Next player: " + (xIsNext ? "X" : "O");
	}

	const boardRows = [];
	for (let i = 0; i < 3; i++) {
		boardRows.push(
			<div key={i} className="board-row">
				{squares.slice(i * 3, i * 3 + 3).map((square, index) => {
					const globalIndex = i * 3 + index;
					const coordinate = [i + 1, index + 1];
					return (
						<Square
							key={globalIndex}
							className={
								winningSquares && winningSquares.includes(globalIndex)
									? "winning-squares"
									: ""
							}
							value={squares[globalIndex]}
							onSquareClick={() => handleClick(globalIndex, coordinate)}
						/>
					);
				})}
			</div>,
		);
	}

	return (
		<>
			<div className="status">{status}</div>
			{boardRows}
		</>
	);
}

export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)]);
	const [coordinates, setCoordinates] = useState([null]);
	const [currentMove, setCurrentMove] = useState(0);
	const [isAscending, setIsAscending] = useState(true);
	const xIsNext = currentMove % 2 === 0;
	const currentSquares = history[currentMove];

	function handlePlay(nextSquares, coordinate) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
		const nextCoordinate = [...coordinates.slice(0, currentMove + 1), coordinate];

		setHistory(nextHistory);
		setCoordinates(nextCoordinate);
		setCurrentMove(nextHistory.length - 1);
	}

	function jumpTo(nextMove) {
		setCurrentMove(nextMove);
	}

	const moves = history.map((squares, move) => {
		let description;

		if (move === currentMove) {
			if (currentMove === 0) {
				description = "You are at game start";
			} else {
				description = `You are at move #${move} - (${coordinates.at(move)})`;
			}
		} else if (move > 0) {
			description = `Go to move #${move} - (${coordinates.at(move)})`;
		} else {
			description = "Go to game start";
		}
		return (
			<li key={move}>
				{move !== currentMove ? (
					<button onClick={() => jumpTo(move)}>{description}</button>
				) : (
					description
				)}
			</li>
		);
	});

	const sortButtonText = isAscending ? "Sort moves: Ascending" : "Sort moves: Descending";
	const sortedMoves = isAscending
		? moves.toSorted((a, b) => Number(a.key) - Number(b.key))
		: moves.toSorted((a, b) => Number(b.key) - Number(a.key));

	return (
		<div className="game">
			<div className="game-board">
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
			</div>
			<div className="game-info">
				<button onClick={() => setIsAscending(!isAscending)}>{sortButtonText}</button>
				<ul>{sortedMoves}</ul>
			</div>
		</div>
	);
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			const winner = squares[a];
			const winningSquares = lines[i];
			return { winner, winningSquares };
		}
	}

	return { winner: null, winningSquares: null };
}
