import React, { useState } from 'react';

import './styles.css';

const size = 6;

export default function SevenLine() {
    const [board, setBoard] = useState(newBoard);
    const [invalidMove, setInvalidMove] = useState(false);

    function reset() {
        setBoard(newBoard);
        setInvalidMove(false);
    }

    function possibleMoveDestination(piece) {
        // blank space doesn't move
        if (piece.direction === 0) {
            return -1;
        }
        // simple move
        let newPosition = piece.position + piece.direction;
        if (newPosition >= 0 && newPosition <= size) {
            if (board[newPosition].direction === 0) {
                return newPosition;
            }
        }
        // move over distinct symbol
        const pieceUnderMove = piece.position + piece.direction;
        newPosition = pieceUnderMove + piece.direction;
        if (
            newPosition >= 0 &&
            newPosition <= size &&
            board[pieceUnderMove].symbol !== piece.symbol &&
            board[newPosition].direction === 0
        ) {
            return newPosition;
        }
        return -1;
    }

    function move(piece) {
        const destination = possibleMoveDestination(piece);
        if (destination < 0) {
            setInvalidMove(true);
            return;
        } else if (invalidMove) {
            setInvalidMove(false);
        }

        setBoard(
            board
                .map(item => {
                    if (item.position === piece.position) {
                        return { ...item, position: destination };
                    }
                    if (item.position === destination) {
                        return { ...item, position: piece.position };
                    }
                    return item;
                })
                .sort((a, b) => a.position - b.position)
        );
    }

    function isVictory() {
        const youWin = board.reduce((acc, cur, curIndex) => {
            if (acc === false) return false;
            return cur.symbol === victory[curIndex].symbol;
        }, true);

        if (youWin) {
            return true;
        }

        return false;
    }
    function isGameOver() {
        const noPossibleMove = board.reduce((acc, cur) => {
            if (acc === false) return false;
            const posDes = possibleMoveDestination(cur);
            return posDes === -1;
        }, true);

        if (noPossibleMove) {
            return true;
        }

        return false;
    }

    return (
        <div className="game-container">
            <div className="content">
                <h1>Resolva o Puzzle</h1>
                <p>
                    Mova todas as peças azuis para a direita e todas as peças
                    vermelhas para a esquerda.
                </p>

                <div className="alert">
                    {invalidMove ? 'Peça sem movimento possível' : ''}
                    {isVictory()
                        ? 'Parabéns! Você conseguiu.'
                        : isGameOver()
                        ? 'Game Over!'
                        : ''}
                </div>

                <div className="board">
                    {board.map(piece => (
                        <div className="board-space" key={piece.position}>
                            <button
                                onClick={() => move(piece)}
                                className={
                                    piece.symbol === '>>'
                                        ? 'right'
                                        : piece.symbol === '<<'
                                        ? 'left'
                                        : ''
                                }
                            >
                                {piece.symbol}
                            </button>
                        </div>
                    ))}
                </div>

                <button onClick={reset} className="button">
                    Reiniciar
                </button>

                <h1>Regras:</h1>
                <ul className="left">
                    <li>Peças azuis só andam para a direita.</li>
                    <li>Peças vermelhas só andam para a esquerda.</li>
                    <li>
                        Peças só andam para casa vazia, podendo estar ao lado ou
                        após uma única peça obrigatoriamente de cor oposta.
                    </li>
                </ul>
            </div>
        </div>
    );
}

let newBoard = [];
for (let i = 0; i <= size; i++) {
    if (i === size / 2) {
        newBoard.push({
            symbol: ' ',
            direction: 0,
            position: i
        });
    } else {
        newBoard.push({
            symbol: i <= size / 2 ? '>>' : '<<',
            direction: i <= size / 2 ? 1 : -1,
            position: i
        });
    }
}

const victory = newBoard
    .map(item => ({ ...item, position: size - item.position }))
    .sort((a, b) => a.position - b.position);
