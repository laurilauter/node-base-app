import { baseURLWs } from "./lib/utilities/baseUrl";
export const socket = new WebSocket(baseURLWs);

//WS setup
socket.onopen = function () {
  console.log("WS Connection established at client side");
  //socket.send("Client says: hello");
};

socket.onmessage = function (event) {
  console.log(`WS Data received from server: ${event.data}`);
};

socket.onclose = function (event) {
  if (event.wasClean) {
    console.log(
      `WS Connection closed cleanly, code=${event.code} reason=${event.reason}`
    );
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log("WS Connection died: ", event.code);
  }
};

socket.onerror = function (error) {
  console.log(`WS error: ${error.message}`);
};
