require("dotenv").config();
const express = require("express");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");
const mongoose = require("mongoose");
const {
  badRequestErrorHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorHandler,
} = require("./errorHandlers");
const { PORT, DATABASE_URL } = process.env;

// Routes
const apis = require("./servises");

const http = require("http");
const createSocketServer = require("./socket");

const app = express();
const httpServer = http.createServer(app);
createSocketServer(httpServer);

app.use(cors());
app.use(express.json());
const whiteList = [process.env.FE_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
      // Allowed
      callback(null, true);
    } else {
      callback(new Error("NOT Allowed-cors "));
    }
  },
};

// API
app.use("/api", apis);

console.log(listEndpoints(app));

app.use(badRequestErrorHandler);
app.use(notFoundErrorHandler);
app.use(forbiddenErrorHandler);
app.use(unauthorizedErrorHandler);
app.use(catchAllErrorHandler);

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    httpServer.listen(PORT, () => {
      if (process.env.NODE_ENV === "production") {
        console.log("Running on cloud on port", PORT);
      } else {
        console.log(`Running locally on url http://localhost:${PORT}`);
      }
    })
  )
  .catch((error) =>
    console.log(`
    Mongo Connection Error 
=============================================================>
  ${error}
  `)
  );
