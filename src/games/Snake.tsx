import { useEffect, useState } from "react";
import "../App.css";
import { useInterval } from "../components/utils";

const NUM_TILES = 10;
const FRAME_RATE = 300;
const INACTIVE_ID = "default value";

export function SnakeComponent({
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
  // initialize states and updater functions
  const [snake, setSnake] = useState<Array<Array<number>>>([[1, 1]]);
  const [apple, setApple] = useState<Array<number>>([2, 2]);
  const [gameID, setGameID] = useState(INACTIVE_ID);
  const [action, setAction] = useState("E");
  const [listenToSID, setListenToSID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setSnake(state.snake);
    setApple(state.apple);
  }, [state]);

  // sends action messages to server if in player mode only if
  useInterval(() => {
    onAction(action);
  }, FRAME_RATE);

  // listens for and updates states upon movement key press
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
          e.code
        ) > -1
      ) {
        e.preventDefault();
      }
      console.log("handling a keypress");
      const newDirection = getDirectionFromKey(e.key);
      if (newDirection === "") return;
      setAction(newDirection);
    });
  });

  // defines movement key pressed by user
  const getDirectionFromKey = (key: string) => {
    if (key === "ArrowUp" || key === "w") return "N";
    if (key === "ArrowRight" || key === "d") return "E";
    if (key === "ArrowDown" || key === "s") return "S";
    if (key === "ArrowLeft" || key === "a") return "W";
    return "";
  };

  // determines tile type
  function getCellClassName(col: number, row: number) {
    for (var i = 0; i < snake.length; i++) {
      if (snake[i][0] === row && snake[i][1] === col) {
        return "aspect-square bg-white m-1";
      }
    }
    if (apple[0] === row && apple[1] === col) {
      return "aspect-square bg-red-600 m-0.5";
    }
    return "aspect-square bg-black m-0.5";
  }

  var tiles = [];
  for (var i = 0; i < NUM_TILES; i++) {
    for (var j = 0; j < NUM_TILES; j++) {
      tiles.push(
        <div className={getCellClassName(i, j)} key={NUM_TILES * i + j}></div>
      );
    }
  }

  return (
    <div
      style={{
        width: "580px",
      }}
    >
      <div className="px-8 pt-8 content-center">
        <div className="pb-16 flex items-center justify-center">
          <div className="aspect-square w-3/4 grid grid-cols-10 bg-gray-900">
            {tiles}
          </div>
        </div>
      </div>
    </div>
  );
}
