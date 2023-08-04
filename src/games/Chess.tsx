import { Chessboard } from "react-chessboard";
import { Piece, Square } from "react-chessboard/dist/chessboard/types";

export function ChessGame({
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
  let fen = state.fen;

  // compute color
  let color_moving = fen.split(" ")[1];
  let our_turn = state.player_moving_id === playerId;

  let color = "black";
  if (
    (color_moving === "w" && our_turn) ||
    (color_moving === "b" && !our_turn)
  ) {
    color = "white";
  }

  let boardOrientation: any =
    color === "black" && !spectating ? "black" : "white";

  function isDraggablePiece(args: { piece: Piece; sourceSquare: Square }) {
    return args.piece.startsWith(color[0]);
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    let uci = sourceSquare + targetSquare;

    onAction('{ "uci": "' + uci + '"}');
    // TODO: Catch errors immediately
    return true;
  }

  return (
    <Chessboard
      boardWidth={550}
      position={fen}
      isDraggablePiece={isDraggablePiece}
      onPieceDrop={onDrop}
      boardOrientation={boardOrientation}
      // onPieceDragBegin={snapTo}
      snapToCursor={false}
    />
  );
}
