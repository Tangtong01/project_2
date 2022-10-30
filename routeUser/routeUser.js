const express = require("express");
const route = express.Router();
const connecDB = require("../configDB/configDB");

function Checklogin(req, res, next) {
  if (typeof req.session.user_id == "undefined") {
    return res.redirect("/login_register");
  }
  next();
}

route.get("/", Checklogin, async (req, res) => {
  let dataUser;
  const sql = "SELECT  *  FROM users WHERE user_id = ?";
  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log(result[0].firstname);
    dataUser = result[0];
  });
  res.render("viewUsers/userIndex", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    datauser: dataUser,
    route: "userindex",
  });
});

route.get("/pay", Checklogin, async (req, res) => {
  let dataUser;
  let dataBill;
  const sql = "SELECT  *  FROM users WHERE user_id = ?";

  const sql2 = "SELECT\n" +
    "	*,\n" +
    "	DATE_FORMAT( roombill.roombill_date, \"%Y-%m-%d %T\" ) AS rBill_date,\n" +
    "	DATE_FORMAT( bill.bill_date, \"%Y-%m-%d %T\" ) AS bBill_date,\n" +
    "	DATE_FORMAT( waterbill.water_date, \"%Y-%m-%d %T\" ) AS wBill_date,\n" +
    "	DATE_FORMAT( powerbill.power_date, \"%Y-%m-%d %T\" ) AS pBill_date,\n" +
    "	SUM( room.room_price + waterbill.water_price + powerbill.power_price ) AS sumPrice \n" +
    "FROM\n" +
    "	bill\n" +
    "	LEFT JOIN roombill ON bill.roombill_id = roombill.roombill_id\n" +
    "	LEFT JOIN room ON room.room_id = roombill.room_id\n" +
    "	LEFT JOIN deposit ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON room.domitory_id = domitory.domitory_id\n" +
    "	LEFT JOIN users ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN waterbill ON bill.waterbill_id = waterbill.waterbill_id\n" +
    "	LEFT JOIN powerbill ON bill.powerbill_id = powerbill.powerbill_id \n" +
    "WHERE\n" +
    "	deposit.user_id = ?"
  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------ข้อมูลผู้ใช้งาน", result);
    dataUser = result[0];
  });
  await connecDB.query(sql2, [req.session.user_id]).then(([result]) => {
    dataBill = result;
  });
  res.render("viewUsers/pay", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    datauser: dataUser,
    dataBill: dataBill,
    route: "pay",
  });
});


route.get("/repair", Checklogin, async (req, res) => {
  let dataUser;
  const sql = "SELECT  *  FROM users WHERE user_id = ?";
  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    console.log("-----------------ข้อมูลผู้ใช้งาน", result);
    dataUser = result[0];
  });
  res.render("viewUsers/repair", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    datauser: dataUser,
    route: "repair",
  });
});


module.exports = route;
