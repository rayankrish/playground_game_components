import React, { useState } from "react";

function Card({ card, width }: { card: string; width: string }) {
  return (
    <img
      style={{ width: width }}
      src={"/assets/games/poker/cards/" + card + ".png"}
    />
  );
}

function Player({
  cards,
  chips,
  name,
  moving,
  won,
}: {
  cards: Array<string> | null;
  chips: number;
  name: string;
  moving: boolean;
  won: boolean;
}) {
  let shadow = "";
  if (won) {
    shadow = "0px 0px 20px #1b7502";
  } else if (moving) {
    shadow = "0px 0px 20px rosybrown";
  }
  return (
    <div
      className="poker-card"
      style={{
        boxShadow: shadow,
      }}
    >
      {cards !== null && (
        <div className="horizontal-split-box space-x-2 mb-4">
          <Card width="5em" card={cards[0]} />
          <Card width="5em" card={cards[1]} />
        </div>
      )}
      <div style={{ display: "inline-flex" }}>
        <Bet amount={chips}></Bet>
      </div>
    </div>
  );
}

function Bet({ amount }: { amount: number }) {
  return (
    <div className="poker-flex space-x-2">
      <img className="poker-chip" src="/assets/games/poker/poker_chip.png" />
      <p className="poker-bet-text">{amount}</p>
    </div>
  );
}

function PlayerWrapper({
  cards,
  chips,
  bet,
  moving,
  won,
}: {
  cards: Array<string>;
  chips: number;
  bet: number;
  moving: boolean;
  won: boolean;
}) {
  return (
    <div className="vertical-split-box center-flex space-y-5">
      <Bet amount={bet}></Bet>
      <Player
        cards={cards}
        chips={chips}
        name="Player1"
        moving={moving}
        won={won}
      />
    </div>
  );
}

export function PokerGame({
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
  const [lastAckedHandNumber, setLastAckedHandNumber] = useState(0);
  const [prevState, setPrevState] = useState<any>("");
  const [raiseValue, setRaiseValue] = useState(0);

  let num_players = params["num_players"];

  let our_turn = state.player_moving_id === playerId;

  let other_pids = [];
  for (let i = 1; i <= num_players; i++) {
    other_pids.push((playerId + i) % num_players);
  }

  if (prevState !== state && lastAckedHandNumber === state.hand_number) {
    setPrevState(state);
  }

  function betweenHands() {
    return state.hand_number !== lastAckedHandNumber;
  }

  function getHand(hand_pid: number) {
    if (betweenHands()) {
      if (hand_pid in state.last_round.hands) {
        return state.last_round.hands[hand_pid];
      }
      return ["0", "0"];
    }
    if (hand_pid !== playerId) {
      return ["0", "0"];
    }
    return state.hole_cards;
  }

  function getChipCounts(pid: number) {
    if (betweenHands()) {
      return prevState.chip_counts[pid];
    }
    return state.chip_counts[pid];
  }

  function getBets(pid: number) {
    if (betweenHands()) {
      return 0;
    }
    return state.amounts_bet[pid];
  }

  function getPot() {
    if (betweenHands()) {
      let amount = prevState.pot_size;
      for (let i = 0; i < num_players; i++) {
        amount += prevState.amounts_bet[i];
      }
      return amount;
    }
    return state.pot_size;
  }

  function sendAction(type: string, value: number | null) {
    let action: any = {
      action_type: type,
    };
    if (value !== null) {
      action["total"] = value;
    }
    onAction(JSON.stringify(action));
  }

  return (
    <div className="poker-container">
      <div className="horizontal-split-box">
        <div className="poker-main">
          <div className="poker-header space-y-4">
            <Bet amount={getPot()} />
            <div className="center-flex space-x-2">
              {(betweenHands()
                ? prevState.communal_cards
                : state.communal_cards
              ).map((card: string) => (
                <Card width="6em" card={card} />
              ))}
            </div>
          </div>
          <div className="poker-flex space-x-10">
            <div className="center-flex">
              <PlayerWrapper
                cards={getHand(other_pids[0])}
                chips={getChipCounts(other_pids[0])}
                bet={getBets(other_pids[0])}
                moving={
                  !betweenHands() && state.player_moving_id === other_pids[0]
                }
                won={
                  betweenHands() && other_pids[0] in state.last_round.winnings
                }
              />
            </div>
            <div className="center-flex">
              <PlayerWrapper
                cards={betweenHands() ? prevState.hole_cards : state.hole_cards}
                chips={getChipCounts(playerId)}
                bet={getBets(playerId)}
                moving={!betweenHands() && state.player_moving_id === playerId}
                won={betweenHands() && playerId in state.last_round.winnings}
              />
            </div>

            {num_players === 3 && (
              <div style={{ flexShrink: 0 }}>
                <PlayerWrapper
                  cards={getHand(other_pids[1])}
                  chips={getChipCounts(other_pids[1])}
                  bet={getBets(other_pids[1])}
                  moving={
                    !betweenHands() && state.player_moving_id === other_pids[1]
                  }
                  won={
                    betweenHands() && other_pids[1] in state.last_round.winnings
                  }
                />
              </div>
            )}
          </div>
        </div>
        <div className="poker-controls">
          <button
            disabled={!our_turn || state.status === "TO_CALL" || betweenHands()}
            className="poker-button"
            style={{
              opacity: !our_turn || betweenHands() ? "40%" : "100%",
            }}
            onClick={() => sendAction("CHECK", null)}
          >
            Check
          </button>
          <button
            disabled={!our_turn || state.status !== "TO_CALL" || betweenHands()}
            className="poker-button"
            style={{
              opacity: !our_turn || betweenHands() ? "40%" : "100%",
            }}
            onClick={() => sendAction("CALL", null)}
          >
            Call
          </button>
          <button
            disabled={!our_turn || betweenHands()}
            className="poker-button"
            style={{
              opacity: !our_turn || betweenHands() ? "40%" : "100%",
            }}
            onClick={() => sendAction("FOLD", null)}
          >
            Fold
          </button>

          <div
            className="poker-button"
            style={{
              opacity: !our_turn || betweenHands() ? "40%" : "100%",
            }}
          >
            <input
              type="number"
              onChange={(e) => setRaiseValue(parseInt(e.target.value))}
              value={raiseValue}
              defaultValue={state.min_raise}
              disabled={!state.can_raise}
              className="poker-input"
            />
            <button
              disabled={!our_turn || !state.can_raise || !betweenHands}
              onClick={() => sendAction("RAISE", raiseValue)}
            >
              Raise
            </button>
          </div>
          {betweenHands() && (
            <button
              className="poker-button"
              onClick={() => setLastAckedHandNumber(state.hand_number)}
            >
              Next Hand
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
