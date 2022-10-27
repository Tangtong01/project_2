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
  res.render("viewOwner/ownerIndex", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    datauser: dataUser,
    route: "ownerindex",
  });
});

route.get("/tenantManagement", Checklogin, async (req, res) => {
  // console.log(req.session.user_id);
  const sql = "SELECT  *  FROM users WHERE user_id = ?";
  const sql2 = "SELECT * FROM users WHERE role_id =3 and owner_id = ?";
  let dataUser;
  let dataTenant;
  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log("------ข้อมูลผู้ใช้งาน", result);
    dataUser = result[0];
  });
  await connecDB.query(sql2, req.session.user_id).then(([result]) => {
    // console.log("---------ข้อมูลผู้เช่าหอ", result);
    dataTenant = result;

    if (result == null) {
      dataTenant = {
        "Firstname": "",
        "Surname": "",
        "username": "",
        "password": "",
        "Email": "",
        "Address": "",
        "Phonenumber": "",
        "owner": "",
      }
    }
  });
  // console.log(dataTenant);
  res.render("viewOwner/tenantManagement", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    route: "tenantManagement",
    dataUser: dataUser,
    dataTenant: dataTenant,
  });
});

route.get("/deposit", Checklogin, async (req, res) => {
  let dataUser;
  let dataTenant;
  let dataRoom;
  let dataDeposit;
  const sql = "SELECT  *  FROM users WHERE user_id = ?";
  const sql2 = "SELECT * FROM users WHERE role_id =3 and owner_id = ?";
  const sql3 = `                 
              SELECT * 
              FROM
	            room
	            INNER JOIN domitory ON room.domitory_id = domitory.domitory_id 
              WHERE
	            domitory.user_id = ?
                `;
  const datadeposit = `SELECT
  deposit.deposit_id,
	deposit.room_id,
	room.room_number,
	deposit.user_id,
	users.firstname,
	deposit.deposit_price,
	DATE_FORMAT( deposit.deposit_date, "%Y-%m-%d %T" ) AS deposit_date,
	DATE_FORMAT( deposit.deposit_end_date, "%Y-%m-%d %T" ) AS deposit_end_date 
FROM
	users,
	room,
	deposit 
WHERE
	deposit.room_id = room.room_id 
	AND deposit.user_id = users.user_id 
	AND role_id = 3 
	AND deposit.owner_id = ?`
  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log("------ข้อมูลผู้ใช้งาน>", result);
    dataUser = result[0];
  });

  await connecDB.query(sql2, [req.session.user_id]).then(([result]) => {
    // console.log("-------ข้อมูลผู้เช้าหอ>", result);
    dataTenant = result;
  });

  await connecDB.query(sql3, [req.session.user_id]).then(([result]) => {
    // console.log("--->", result);
    dataRoom = result;
  });

  await connecDB.query(datadeposit, [req.session.user_id]).then(([result]) => {
    // console.log("--->", result);
    dataDeposit = result;
  });

  res.render("viewOwner/deposit", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    dataUser: dataUser,
    dataTenant: dataTenant,
    dataRoom: dataRoom,
    dataDeposit: dataDeposit,
    route: "deposit",
  });

});


route.get("/roomManagement", Checklogin, async (req, res) => {
  let dataUser;
  let dataRoom;
  let dataDomitory;
  // let dataDeposit;
  const sql = "SELECT  *  FROM users WHERE user_id = ?";
  const sql2 = `                 
                SELECT * 
                FROM
                room
                INNER JOIN domitory ON room.domitory_id = domitory.domitory_id 
                WHERE
                domitory.user_id = ?
              `;

  const sql3 = "SELECT\n" +
    "	* \n" +
    "FROM\n" +
    "	domitory\n" +
    "	LEFT JOIN domitory_detal ON domitory.domitory_id = domitory_detal.domitory_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ?"
  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    dataUser = result[0];
  });

  await connecDB.query(sql2, [req.session.user_id]).then(([result]) => {
    // console.log("--- ข้อมูลห้องพัก>", result);
    dataRoom = result;
  });

  await connecDB.query(sql3, [req.session.user_id]).then(([result]) => {
    // console.log("--- ข้อมูลหอพัก>", result);
    dataDomitory = result;
  });

  res.render("viewOwner/roomManagement", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    datauser: dataUser,
    dataRoom: dataRoom,
    dataDomitory: dataDomitory,
    route: "roomManagement",
  });

});

route.get("/domitoryManagement", Checklogin, async (req, res) => {
  let dataUser;
  let dataDomitory;
  let dataRoom;
  // let dataDeposit;
  const sql = "SELECT  *  FROM users WHERE user_id = ?";
  const sql2 =
    "SELECT\n" +
    "	* \n" +
    "FROM\n" +
    "	domitory\n" +
    "	LEFT JOIN domitory_detal ON domitory.domitory_id = domitory_detal.domitory_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ?"
    ;

  const sql3 = `                 
                SELECT * 
                FROM
                room
                INNER JOIN domitory ON room.domitory_id = domitory.domitory_id 
                WHERE
                domitory.user_id = ?
              `;
  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log("--- ข้อมูลผู้ใช้>", result);
    dataUser = result[0];
  });


  await connecDB.query(sql2, [req.session.user_id]).then(([result]) => {
    // console.log("--- ข้อมูลหอพัก>", result);
    dataDomitory = result;
  });

  await connecDB.query(sql3, [req.session.user_id]).then(([result]) => {
    // console.log("--- ข้อมูลห้องพัก>", result);
    dataRoom = result;
  });

  // await connecDB.query(datadeposit, [req.session.user_id]).then(([result]) => {
  //   // console.log("--->", result);
  //   dataDeposit = result;
  // });

  res.render("viewOwner/domitoryManagement", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    datauser: dataUser,
    dataDomitory: dataDomitory,
    dataRoom: dataRoom,
    route: "domitoryManagement",
  });

});


route.get("/billManagement", Checklogin, async (req, res) => {
  let dataUser;
  let dataRoom;
  let dataDomitory;
  let dataDeposit_users_room;
  // let dataDeposit;
  const sql = "SELECT  *  FROM users WHERE user_id = ?";
  const sql2 = `                 
                SELECT * 
                FROM
                room
                INNER JOIN domitory ON room.domitory_id = domitory.domitory_id 
                WHERE
                domitory.user_id = ?
              `;

  const sql3 = "SELECT\n" +
    "	* \n" +
    "FROM\n" +
    "	domitory\n" +
    "	INNER JOIN domitory_detal ON domitory.domitory_id = domitory_detal.domitory_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ?"

  const sql4 = "SELECT\n" +
    "	*,\n" +
    "	deposit.room_id AS dep_room_id ,\n" +
    "	DATE_FORMAT(roombill.roombill_date,\"%Y-%m-%d %T\") as rBill_date\n" +
    "FROM\n" +
    "	deposit\n" +
    "	INNER JOIN room ON deposit.room_id = room.room_id\n" +
    "	INNER JOIN users ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN roombill ON roombill.room_id = room.room_id \n" +
    "WHERE\n" +
    "	deposit.owner_id = ?"

  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    dataUser = result[0];
  });

  await connecDB.query(sql2, [req.session.user_id]).then(([result]) => {
    // console.log("--- ข้อมูลห้องพัก>", result);
    dataRoom = result;
  });

  await connecDB.query(sql3, [req.session.user_id]).then(([result]) => {
    // console.log("--- ข้อมูลหอพัก>", result);
    dataDomitory = result;
  });

  await connecDB.query(sql4, [req.session.user_id]).then(([result]) => {
    console.log("--- ข้อมูลการมัดจำ_ผู้เช่าหอ_ห้องพัก>", result);
    dataDeposit_users_room = result;
  });

  res.render("viewOwner/billManagement", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    datauser: dataUser,
    dataRoom: dataRoom,
    dataDomitory: dataDomitory,
    dataDeposit_users_room: dataDeposit_users_room,
    route: "billManagement",
  });

});
module.exports = route;
