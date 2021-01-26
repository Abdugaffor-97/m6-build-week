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

// Routes
const experienceRoutes = require("./servises/experience");
const profileRoute = require("./servises/profile");
const postRoute = require("./servises/post");

const app = express();

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
app.use("/experience", experienceRoutes);
app.use("/profile", profileRoute);
app.use("/posts", postRoute);

console.log(listEndpoints(app));

app.use(badRequestErrorHandler);
app.use(notFoundErrorHandler);
app.use(forbiddenErrorHandler);
app.use(unauthorizedErrorHandler);
app.use(catchAllErrorHandler);

const port = process.env.PORT;
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    app.listen(port, () => {
      if (process.env.NODE_ENV === "production") {
        console.log("Running on cloud on port", port);
      } else {
        console.log(`Running locally on url http://localhost:${port}`);
      }
    })
  )
  .catch((error) => console.log(error));
