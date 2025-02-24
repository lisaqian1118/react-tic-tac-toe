
import './App.css'
import { useState } from 'react';

function Square({ value, onSquareClick }){
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({xIsNext, squares, onPlay}) {

    function handleClick(i) {
        if(squares[i] || calculateWinner(squares))
        {
            console.log("clicked {i}");
            return;
        }
        const nextSquares = squares.slice();
        if(xIsNext)
        {
            nextSquares[i] = "X";
        }
        else
        {
            nextSquares[i] = "O";
        }


        const row = Math.floor(i/3) + 1;
        const col = (i % 3) + 1;

        onPlay(nextSquares, {row, col});

    }

    const winner = calculateWinner(squares);
    let status;

    if (winner) {
        status = 'Winner: ' + winner;
    } else
    {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    const grid = [];
    for ( let i = 0; i < 3; i++){
        const row = [];
        for(let j = 0; j < 3; j++) {
            row.push(
                <Square value={squares[i*3 + j]} onSquareClick={() => handleClick(i*3 + j)}/>
            );
        }

        grid.push(<div className="board-row"> {row} </div>);
    }



    return (
        <>
            <div className="status">{status}</div>
            {grid}
        </>
    )
        ;
}


export default function App() {
    const [history, setHistory] = useState([{squares:Array(9).fill(null), move: null}]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove].squares;
    const [isReversed, setIsReversed] = useState(false);

    function handlePlay(nextSquares, move){
        const nextHistory = [...history.slice(0, currentMove + 1), {squares:nextSquares, move:move}];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }
    function jumpTo(nextMove) {
        // TODO
        setCurrentMove(nextMove);
    }

    function toggleOrder() {
        setIsReversed(!isReversed);
    }

    const moves = history.map((step, move) => {
        let description;
        const { row, col} = step.move || {}
        if (move > 0) {
            description = `Go to move #${move} (Row: ${row}, Col: ${col});`
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>

        );
    });

    if(isReversed)
    {
        moves.reverse();
    }



    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="game-info">
                <button onClick={toggleOrder}>
                    {isReversed ? "Show Moves in Ascending Order" : "Show Moves in Descending Order"}
                </button>
                <ol>{moves}</ol>
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
            return squares[a];
        }
    }
    return null;
}



