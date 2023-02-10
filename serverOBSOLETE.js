//const path = require("path");
import path from "path";
//const express = require("express");
import express from "express";
//const app = require("./dist/assets/index.f35d3653.js");
import app from "./dist/assets/index.f35d3653.js";

const server = express();

server.use(express.static(path.join(__dirname, "public")));

server.get("*", function (req, res) {
  const { html } = app.render({ url: req.url });

  res.write(`
    <!DOCTYPE html>
    <link rel='stylesheet' href='/global.css'>
    <link rel='stylesheet' href='/bundle.css'>
    <div id="app">${html}</div>
    <script src="/bundle.js"></script>
  `);

  res.end();
});

const port = 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
