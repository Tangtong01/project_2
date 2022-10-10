const path = require("path");
const express = require("express");
const app = express();
const session = require("express-session");

const oneDay = 1000 * 60 * 60 * 24;

app.use(
  session({
    secret: "project final",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);
app.use(express.json());
app.listen(3000, () => {
  console.log("http://localhost:3000");
});
app.use(express.static("public"));
app.set(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const route = require("./route/route");
app.use("/", route);

const routeUser = require("./route/routeUser");
app.use("/user", routeUser);

const routeAPI = require("./route/routeAPI");
app.use("/api", routeAPI);

const routeAPIUser = require("./route/routeAPIUser");
app.use("/apiuser", routeAPIUser);
