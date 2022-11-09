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
  // console.log("user_id", req.session.user_id);
  let dataUser;
  const sql = "SELECT  *  FROM users WHERE user_id = ?";
  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log(result[0].firstname);
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
  // console.log(req.session.user_id);
  res.render("about", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    route: "about",
  });
});

route.get("/dormitoryList", async (req, res) => {
  let dataDomitory;
  let dataDomitpry_limit;
  const sql =
    "SELECT\n" +
    "	* \n" +
    "FROM\n" +
    "	`domitory`\n" +
    "	LEFT JOIN domitory_detal ON domitory.domitory_id = domitory_detal.domitory_id\n" +
    "	LEFT JOIN users ON domitory.user_id = users.user_id";
  const sql2 =
    "SELECT\n" +
    "	* \n" +
    "FROM\n" +
    "	`domitory`\n" +
    "	LEFT JOIN domitory_detal ON domitory.domitory_id = domitory_detal.domitory_id\n" +
    "	LEFT JOIN users ON domitory.user_id = users.user_id \n limit  4";
  await connecDB.query(sql).then(([result]) => {
    // console.log("------------ข้อมูลหอพักทั้งหมด", result);
    dataDomitory = result;
  });
  await connecDB.query(sql2).then(([result]) => {
    // console.log("------------ข้อมูลหอพักทั้งหมด", result);
    dataDomitpry_limit = result;
  });

  res.render("dormitoryList", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    dataDomitory: dataDomitory,
    dataDomitpry_limit: dataDomitpry_limit,
    route: "dormitoryList",
  });
});
route.get("/dormowner", Checklogin, async (req, res) => {
  // console.log(req.session.user_id);
  const sql = "SELECT  *  FROM users WHERE user_id = ?";
  const sql2 = "SELECT * FROM users WHERE role_id =2 ";
  let dataUser;
  let dataDormowner;
  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log(result[0].firstname);
    dataUser = result[0];
  });
  await connecDB.query(sql2).then(([result]) => {
    // console.log(result[0].role_id);
    dataDormowner = result;
  });
  // console.log(dataDormowner);
  res.render("dormowner", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    route: "dormowner",
    datauser: dataUser,
    dataDormowner: dataDormowner,
  });
});
route.get("/login_register", async (req, res) => {
  let dataDormowner;
  const sql = "SELECT * FROM users WHERE role_id =2 ";
  await connecDB.query(sql).then(([result]) => {
    // console.log(result);
    dataDormowner = result;
  });

  res.render("login_register", {
    route: "login_register",
    dataDormowner: dataDormowner,
  });
});

route.get("/dashbord", Checklogin, async (req, res) => {
  let dataUser_domi;
  let dataCountDomi;
  let dataCountUser;
  const sql =
    "SELECT\n" +
    "	*,\n" +
    "	( SELECT COUNT( rooms.room_id ) FROM room AS rooms WHERE rooms.room_status = 1 AND rooms.domitory_id = domitory.domitory_id ) AS CountDep \n" +
    "FROM\n" +
    "	domitory\n" +
    "	LEFT JOIN room ON domitory.domitory_id = room.domitory_id\n" +
    "	LEFT JOIN domitory_detal ON domitory.domitory_id = domitory_detal.domitory_id\n" +
    "	LEFT JOIN users ON domitory.user_id = users.user_id \n" +
    "GROUP BY\n" +
    "	domitory.domitory_id";
  const sql2 =
    "SELECT\n" +
    "	COUNT( domitory.domitory_id ) AS Count_domi \n" +
    "FROM\n" +
    "	domitory";
  const sql3 =
    "SELECT\n" +
    "	COUNT( users.user_id ) AS Count_users_role_3 \n" +
    "FROM\n" +
    "	`users` \n" +
    "WHERE\n" +
    "	users.role_id = 3";
  await connecDB.query(sql).then(([result]) => {
    console.log("--------ข้อมูลเจ้าของหอพัก", result);
    dataUser_domi = result;
  });
  await connecDB.query(sql2).then(([result]) => {
    // console.log("--------จำนวนหอพักที่ร่วมรายการ", result);
    dataCountDomi = result;
  });
  await connecDB.query(sql3).then(([result]) => {
    // console.log("--------จำนวนผู้เช่าทั้งหมด", result);
    dataCountUser = result;
  });
  res.render("dashbord", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    dataUser_domi: dataUser_domi,
    dataCountDomi: dataCountDomi,
    dataCountUser: dataCountUser,
    route: "dashbord",
  });
});

route.get("/dormitoryManagement", async (req, res) => {
  let dataDomitory;
  let dataDomitpry_limit;
  const sql =
    "SELECT\n" +
    "	* \n" +
    "FROM\n" +
    "	`domitory`\n" +
    "	LEFT JOIN domitory_detal ON domitory.domitory_id = domitory_detal.domitory_id\n" +
    "	LEFT JOIN users ON domitory.user_id = users.user_id";
  const sql2 =
    "SELECT\n" +
    "	* \n" +
    "FROM\n" +
    "	`domitory`\n" +
    "	LEFT JOIN domitory_detal ON domitory.domitory_id = domitory_detal.domitory_id\n" +
    "	LEFT JOIN users ON domitory.user_id = users.user_id \n limit  4";
  await connecDB.query(sql).then(([result]) => {
    // console.log("------------ข้อมูลหอพักทั้งหมด....", result);
    dataDomitory = result;
  });
  await connecDB.query(sql2).then(([result]) => {
    // console.log("------------ข้อมูลหอพักทั้งหมด....", result);
    dataDomitpry_limit = result;
  });
  res.render("dormitoryManagement", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    dataDomitory: dataDomitory,
    dataDomitpry_limit: dataDomitpry_limit,
    route: "dormitoryManagement",
  });
});

route.get("/adminProfile", Checklogin, async (req, res) => {
  let dataUser;
  const sql =
    "SELECT\n" +
    "	* ,\n" +
    "	users.user_id as USER_ID\n" +
    "FROM\n" +
    "	`users`\n" +
    "	LEFT JOIN bank ON users.user_id = bank.user_id \n" +
    "WHERE\n" +
    "	users.user_id = ?";

  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------ข้อมูลผู้ใช้งาน", result);
    dataUser = result[0];
  });
  res.render("adminProfile", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    dataUser: dataUser,
    route: "adminProfile",
  });
});
module.exports = route;
