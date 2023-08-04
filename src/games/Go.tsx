import "../styles/go.css";

export function GoGame({
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
  spectating: any;
}) {
  let board: number[][] = state.board;
  let gridSize = board.length;
  console.log(gridSize);
  console.log(board);

  function handleClick(row: number, col: number) {
    // TODO: Submit action
    onAction(gridSize * row + col);
  }

  function pass() {
    onAction(gridSize * gridSize);
  }

  console.log(gridSize);
  var intersections = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let classes = "go-intersection";
      if (j === 0) {
        classes += " go-left";
      } else if (j === gridSize - 1) {
        classes += " go-right";
      }
      if (i === 0) {
        classes += " go-top";
      } else if (i === gridSize - 1) {
        classes += " go-bottom";
      }

      console.log(board[i][j]);
      if (board[i][j] === 0) {
        classes += " go-black";
      } else if (board[i][j] === 1) {
        classes += " go-white";
      } else {
        classes += " go-empty";
      }

      intersections.push(
        <div className={classes} onClick={() => handleClick(i, j)}></div>
      );
    }
  }

  return (
    <div className="go-container">
      <div
        style={{
          width: `${30 * gridSize}px`,
          height: `${30 * gridSize}px`,
          display: "grid",
          gridTemplateColumns: "repeat(" + gridSize + ", 30px)",
        }}
      >
        {intersections}
      </div>
      <div className="center-flex">
        <button onClick={() => pass()} className="go-button">
          Pass
        </button>
      </div>
    </div>
  );
}
