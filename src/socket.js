import { baseURLWs } from "./lib/utilities/baseUrl";
export const socket = new WebSocket(baseURLWs);
//import { wsConnect } from "../server/index.js";

//WS setup
socket.onopen = function () {
  console.log("WS Connection established at client side");
  const data = { event: "Hi from client" };
  socket.send(JSON.stringify(data));
};

socket.onmessage = function (event) {
  const receivedData = JSON.parse(event.data);
  // if ((receivedData.event = "ping")) {
  // }
  console.log(`WS Data received from server: ${receivedData.event}`);
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
    //wsConnect();
  }
};

socket.onerror = function (error) {
  //console.log(`WS error: ${error.message}`);
  console.log(`WS error: ${error.message}`);
};
