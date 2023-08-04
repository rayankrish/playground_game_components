import x_img from "../images/tictactoe_x.png";
import o_img from "../images/tic-tac-toe/tictactoe_o.png";
import empty_img from "../images/tic-tac-toe/tictactoe_empty.png";

const EMPTY_SQUARE = -1;

export function TicTacToeGame({
  params,
  state,
  onAction,
  playerId,
  spectating,
}: {
  params: any;
  state: any;
  onAction: any;
  playerId: any;
  spectating: boolean;
}) {
  let board = state.board;
  let our_turn = state.player_moving_id === playerId;

  function getImgSrc(row: number, col: number) {
    if (board[row][col] === 0) {
      return x_img;
    } else if (board[row][col] === 1) {
      return o_img;
    }
    return empty_img;
  }

  function handleTileClick(col: number, row: number) {
    var x = col;
    var y = row;
    if (board[x][y] === EMPTY_SQUARE && our_turn) {
      onAction(x * 3 + y);
    }
  }

  var tiles = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      //tiles.push(<div className={getCellClassName(i, j)} key={10*i + j}></div>)
      tiles.push(
        <div
          className="m-1 bg-gray-100"
          key={3 * i + j}
          onClick={() => handleTileClick(i, j)}
        >
          <img className="p-2" src={getImgSrc(i, j)} />
        </div>
      );
    }
  }

  return (
    <div className="ttt-container">
      <div className="aspect-square w-full grid grid-cols-3 bg-gray-900 p-1">
        {tiles}
      </div>
    </div>
  );
}
