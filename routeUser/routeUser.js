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
  let dataPay;
  const sql = "SELECT  *  FROM users WHERE user_id = ?";

  const sql2 =
    "SELECT\n" +
    "	*,\n" +
    '	DATE_FORMAT( bill.bill_date, "%Y-%m-%d %T" ) AS bBill_date,\n' +
    "	SUM( room.room_price + powerbill.power_price + waterbill.water_price ) AS PRice,\n" +
    "	deposit.user_id AS USER_ID,\n" +
    "	deposit.room_id AS ROOM_ID \n" +
    "FROM\n" +
    "	bill\n" +
    "	LEFT JOIN roombill ON bill.roombill_id = roombill.roombill_id\n" +
    "	LEFT JOIN room ON room.room_id = roombill.room_id\n" +
    "	LEFT JOIN deposit ON deposit.room_id = room.room_id\n" +
    "	LEFT JOIN users ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN waterbill ON bill.waterbill_id = waterbill.waterbill_id\n" +
    "	LEFT JOIN powerbill ON bill.powerbill_id = powerbill.powerbill_id\n" +
    "	LEFT JOIN bank ON bank.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	deposit.user_id = ? \n" +
    "GROUP BY\n" +
    "	bill.bill_id";

  const sql3 =
    "SELECT\n" +
    "	*,\n" +
    '	DATE_FORMAT( payment_bill.paymentBill_date, "%Y-%m-%d %T" ) AS pPay_date \n' +
    "FROM\n" +
    "	payment_bill\n" +
    "	LEFT JOIN users ON payment_bill.user_id = users.user_id\n" +
    "	LEFT JOIN bill ON payment_bill.bill_id = bill.bill_id \n" +
    "WHERE\n" +
    "	payment_bill.user_id = ? \n" +
    "GROUP BY\n" +
    "	payment_bill.bill_id";
  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------ข้อมูลผู้ใช้งาน", result);
    dataUser = result[0];
  });
  await connecDB.query(sql2, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------ข้อมูลผู้ใช้งาน", result);
    dataBill = result;
  });
  await connecDB.query(sql3, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------ข้อมูลชำระเงิน", result);
    dataPay = result;
  });
  res.render("viewUsers/pay", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    datauser: dataUser,
    dataBill: dataBill,
    dataPay: dataPay,
    route: "pay",
  });
});

route.get("/repair", Checklogin, async (req, res) => {
  let dataUser;
  let databill;
  let dataRepair;
  const sql = "SELECT  *  FROM users WHERE user_id = ?";

  const sql2 =
    "SELECT\n" +
    "	*,\n" +
    '	DATE_FORMAT( roombill.roombill_date, "%Y-%m-%d %T" ) AS rBill_date,\n' +
    '	DATE_FORMAT( bill.bill_date, "%Y-%m-%d %T" ) AS bBill_date,\n' +
    '	DATE_FORMAT( waterbill.water_date, "%Y-%m-%d %T" ) AS wBill_date,\n' +
    '	DATE_FORMAT( powerbill.power_date, "%Y-%m-%d %T" ) AS pBill_date,\n' +
    "	SUM( room.room_price + waterbill.water_price + powerbill.power_price ) AS sumPrice,\n" +
    "	deposit.user_id AS UserID,\n" +
    "	deposit.room_id AS Room_id \n" +
    "FROM\n" +
    "	bill\n" +
    "	LEFT JOIN roombill ON bill.roombill_id = roombill.roombill_id\n" +
    "	LEFT JOIN room ON room.room_id = roombill.room_id\n" +
    "	LEFT JOIN deposit ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON room.domitory_id = domitory.domitory_id\n" +
    "	LEFT JOIN users ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN waterbill ON bill.waterbill_id = waterbill.waterbill_id\n" +
    "	LEFT JOIN powerbill ON bill.powerbill_id = powerbill.powerbill_id\n" +
    "	LEFT JOIN bank ON bank.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	deposit.user_id = ?";

  const sql3 =
    "SELECT\n" +
    "	*,\n" +
    '	DATE_FORMAT(repair.repair_date, "%Y-%m-%d %T" ) AS Repair_date,\n' +
    "	repair.user_id AS USER_ID\n" +
    "FROM\n" +
    "	repair \n" +
    "	LEFT JOIN room ON room.room_id = repair.room_id\n" +
    "	LEFT JOIN domitory ON room.domitory_id = domitory.domitory_id\n" +
    "	LEFT JOIN users ON repair.user_id = users.user_id\n" +
    "	LEFT JOIN bank ON bank.user_id = domitory.user_id\n" +
    "WHERE\n" +
    "	repair.user_id = ?";

  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------ข้อมูลผู้ใช้งาน", result);
    dataUser = result[0];
  });
  await connecDB.query(sql2, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------ข้อมูลผู้ใช้งาน", result);
    databill = result[0];
  });
  await connecDB.query(sql3, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------ข้อมูลการแจ้งซ่อม", result);
    dataRepair = result;
  });
  res.render("viewUsers/repair", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    dataUser: dataUser,
    databill: databill,
    dataRepair: dataRepair,
    route: "repair",
  });
});

route.get("/profileUser", Checklogin, async (req, res) => {
  let dataUser;
  const sql =
    "SELECT\n" +
    "	*,\n" +
    "	users.user_id AS USER_ID \n" +
    "FROM\n" +
    "	`users` \n" +
    "WHERE\n" +
    "	users.user_id = ?";

  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------ข้อมูลผู้ใช้งาน", result);
    dataUser = result[0];
  });
  res.render("viewUsers/profileUser", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    dataUser: dataUser,
    route: "profileUser",
  });
});

module.exports = route;
