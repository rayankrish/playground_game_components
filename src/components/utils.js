import { useEffect, useRef } from "react";

const short_uid_gen = require("short-uuid");

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// only netlify should set this
console.log(process.env.REACT_APP_BRANCH);
var _endpoint = "http://localhost";
var _port = "8083";

if (process.env.REACT_APP_BRANCH === "DEV") {
  // dev
  _endpoint = "https://stagingcdn.playgroundrl.com";
  _port = "8083";
} else if (process.env.REACT_APP_BRANCH === "PROD") {
  // staging
  _endpoint = "https://cdn.playgroundrl.com";
  _port = "8083";
} else {
  // local
  _port = "8000";
}
export const ENDPOINT = _endpoint;
export const PORT = _port;
export const BASE_URL = ENDPOINT + ":" + PORT;
