import React, { useState, useEffect } from 'react';

import './styles.css';

const size = 6;

export default function SevenLine() {
    const [board, setBoard] = useState([]);

    useEffect(() => {
        setBoard(newBoard);
    }, []);

    function possibleMoveDestination(piece, arr = board) {
        // blank space doesn't move
        if (piece.direction === 0) {
            return -1;
        }

        // simple move
        let newPosition = piece.position + piece.direction;
        if (newPosition >= 0 && newPosition <= size) {
            if (arr[newPosition].direction === 0) {
                return newPosition;
            }
        }

        // move over distinct symbol
        const pieceUnderMove = piece.position + piece.direction;
        newPosition = pieceUnderMove + piece.direction;
        if (
            newPosition >= 0 &&
            newPosition <= size &&
            arr[pieceUnderMove].symbol !== piece.symbol &&
            arr[newPosition].direction === 0
        ) {
            return newPosition;
        }

        return -1;
    }

    async function move(piece) {
        const destination = possibleMoveDestination(piece);
        if (destination < 0) {
            alert('Peça sem movimento possível');
            return;
        }

        const updated = board.map(item => {
            // current ítem is the one clicked
            if (item.position === piece.position) {
                return { ...item, position: destination };
            }
            // current item is the destination
            if (item.position === destination) {
                return { ...item, position: piece.position };
            }
            return item;
        });
        const ordered = await updated.sort((a, b) => a.position - b.position);
        await setBoard(ordered);

        // verify victory
        const youWin = ordered.reduce((acc, cur, curIndex) => {
            if (acc === false) return false;
            return cur.symbol === victory[curIndex].symbol;
        }, true);
        if (youWin) {
            alert('Parabéns, você ganhou!');
            setBoard(newBoard);
            return;
        }

        //Verify loose
        const noPossibleMove = ordered.reduce((acc, cur) => {
            if (acc === false) return false;
            const posDes = possibleMoveDestination(cur, ordered);
            return posDes === -1;
        }, true);
        if (noPossibleMove) {
            console.log(board);
            console.log(ordered);
            alert('Você perdeu. Não ha mais movientos possívels.');
            setBoard(newBoard);
        }
        //TODO: Refactor this:
        /* The setBoard function has a delay that made me use the second 
        parameter in the possibleMoveDestination function. 
        An other way to do this is to put the check inside a rendered area that
        will be called just after the setBoard by the normal renderization. */
    }

    return (
        <div className="game-container">
            <div className="content">
                <h1>Resolva o Puzzle</h1>
                <p>
                    Mova todas as peças azuis para a direita e todas as peças
                    vermelhas para a esquerda.
                </p>

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

                <h1>Regras:</h1>
                <p>Peças azuis só andam para a direita.</p>
                <p>Peças vermelhas só andam para a esquerda.</p>
                <p>
                    Peças só andam para casa vazia, podendo estar ao lado ou
                    após uma única peça obrigatoriamente de cor oposta.
                </p>
            </div>
        </div>
    );
}

const newBoard = [
    {
        symbol: '>>',
        direction: 1,
        position: 0
    },
    {
        symbol: '>>',
        direction: 1,
        position: 1
    },
    {
        symbol: '>>',
        direction: 1,
        position: 2
    },
    {
        symbol: ' ',
        direction: 0,
        position: 3
    },
    {
        symbol: '<<',
        direction: -1,
        position: 4
    },
    {
        symbol: '<<',
        direction: -1,
        position: 5
    },
    {
        symbol: '<<',
        direction: -1,
        position: 6
    }
];

const victory = newBoard
    .map(item => ({ ...item, position: size - item.position }))
    .sort((a, b) => a.position - b.position);
