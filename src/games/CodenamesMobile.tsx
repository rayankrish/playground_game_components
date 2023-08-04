import { useState } from "react";

const BOARD_LENGTH = 5;

const background_colors: any = {
  BLUE: "#9ac1ed",
  ASSASSIN: "#c8cbcf",
  RED: "#f7cbd2",
  INNOCENT: "#e3c8a3",
  UNKNOWN: "#f0f0f0",
};

const border_colors: any = {
  BLUE: "#371b90",
  ASSASSIN: "#000000",
  RED: "#bf243d",
  INNOCENT: "#f0f0f0",
  INNOCENT_REVEALED: "#8c6749",
  UNKNOWN: "#666666",
};

function WordCard({
  word,
  revealed_color,
  true_color,
  onClick,
  clickable,
}: {
  word: string;
  revealed_color: string;
  true_color: string;
  onClick: any;
  clickable: boolean;
}) {
  let background: string = background_colors[revealed_color];
  let border: string = border_colors[true_color];
  if (true_color === "INNOCENT" && revealed_color === "INNOCENT") {
    border = border_colors["INNOCENT_REVEALED"];
  }
  let border_width = true_color === "ASSASSIN" ? "4" : "2";
  // TODO: Better font
  return (
    <button
      className="codenames-words-mobile"
      style={{
        backgroundColor: background,
        border: border_width + "px solid " + border,
      }}
      onClick={onClick}
      disabled={!clickable}
    >
      {word}
    </button>
  );
}

function ScoreDisplay({ blue, red }: { blue: number; red: number }) {
  return (
    <div className="codenames-score-mobile">
      <span style={{ color: "#bf243d", fontWeight: 600 }}>{red}</span>
      &nbsp;:&nbsp;
      <span style={{ color: "#371b90", fontWeight: 600 }}>{blue}</span>
    </div>
  );
}

function ClueDisplay({
  color,
  clue,
  count,
}: {
  color: string;
  clue: string;
  count: number;
}) {
  return (
    <div
      className="codenames-clue-mobile"
      style={{
        backgroundColor: background_colors[color],
      }}
    >
      {clue.toUpperCase()} - {count}
    </div>
  );
}

function RoleDisplay({ color, role }: { color: string; role: string }) {
  return (
    <div className="codenames-role">
      <div
        style={{
          backgroundColor: border_colors[color],
          display: "inline-block",
          padding: 10,
          color: "white",
          fontSize: "12px",
        }}
      >
        {color}
      </div>
      <div
        style={{
          display: "inline-block",
          padding: 10,
          borderLeft: "1px solid #15151A",
          fontSize: "12px",
        }}
      >
        {role === "GUESSER" ? "GUESSER" : "SPYMASTER"}
      </div>
    </div>
  );
}

export function CodenamesGame({
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
  const [clue, setClue] = useState("");
  const [count, setCount] = useState(0);

  let our_turn = state.player_moving_id === playerId;

  function cards_active() {
    return state.role === "GUESSER" && our_turn;
  }

  function sendGiveClueAction(word: string, count: number) {
    let action = {
      word: word,
      count: count,
    };
    onAction(JSON.stringify(action));
    setClue("");
    setCount(0);
  }

  function sendGuess(i: number) {
    let action = {
      guess: i,
    };
    onAction(JSON.stringify(action));
  }

  let cards = [];
  for (let i = 0; i < BOARD_LENGTH ** 2; i++) {
    cards.push(
      <WordCard
        word={state.words[i]}
        true_color={state.actual[i]}
        revealed_color={state.guessed[i]}
        onClick={() => sendGuess(i)}
        clickable={cards_active()}
      />
    );
  }

  // This is a pretty bad hack, but it's okay enough as long as we
  // don't change how player ids are assigned in codenames
  let clueColor = "";
  if (state.clue !== "") {
    let player_moving_id = state.player_moving_id;
    if (params.num_players === null || params.num_players === 4) {
      if (player_moving_id == 1 || player_moving_id == 2) {
        clueColor = "RED";
      } else {
        clueColor = "BLUE";
      }
    } else {
      clueColor = "RED";
    }
  }

  return (
    <div className="codenames-container-mobile">
      <div className="codenames-role-container space-x-2 mb-6">
        <RoleDisplay color={state.color} role={state.role} />

        {state.clue !== "" && (
          <ClueDisplay
            color={clueColor}
            clue={state.clue}
            count={state.count}
          />
        )}
      </div>
      <div>
        <div className="grid grid-cols-5 gap-3" style={{ zIndex: 0 }}>
          {cards}
        </div>
      </div>

      {
        <div className="codenames-footer mt-6">
          <div>
            <ScoreDisplay
              blue={state.scores["BLUE"]}
              red={state.scores["RED"]}
            />
          </div>
          <div>
            {state.role === "GUESSER" && (
              <button
                className="codenames-submit"
                disabled={!our_turn}
                onClick={() => sendGuess(-1)}
              >
                End Turn
              </button>
            )}
            {state.role === "GIVER" && (
              <div className="space-x-1">
                <input
                  className="codenames-input-mobile"
                  placeholder="Clue"
                  value={clue}
                  onChange={(e) => {
                    setClue(e.target.value);
                  }}
                />
                <input
                  className="codenames-count text-xs"
                  placeholder="Count"
                  value={count}
                  type="number"
                  onChange={(e) => {
                    setCount(parseInt(e.target.value));
                  }}
                />
                <button
                  className="codenames-submit-mobile"
                  disabled={false}
                  onClick={() => sendGiveClueAction(clue, count)}
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      }
    </div>
  );
}
