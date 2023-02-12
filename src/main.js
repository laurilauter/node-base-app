import "./app.css";
import "./layout.css";
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
  //hydrate: true,
});

// const app = new App({
//   target: document.body,
// });

export default app;
