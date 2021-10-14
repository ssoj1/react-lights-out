import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 * generate rand num 0-1 --> pass the % in, 
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 * Random num --> 0-5 * 20% 
 * Max = 1,
 * Min = 0
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.2 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    for (let y = 0; y <= ncols; y++) {
      initialBoard.push(Array.from({ length: nrows }, function (x) {
        return Boolean(Math.random() < chanceLightStartsOn);
      }))
    };

    return initialBoard;
  };

  /** Returns true if every cell is true, otherwise returns false  */
  function hasWon() {
    for (let row of board) {
      if (row.indexOf(false) === -1) {
        return false;
      }
    }
    return true;
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const boardCopy = oldBoard.slice();

      const cellsToFlip = [[y, x], [y, x + 1], [y, x - 1], [y + 1, x], [y - 1, x]];

      cellsToFlip.map(cell => flipCell(cell[0], cell[1], boardCopy));

      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (!hasWon()) {
    return (
      <div className="wonMsg">
        You won!
      </div>
    );
  }

  // make table board: rows of Cell components

  let tblBoard = [];

  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      let coord = `${y}-${x}`;
      row.push(
          <Cell
              key={coord}
              isLit={board[y][x]}
              flipCellsAroundMe={evt => flipCellsAround(coord)}
          />,
      );
    }
    tblBoard.push(<tr key={y}>{row}</tr>);
  }

  return (
    <table className="Board">
      <tbody>{tblBoard}</tbody>
    </table>
  );
}

export default Board;
