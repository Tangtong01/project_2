const path = require("path");
const express = require("express");
const app = express();
const session = require("express-session");
const oneDay = 1000 * 60 * 60 * 24;
const bodyParser = require('body-parser');

app.use(
  session({
    secret: "project final",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);
app.use(express.json({ limit: '50mb' }));
app.listen(3000, () => {
  console.log("http://localhost:3000");
});
app.use(express.static("public"));
app.use(express.static(__dirname));
app.set(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/public/images_domitory", express.static("public/images_domitory"));
app.use("/public/images_bill", express.static("public/images_bill"));
app.use("/public/images_repair", express.static("public/images_repair"));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



const route = require("./routeAdmin/routeAdmin");
app.use("/", route);
const routeAPI = require("./routeAdmin/routeAPIAdmin");
app.use("/api", routeAPI);

const routeUser = require("./routeUser/routeUser");
app.use("/user", routeUser);
const routeAPIUser = require("./routeUser/routeAPIUser");
app.use("/apiuser", routeAPIUser);

const routeOwner = require("./routeOwner/routeOwner");
app.use("/owner", routeOwner);
const routeAPIOwner = require("./routeOwner/routeAPIOwner");
app.use("/apiowner", routeAPIOwner);
