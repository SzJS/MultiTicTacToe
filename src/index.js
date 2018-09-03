import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateBoardWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        name: squares[a],
        squares: [a, b, c],
        tie: false
      };
    }
  }
  return null;
}

function isBoardOver(squares) {
  if (calculateBoardWinner(squares)) {
    return true;
  }
  return !squares.includes(null);
}

function calculateGameLoser(boards, latestBoard) {
  if (isBoardOver(boards.first)
   && isBoardOver(boards.second)
   && isBoardOver(boards.third)
   && latestBoard){
    const loser = calculateBoardWinner(boards[latestBoard]);
    if (loser) {
      return loser;
    }
    return {
      name: null,
      squares: null,
      tie: true
    };
  }
  return null;
}

function Square(props) {
  const winnerClass = props.winner ? "square winner" : "square";
  return (
    <button className={winnerClass} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winner = calculateBoardWinner(this.props.squares);
    let isWinner = false;
    if (winner){
      const squares = winner.squares;
      isWinner = squares.includes(i);
    }

    return (
      <Square
        value={this.props.squares[i]}
        winner={isWinner}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      boards: {
        first: Array(9).fill(null),
        second: Array(9).fill(null),
        third: Array(9).fill(null),
      },
      history: [],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(board, square) {
    const squares = this.state.boards[board].slice();
    if (calculateBoardWinner(squares) || squares[square]) {
      return;
    }
    squares[square] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      boards: Object.assign({}, this.state.boards, {[board]: squares}),
      history: this.state.history.concat([{board: board, square: square}]),
      stepNumber: this.state.stepNumber + 1,
      xIsNext: !this.state.xIsNext,
    });
  }

  undo() {
    if (this.state.stepNumber === 0) {
      return;
    }

    const previous = this.state.history[this.state.history.length - 1]
    const board = previous.board;
    const square = previous.square;
    let squares = this.state.boards[board].slice();
    squares[square] = null;

    this.setState({
      boards: Object.assign({}, this.state.boards, {[board]: squares}),
      history: this.state.history.slice(0, this.state.history.length - 1),
      stepNumber: this.state.stepNumber - 1,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const latestMove = this.state.history[this.state.history.length - 1];
    let latestBoard;
    if (latestMove) {
      latestBoard = latestMove.board;
    }
    const winner = calculateGameLoser(this.state.boards, latestBoard);
    let status;
    if (winner && !winner.tie) {
      status = "The loser is " + (winner.name);
    } else if (winner && winner.tie) {
      status = "It's a tie.";
    } else {
      status = "";
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.boards.first}
            onClick={(i) => this.handleClick("first", i)}
          />
        </div>
        <br />
        <div className="game-board">
          <Board
            squares={this.state.boards.second}
            onClick={(i) => this.handleClick("second", i)}
          />
        </div>
        <br />
        <div className="game-board">
          <Board
            squares={this.state.boards.third}
            onClick={(i) => this.handleClick("third", i)}
          />
        </div>
        <br />
        <div className="game-info">
          <button onClick={() => this.undo()}>undo</button>
          <div>{ status }</div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
