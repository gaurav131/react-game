import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
          {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={()=>this.props.onClick(i)}/>;
  }

  render() {
        let boardSquares = [];
        for(let row = 0; row < 3; row++){
            let boardRow = [];
            for(let col = 0; col < 3; col++){
                boardRow.push(<span key={(row * 3) + col}>{this.renderSquare((row * 3) + col)}</span>);
            }
            boardSquares.push(<div className="board-row" key={row}>{boardRow}</div>);
        }
        return (
          <div>
              {boardSquares}
          </div>
        );
  }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    moveMade: null
                }
            ],
            xIsNext: false,
            stepNumber: 0,
        };
    }
    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step%2)===0,
        })
    }
    handleCLick(i){
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length-1]
        const squares = current.squares.slice()
        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext? 'X':'O'
        this.setState({
            history: history.concat({
                squares: squares,
                moveMade: i
            }),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        })
    }
  render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        const moves = history.map((value, idx)=>{
            const moveMade = value.moveMade
            let row, column;
            if (moveMade<3){
                row = 1;
                column = moveMade+1
            }
            else if (moveMade<6){
                row = 2;
                column = moveMade+1-3
            }
            else {
                row = 3;
                column = moveMade+1-6
            }
            let desc = idx? `Go to Move #${idx} at row: ${row} column: ${column}`:'Go to game start';
            if (value.squares === current.squares){
                desc = <strong>{desc}</strong>
            }
            return (
                <li key={idx}>
                  <button onClick={()=> this.jumpTo(idx)}>{desc}</button>
                </li>
            )
        });
        let status;
        if (winner){
          status = `Winner is ${winner}`
        }
        else {
          status = `Next player: ${this.state.xIsNext?'X':'O'}`;
        }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i=>this.handleCLick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================
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
  for (let i of lines) {
    const [a, b, c] = i;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
