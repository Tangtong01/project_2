const express = require("express");
const route = express.Router();
const connecDB = require("../configDB/configDB");

function Checklogin(req, res, next) {
  if (typeof req.session.user_id == "undefined") {
    return res.redirect("/login_register");
  }
  next();
}

route.get("/", (req, res) => {
  res.render("homePage", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    route: "homePage",
  });
});

function CheckRole(req, res, next) {
  if (req.session.role_id != 1) {
    return res.redirect("/noPermission");
  }
  next();
}

route.get("/adminhomepage", Checklogin, async (req, res) => {
  console.log("user_id", req.session.user_id);
  let dataUser;
  const sql = "SELECT  *  FROM users WHERE user_id = ?";
  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    console.log(result[0].firstname);
    dataUser = result[0];
  });
  res.render("index", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    datauser: dataUser,
    route: "index",
  });
});

route.get("/noPermission", (req, res) => {
  res.render("noPermission", {
    route: "noPermission",
  });
});

route.get("/about", (req, res) => {
  console.log(req.session.user_id);
  res.render("about", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    route: "about",
  });
});
route.get("/dormitoryList", (req, res) => {
  console.log(req.session.user_id);
  res.render("dormitoryList", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    route: "dormitoryList",
  });
});
route.get("/dormowner", Checklogin, async (req, res) => {
  console.log(req.session.user_id);
  const sql = "SELECT  *  FROM users WHERE user_id = ?";
  const sql2 = "SELECT * FROM users WHERE role_id =2 ";
  let dataUser;
  let dataDormowner;
  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    console.log(result[0].firstname);
    dataUser = result[0];
  });
  await connecDB.query(sql2).then(([result]) => {
    console.log(result[0].firstname);
    dataDormowner = result;
  });
  console.log(dataDormowner);
  res.render("dormowner", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    route: "dormowner",
    datauser: dataUser,
    dataDormowner: dataDormowner,
  });
});
route.get("/login_register", (req, res) => {
  res.render("login_register");
});

route.get("/dashbord", (req, res) => {
  res.render("dashbord", {
    checklogin: req.session.user_id,
  });
});

route.get("/dormitoryManagement", (req, res) => {
  res.render("dormitoryManagement", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    route: "dormitoryManagement",
  });
});
module.exports = route;
