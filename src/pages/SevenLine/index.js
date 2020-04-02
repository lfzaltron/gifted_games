import React, { useState, useEffect } from 'react';

import './styles.css';

export default function SevenLine() {
    const [board, setBoard] = useState([]);
    const [invalidMove, setInvalidMove] = useState(false);
    const [size, setSize] = useState(6);

    useEffect(reset, [size]);

    function reset() {
        const newBoard = createNewBoard();

        setBoard(newBoard);
        setInvalidMove(false);
    }

    function createNewBoard() {
        const newBoard = [];
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
        return newBoard;
    }

    function changeBoardSize(event) {
        setSize(event.target.value);
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
        const victory = createNewBoard()
            .map(item => ({ ...item, position: size - item.position }))
            .sort((a, b) => a.position - b.position);
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
                                className={`piece ${
                                    piece.symbol === '>>'
                                        ? 'right'
                                        : piece.symbol === '<<'
                                        ? 'left'
                                        : ''
                                }`}
                            >
                                {piece.symbol}
                            </button>
                        </div>
                    ))}
                </div>

                <label className="selectLabel">
                    Nível:{' '}
                    <select
                        onChange={changeBoardSize}
                        value={size}
                        className="select"
                    >
                        <option value={4}>Fácil</option>
                        <option value={6}>Médio</option>
                        <option value={8}>Difícil</option>
                    </select>
                </label>

                <button onClick={reset} className="button">
                    Reiniciar
                </button>

                <h1>Regras:</h1>
                <ul className="left">
                    <li>Peças azuis só andam para a direita.</li>
                    <li>Peças vermelhas só andam para a esquerda.</li>
                    <li>
                        As peças só andam para a casa vazia, podendo estar ao
                        lado ou após uma única peça obrigatoriamente de cor
                        oposta.
                    </li>
                </ul>

                <h2 className="credits-title">Créditos:</h2>
                <div className="credits-container">
                    <div>
                        Jogo:{' '}
                        <a href="https://www.instagram.com/professorcaloi/">
                            Professor Caloi.
                        </a>
                    </div>

                    <div>
                        Desenvolvedor:{' '}
                        <a href="https://www.instagram.com/lfzaltron/">
                            {' '}
                            Luís F. Zaltron.
                        </a>
                    </div>

                    <div>
                        Código:{' '}
                        <a href="https://github.com/lfzaltron/gifted_games">
                            GitHub.
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
