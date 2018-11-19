import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
  // Square as a function component
  return (
    // onClick must be callback here
    <button className="square" onClick={ props.onClick }>
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
      key={i}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />
    )
  }
  renderBoard() {
    // for loops can't be used in react render
    const board = [];
    for (let i = 0; i < 3; i ++) {
      const row = [];
      for (let j = 0; j < 3; j ++) {
        row.push(this.renderSquare(i*3 + j));
      }
      
      board.push(
        <div className="board-row">{row}</div>
      );
    }
    return board;
  }
  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  // keep states history 
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    // determine history value on each click for the range defined by 0 and stepNumber
    const history = this.state.history.slice(0, this.state.stepNumber + 1);

    // take last element from history 
    const current = history[history.length - 1];

    // create a copy of last squares state from history 
    const squares = current.squares.slice();

    // check if winner or square has already been filled to disable click
    if ( calculateWinner(squares) || squares[i] ) {
      return;
    }

    // change value of copy of last squares state history element depending on xIsNext current value
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    

    // append changed copy to this.state.history 
    this.setState({
      history: history.concat([{
        squares: squares,
        i: i,
      }]),
      stepNumber: history.length,
      // swich between true - false on each click
      xIsNext: !this.state.xIsNext,
    });
  }
  
  jumpTo(step) {
    addActiveClass (step);
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render () {
    // determine history value on each render

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      // description of button
      const desc = move ? 
      `Go to move #${move} (row: ${Math.floor(step['i'] / 3)}, col: ${step['i'] % 3 })` : 
      `Go to game start`;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}
  // ========================================

ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);

function calculateWinner (squares) {
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
      return squares[a];
    }
    return null;
  }
}

function addActiveClass (step) {
  // Bold the currently selected item in the move list
  const moves = document.querySelectorAll('li');
  const active = document.querySelector('.active-one');
  if (active) {
    active.classList.remove('active-one');
  }
  moves[step].classList.add('active-one');
}