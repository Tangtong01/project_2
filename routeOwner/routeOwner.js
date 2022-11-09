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
  let dataDomiImg;
  const sql = "SELECT  *  FROM users WHERE user_id = ?";
  const sql2 =
    "SELECT\n" +
    "	* \n" +
    "FROM\n" +
    "	domitory\n" +
    "	LEFT JOIN domitory_detal ON domitory.domitory_id = domitory_detal.domitory_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ?";
  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log(result[0].firstname);
    dataUser = result[0];
  });
  await connecDB.query(sql2, [req.session.user_id]).then(([result]) => {
    // console.log("-----------ข้อมูลหอพัก", result);
    dataDomiImg = result;
  });
  res.render("viewOwner/ownerIndex", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    datauser: dataUser,
    dataDomiImg: dataDomiImg,
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
        Firstname: "",
        Surname: "",
        username: "",
        password: "",
        Email: "",
        Address: "",
        Phonenumber: "",
        owner: "",
      };
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
  const sql2 =
    "SELECT\n" +
    "	* \n" +
    "FROM\n" +
    "	users \n" +
    "WHERE\n" +
    "	role_id = 3 \n" +
    "	AND user_status = 1 \n" +
    "	AND owner_id = ?";
  const sql3 = `                 
              SELECT * 
              FROM
	            room
	            INNER JOIN domitory ON room.domitory_id = domitory.domitory_id 
              WHERE
	            domitory.user_id = ?
                `;
  const datadeposit =
    "SELECT\n" +
    "	*,\n" +
    '	DATE_FORMAT( deposit.deposit_date, "%Y-%m-%d %T" ) AS Deposit_date,\n' +
    '	DATE_FORMAT( deposit.deposit_end_date, "%Y-%m-%d %T" ) AS Deposit_end_date \n' +
    "FROM\n" +
    "	deposit\n" +
    "	LEFT JOIN room ON deposit.room_id = room.room_id\n" +
    "	LEFT JOIN users ON deposit.user_id = users.user_id \n" +
    "WHERE\n" +
    "	deposit.room_id = room.room_id \n" +
    "	AND deposit.user_id = users.user_id \n" +
    "	AND role_id = 3 \n" +
    "	AND deposit.owner_id = ?";
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

  const sql3 =
    "SELECT\n" +
    "	* \n" +
    "FROM\n" +
    "	domitory\n" +
    "	LEFT JOIN domitory_detal ON domitory.domitory_id = domitory_detal.domitory_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ?";
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
    "	domitory.user_id = ?";
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
  let dataDeposit;
  let dataBill;
  // let dataDeposit;
  const sql =
    "SELECT\n" +
    "	* \n" +
    "FROM\n" +
    "	users\n" +
    "	LEFT JOIN bank ON users.user_id = bank.user_id \n" +
    "WHERE\n" +
    "	users.user_id = ?";
  const sql2 = `                 
                SELECT * 
                FROM
                room
                INNER JOIN domitory ON room.domitory_id = domitory.domitory_id 
                WHERE
                domitory.user_id = ?
              `;

  const sql3 =
    "SELECT\n" +
    "	* \n" +
    "FROM\n" +
    "	domitory\n" +
    "	INNER JOIN domitory_detal ON domitory.domitory_id = domitory_detal.domitory_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ?";

  const sql4 =
    "SELECT\n" +
    "	*,\n" +
    "	deposit.room_id AS dep_room_id,\n" +
    '	DATE_FORMAT( roombill.roombill_date, "%Y-%m-%d %T" ) AS rBill_date,\n' +
    '	DATE_FORMAT( waterbill.water_date, "%Y-%m-%d %T" ) AS wBill_date,\n' +
    '	DATE_FORMAT( powerbill.power_date, "%Y-%m-%d %T" ) AS pBill_date,\n' +
    '	DATE_FORMAT( bill.bill_date, "%Y-%m-%d %T" ) AS bBill_date \n' +
    "FROM\n" +
    "	deposit\n" +
    "	INNER JOIN room ON deposit.room_id = room.room_id\n" +
    "	INNER JOIN users ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN roombill ON roombill.room_id = room.room_id\n" +
    "	LEFT JOIN bill ON bill.roombill_id = roombill.roombill_id\n" +
    "	LEFT JOIN waterbill ON bill.waterbill_id = waterbill.waterbill_id\n" +
    "	LEFT JOIN powerbill ON bill.powerbill_id = powerbill.powerbill_id \n" +
    "WHERE\n" +
    "	deposit.owner_id = ?";

  const sql5 =
    "SELECT\n" +
    "	*,\n" +
    '	DATE_FORMAT( deposit.deposit_date, "%Y-%m-%d %T" ) AS Deposit_date,\n' +
    '	DATE_FORMAT( deposit.deposit_end_date, "%Y-%m-%d %T" ) AS Deposit_end_date \n' +
    "FROM\n" +
    "	deposit\n" +
    "	LEFT JOIN room ON deposit.room_id = room.room_id\n" +
    "	LEFT JOIN users ON deposit.user_id = users.user_id \n" +
    "WHERE\n" +
    "	deposit.room_id = room.room_id \n" +
    "	AND deposit.user_id = users.user_id \n" +
    "	AND role_id = 3 \n" +
    "	AND deposit.deposit_status = 1 \n" +
    "	AND deposit.owner_id = ?";

  const sql6 =
    "SELECT\n" +
    "	*,\n" +
    '	DATE_FORMAT( roombill.roombill_date, "%Y-%m-%d %T" ) AS rBill_date,\n' +
    '	DATE_FORMAT( bill.bill_date, "%Y-%m-%d %T" ) AS bBill_date,\n' +
    '	DATE_FORMAT( waterbill.water_date, "%Y-%m-%d %T" ) AS wBill_date,\n' +
    '	DATE_FORMAT( powerbill.power_date, "%Y-%m-%d %T" ) AS pBill_date \n' +
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
    "	domitory.user_id = ?";
  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log("--- ข้อมูลผู้ใช้งาน>", result);
    dataUser = result;
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
    // console.log("--- ข้อมูลการมัดจำ  _  ผู้เช่าหอ_  ห้องพัก_  ค่าไฟ_  ค่าน้ำ_   ค่าห้อง   --->", result);
    dataDeposit_users_room = result;
  });

  await connecDB.query(sql5, [req.session.user_id]).then(([result]) => {
    // console.log("--- ข้อมูลการมัดจำ  _  ผู้เช่าหอ_  ห้องพัก_  ค่าไฟ_  ค่าน้ำ_   ค่าห้อง   --->", result);
    dataDeposit = result;
  });

  await connecDB.query(sql6, [req.session.user_id]).then(([result]) => {
    // console.log("--- ข้อมูลบิล   --->", result);
    dataBill = result;
  });

  res.render("viewOwner/billManagement", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    dataUser: dataUser,
    dataRoom: dataRoom,
    dataDomitory: dataDomitory,
    dataDeposit_users_room: dataDeposit_users_room,
    dataDeposit: dataDeposit,
    dataBill: dataBill,
    route: "billManagement",
  });
});

route.get("/payment", Checklogin, async (req, res) => {
  let dataUser;
  let dataPayment_bill;
  let dataPayment_repair;
  const sql = "SELECT  *  FROM users WHERE user_id = ?";

  const sql2 =
    "SELECT\n" +
    "	*,\n" +
    '	DATE_FORMAT( payment_bill.paymentBill_date, "%Y-%m-%d %T" ) AS pPaymentBill_date,\n' +
    "	payment_bill.user_id as USER_ID \n" +
    "FROM\n" +
    "	payment_bill\n" +
    "	LEFT JOIN users ON payment_bill.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ? \n" +
    "ORDER BY\n" +
    "	payment_bill.paymentBill_date";

  const sql3 =
    "SELECT\n" +
    "	*,\n" +
    '	DATE_FORMAT( payment_repair.paymentRepair_date, "%Y-%m-%d %T" ) AS pPaymentRepair_date,\n' +
    "	payment_repair.user_id AS USER_ID \n" +
    "FROM\n" +
    "	payment_repair\n" +
    "	LEFT JOIN users ON payment_repair.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ? \n" +
    "ORDER BY\n" +
    "	payment_repair.paymentRepair_date";

  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log(result[0].firstname);
    dataUser = result;
  });
  await connecDB.query(sql2, [req.session.user_id]).then(([result]) => {
    // console.log("--------------ข้อมูลการชำระเงินบิล", result);
    dataPayment_bill = result;
  });
  await connecDB.query(sql3, [req.session.user_id]).then(([result]) => {
    // console.log("--------------ข้อมูลการชำระเงินแจ้งซ่อม", result);
    dataPayment_repair = result;
  });
  res.render("viewOwner/payment", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    datauser: dataUser,
    dataPayment_bill: dataPayment_bill,
    dataPayment_repair: dataPayment_repair,
    route: "payment",
  });
});

route.get("/repairManagement", Checklogin, async (req, res) => {
  let dataUser;
  let dataRepair;
  const sql = "SELECT  *  FROM users WHERE user_id = ?";

  const sql2 =
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
    "	domitory.user_id = ?";

  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------ข้อมูลผู้ใช้งาน", result);
    dataUser = result[0];
  });
  await connecDB.query(sql2, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------ข้อมูลการแจ้งซ่อมของแต่ละหอ", result);
    dataRepair = result;
  });
  res.render("viewOwner/repairManagement", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    dataUser: dataUser,
    dataRepair: dataRepair,
    route: "repairManagement",
  });
});

route.get("/profile", Checklogin, async (req, res) => {
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
  res.render("viewOwner/profile", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    dataUser: dataUser,
    route: "profile",
  });
});

route.get("/ownerDashbord", Checklogin, async (req, res) => {
  let dataUser;
  let dataCountuser;
  let dataDeposit;
  let CountEmptyAll_room;
  let CountDay_room;
  let CountMonth_room;
  let CountYear_room;
  let CountDay_users;
  let CountMonth_users;
  let CountYear_users;
  let CountAll_repair;
  let CountDay_repair;
  let CountMonth_repair;
  let CountYear_repair;
  let CountAll_paymentrepair;
  let CountDay_paymentrepair;
  let CountMonth_paymentrepair;
  let CountYear_paymentrepair;
  let CountAll_paymentbill;
  let CountDay_paymentbill;
  let CountMonth_paymentbill;
  let CountYear_paymentbill;
  let SumAll_deposit;
  let SumDay_deposit;
  let SumMonth_deposit;
  let SumYear_deposit;
  let SumAll_paymentbillprice;
  let SumDay_paymentbillprice;
  let SumMonth_paymentbillprice;
  let SumYear_paymentbillprice;
  let SumAll_paymentrepairprice;
  let SumDay_paymentrepairprice;
  let SumMonth_paymentrepairprice;
  let SumYear_paymentrepairprice;
  const sql =
    "SELECT\n" +
    "	* ,\n" +
    "	users.user_id as USER_ID\n" +
    "FROM\n" +
    "	`users`\n" +
    "	LEFT JOIN bank ON users.user_id = bank.user_id \n" +
    "WHERE\n" +
    "	users.user_id = ?";
  const sql2 =
    "SELECT\n" +
    "	COUNT( users.user_id ) AS Count_users_role_3 \n" +
    "FROM\n" +
    "	`users` \n" +
    "WHERE\n" +
    "	users.role_id = 3 \n" +
    "	AND users.owner_id = ?";

  const sql3 =
    "SELECT\n" +
    "	COUNT( room.room_id ) AS CountRoomEmty \n" +
    "FROM\n" +
    "	room\n" +
    "	LEFT JOIN domitory ON domitory.domitory_id = room.domitory_id \n" +
    "WHERE\n" +
    "	room.room_status = 0 \n" +
    "	AND domitory.user_id =? ";

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  var dateDay = yyyy + "-" + mm + "-" + dd;
  const sql4 =
    "SELECT\n" +
    "	COUNT( room.room_id ) AS CountRoomEmty \n" +
    "FROM\n" +
    "	room\n" +
    "	LEFT JOIN domitory ON domitory.domitory_id = room.domitory_id \n" +
    "WHERE\n" +
    "	room.room_status = 0 \n" +
    "	AND domitory.user_id = ? \n" +
    "	AND DATE( room.room_date ) = ?";

  const sql5 =
    "SELECT\n" +
    "	COUNT( room.room_id ) AS CountRoomEmty \n" +
    "FROM\n" +
    "	room\n" +
    "	LEFT JOIN domitory ON domitory.domitory_id = room.domitory_id \n" +
    "WHERE\n" +
    "	room.room_status = 0 \n" +
    "	AND domitory.user_id = ? \n" +
    "	AND MONTH( room.room_date ) = ?\n" +
    "	AND YEAR(room.room_date) = ?";

  const sql6 =
    "SELECT\n" +
    "	COUNT( room.room_id ) AS CountRoomEmty \n" +
    "FROM\n" +
    "	room\n" +
    "	LEFT JOIN domitory ON domitory.domitory_id = room.domitory_id \n" +
    "WHERE\n" +
    "	room.room_status = 0 \n" +
    "	AND domitory.user_id = ? \n" +
    "	and YEAR(room.room_date) = ?";

  const sql7 =
    "SELECT\n" +
    "	*,\n" +
    '	DATE_FORMAT( deposit.deposit_date, "%Y-%m-%d-%T" ) AS Deposit_date,\n' +
    '	DATE_FORMAT( deposit.deposit_end_date, "%Y-%m-%d-%T" ) AS Deposit_end_date \n' +
    "FROM\n" +
    "	deposit\n" +
    "	LEFT JOIN room ON deposit.room_id = room.room_id\n" +
    "	LEFT JOIN users ON deposit.user_id = users.user_id \n" +
    "WHERE\n" +
    "	deposit.room_id = room.room_id \n" +
    "	AND deposit.user_id = users.user_id \n" +
    "	AND role_id = 3 \n" +
    "	AND deposit.deposit_status = 1 \n" +
    "	AND deposit.owner_id = ?";

  const sql8 =
    "SELECT\n" +
    "	COUNT( users.user_id ) AS Count_users_role_3 \n" +
    "FROM\n" +
    "	`users` \n" +
    "WHERE\n" +
    "	users.role_id = 3 \n" +
    "	AND users.owner_id = ?\n" +
    "	AND DATE(users.user_Indate) = ?";

  const sql9 =
    "SELECT\n" +
    "	COUNT( users.user_id ) AS Count_users_role_3 \n" +
    "FROM\n" +
    "	`users` \n" +
    "WHERE\n" +
    "	users.role_id = 3 \n" +
    "	AND users.owner_id = ? \n" +
    "	AND MONTH ( users.user_Indate ) = ? \n" +
    "	AND YEAR ( users.user_Indate ) = ?";

  const sql10 =
    "SELECT\n" +
    "	COUNT( users.user_id ) AS Count_users_role_3 \n" +
    "FROM\n" +
    "	`users` \n" +
    "WHERE\n" +
    "	users.role_id = 3 \n" +
    "	AND users.owner_id = ? \n" +
    "	AND YEAR ( users.user_Indate ) = ?";

  const sql11 =
    "SELECT\n" +
    "	COUNT(`repair`.repair_id) as CountRepair\n" +
    "FROM\n" +
    "	`repair`\n" +
    "	LEFT JOIN room ON room.room_id = REPAIR.room_id\n" +
    "	LEFT JOIN domitory ON room.domitory_id = domitory.domitory_id\n" +
    "	LEFT JOIN users ON REPAIR.user_id = users.user_id\n" +
    "WHERE\n" +
    "	domitory.user_id = ?";

  const sql12 =
    "SELECT\n" +
    "	COUNT(`repair`.repair_id) as CountRepair\n" +
    "FROM\n" +
    "	`repair`\n" +
    "	LEFT JOIN room ON room.room_id = REPAIR.room_id\n" +
    "	LEFT JOIN domitory ON room.domitory_id = domitory.domitory_id\n" +
    "	LEFT JOIN users ON REPAIR.user_id = users.user_id\n" +
    "WHERE\n" +
    "	domitory.user_id = ?\n" +
    "	and DATE(`repair`.repair_date) = ?";
  const sql13 =
    "SELECT\n" +
    "	COUNT(`repair`.repair_id) as CountRepair\n" +
    "FROM\n" +
    "	`repair`\n" +
    "	LEFT JOIN room ON room.room_id = REPAIR.room_id\n" +
    "	LEFT JOIN domitory ON room.domitory_id = domitory.domitory_id\n" +
    "	LEFT JOIN users ON REPAIR.user_id = users.user_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ? \n" +
    "	AND MONTH ( `repair`.repair_date ) = ? \n" +
    "	AND YEAR ( `repair`.repair_date ) = ?";

  const sql14 =
    "SELECT\n" +
    "	COUNT(`repair`.repair_id) as CountRepair\n" +
    "FROM\n" +
    "	`repair`\n" +
    "	LEFT JOIN room ON room.room_id = REPAIR.room_id\n" +
    "	LEFT JOIN domitory ON room.domitory_id = domitory.domitory_id\n" +
    "	LEFT JOIN users ON REPAIR.user_id = users.user_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ? \n" +
    "	AND YEAR ( `repair`.repair_date ) = ?";
  const sql15 =
    "SELECT\n" +
    "	COUNT( payment_repair.paymentRepair_id ) AS CountPayment_repair \n" +
    "FROM\n" +
    "	payment_repair\n" +
    "	LEFT JOIN users ON payment_repair.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ? ";
  const sql16 =
    "SELECT\n" +
    "	COUNT( payment_repair.paymentRepair_id ) AS CountPayment_repair \n" +
    "FROM\n" +
    "	payment_repair\n" +
    "	LEFT JOIN users ON payment_repair.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ? \n" +
    "	AND DATE( payment_repair.paymentRepair_date ) = ?";
  const sql17 =
    "SELECT\n" +
    "	COUNT( payment_repair.paymentRepair_id ) AS CountPayment_repair \n" +
    "FROM\n" +
    "	payment_repair\n" +
    "	LEFT JOIN users ON payment_repair.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ? \n" +
    "	AND MONTH ( payment_repair.paymentRepair_date ) = ? \n" +
    "	AND YEAR ( payment_repair.paymentRepair_date ) = ?";
  const sql18 =
    "SELECT\n" +
    "	COUNT( payment_repair.paymentRepair_id ) AS CountPayment_repair \n" +
    "FROM\n" +
    "	payment_repair\n" +
    "	LEFT JOIN users ON payment_repair.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ? \n" +
    "	AND YEAR ( payment_repair.paymentRepair_date ) = ?";
  const sql19 =
    "SELECT\n" +
    "	COUNT( payment_bill.paymentBill_id ) AS CountPayment_Bill\n" +
    "FROM\n" +
    "	payment_bill\n" +
    "	LEFT JOIN users ON payment_bill.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ? ";
  const sql20 =
    "SELECT\n" +
    "	COUNT( payment_bill.paymentBill_id ) AS CountPayment_Bill\n" +
    "FROM\n" +
    "	payment_bill\n" +
    "	LEFT JOIN users ON payment_bill.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ? \n" +
    "	AND DATE( payment_bill.paymentBill_date ) = ?";
  const sql21 =
    "SELECT\n" +
    "	COUNT( payment_bill.paymentBill_id ) AS CountPayment_Bill\n" +
    "FROM\n" +
    "	payment_bill\n" +
    "	LEFT JOIN users ON payment_bill.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ? \n" +
    "	AND MONTH ( payment_bill.paymentBill_date ) = ? \n" +
    "	AND YEAR ( payment_bill.paymentBill_date ) = ?";
  const sql22 =
    "SELECT\n" +
    "	COUNT( payment_bill.paymentBill_id ) AS CountPayment_Bill\n" +
    "FROM\n" +
    "	payment_bill\n" +
    "	LEFT JOIN users ON payment_bill.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	domitory.user_id = ? \n" +
    "	AND YEAR ( payment_bill.paymentBill_date ) = ?";

  const sql23 =
    "SELECT\n" +
    "	Sum( deposit.deposit_price ) AS SumDepositPrice \n" +
    "FROM\n" +
    "	deposit\n" +
    "	LEFT JOIN room ON deposit.room_id = room.room_id\n" +
    "	LEFT JOIN users ON deposit.user_id = users.user_id \n" +
    "WHERE\n" +
    "	deposit.room_id = room.room_id \n" +
    "	AND deposit.user_id = users.user_id \n" +
    "	AND deposit.owner_id = ?";
  const sql24 =
    "SELECT\n" +
    "	sum( payment_bill.paymentBill_price ) AS SumPaymentbillPrice \n" +
    "FROM\n" +
    "	payment_bill\n" +
    "	LEFT JOIN users ON payment_bill.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	payment_bill.paymentBill_status = 1 \n" +
    "	AND domitory.user_id = ?";
  const sql25 =
    "SELECT\n" +
    "	sum( payment_repair.paymentRepair_price ) AS SumPaymentrepairPrice \n" +
    "FROM\n" +
    "	payment_repair\n" +
    "	LEFT JOIN users ON payment_repair.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	payment_repair.paymentRepair_status = 1 \n" +
    "	AND domitory.user_id = ?";
  const sql26 =
    "SELECT\n" +
    "	Sum( deposit.deposit_price ) AS SumDepositPrice \n" +
    "FROM\n" +
    "	deposit\n" +
    "	LEFT JOIN room ON deposit.room_id = room.room_id\n" +
    "	LEFT JOIN users ON deposit.user_id = users.user_id \n" +
    "WHERE\n" +
    "	deposit.room_id = room.room_id \n" +
    "	AND deposit.user_id = users.user_id \n" +
    "	AND deposit.owner_id = ? \n" +
    "	AND date( deposit.deposit_date ) = ?";
  const sql27 =
    "SELECT\n" +
    "	sum( payment_bill.paymentBill_price ) AS SumPaymentbillPrice \n" +
    "FROM\n" +
    "	payment_bill\n" +
    "	LEFT JOIN users ON payment_bill.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	payment_bill.paymentBill_status = 1 \n" +
    "	AND domitory.user_id = ?\n" +
    "	AND DATE( payment_bill.paymentBill_date ) = ?";

  const sql28 =
    "SELECT\n" +
    "	sum( payment_repair.paymentRepair_price ) AS SumPaymentrepairPrice \n" +
    "FROM\n" +
    "	payment_repair\n" +
    "	LEFT JOIN users ON payment_repair.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	payment_repair.paymentRepair_status = 1 \n" +
    "	AND domitory.user_id = ?\n" +
    "	AND DATE( payment_repair.paymentRepair_date ) = ?";
  const sql29 =
    "SELECT\n" +
    "	Sum( deposit.deposit_price ) AS SumDepositPrice \n" +
    "FROM\n" +
    "	deposit\n" +
    "	LEFT JOIN room ON deposit.room_id = room.room_id\n" +
    "	LEFT JOIN users ON deposit.user_id = users.user_id \n" +
    "WHERE\n" +
    "	deposit.room_id = room.room_id \n" +
    "	AND deposit.user_id = users.user_id \n" +
    "	AND deposit.owner_id = ? \n" +
    "	AND MONTH ( deposit.deposit_date ) = ? \n" +
    "	AND YEAR ( deposit.deposit_date ) = ?";
  const sql30 =
    "SELECT\n" +
    "	sum( payment_bill.paymentBill_price ) AS SumPaymentbillPrice \n" +
    "FROM\n" +
    "	payment_bill\n" +
    "	LEFT JOIN users ON payment_bill.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	payment_bill.paymentBill_status = 1 \n" +
    "	AND domitory.user_id = ? \n" +
    "	AND MONTH ( payment_bill.paymentBill_date ) = ? \n" +
    "	AND YEAR ( payment_bill.paymentBill_date ) = ?";
  const sql31 =
    "SELECT\n" +
    "	sum( payment_repair.paymentRepair_price ) AS SumPaymentrepairPrice \n" +
    "FROM\n" +
    "	payment_repair\n" +
    "	LEFT JOIN users ON payment_repair.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	payment_repair.paymentRepair_status = 1 \n" +
    "	AND domitory.user_id = ? \n" +
    "	AND MONTH ( payment_repair.paymentRepair_date ) = ? \n" +
    "	AND YEAR ( payment_repair.paymentRepair_date ) = ?";
  const sql32 =
    "SELECT\n" +
    "	Sum( deposit.deposit_price ) AS SumDepositPrice \n" +
    "FROM\n" +
    "	deposit\n" +
    "	LEFT JOIN room ON deposit.room_id = room.room_id\n" +
    "	LEFT JOIN users ON deposit.user_id = users.user_id \n" +
    "WHERE\n" +
    "	deposit.room_id = room.room_id \n" +
    "	AND deposit.user_id = users.user_id \n" +
    "	AND deposit.owner_id = ? \n" +
    "	AND YEAR ( deposit.deposit_date ) = ?";
  const sql33 =
    "SELECT\n" +
    "	sum( payment_bill.paymentBill_price ) AS SumPaymentbillPrice \n" +
    "FROM\n" +
    "	payment_bill\n" +
    "	LEFT JOIN users ON payment_bill.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	payment_bill.paymentBill_status = 1 \n" +
    "	AND domitory.user_id = ?\n" +
    "	AND YEAR ( payment_bill.paymentBill_date ) = ?";
  const sql34 =
    "SELECT\n" +
    "	sum( payment_repair.paymentRepair_price ) AS SumPaymentrepairPrice \n" +
    "FROM\n" +
    "	payment_repair\n" +
    "	LEFT JOIN users ON payment_repair.user_id = users.user_id\n" +
    "	LEFT JOIN deposit ON deposit.user_id = users.user_id\n" +
    "	LEFT JOIN room ON room.room_id = deposit.room_id\n" +
    "	LEFT JOIN domitory ON domitory.user_id = deposit.owner_id \n" +
    "WHERE\n" +
    "	payment_repair.paymentRepair_status = 1 \n" +
    "	AND domitory.user_id = ?\n" +
    "	AND YEAR ( payment_repair.paymentRepair_date ) = ?";
  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------ข้อมูลผู้ใช้งาน", result);
    dataUser = result[0];
  });
  await connecDB.query(sql2, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------จำนวนผู้เช่าทั้งหมด", result);
    dataCountuser = result;
  });
  await connecDB.query(sql3, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------จำนวนห้องว่างทั้งหมด", result);
    CountEmptyAll_room = result;
  });
  await connecDB
    .query(sql4, [req.session.user_id, dateDay])
    .then(([result]) => {
      // console.log("-----------------ห้องว่างวันนี้", result);
      CountDay_room = result;
    });
  await connecDB
    .query(sql5, [req.session.user_id, mm, yyyy])
    .then(([result]) => {
      // console.log("-----------------ห้องว่างเดือนนี้", result);
      CountMonth_room = result;
    });
  await connecDB.query(sql6, [req.session.user_id, yyyy]).then(([result]) => {
    // console.log("-----------------ห้องว่างปีนี้", result);
    CountYear_room = result;
  });
  await connecDB.query(sql7, [req.session.user_id]).then(([result]) => {
    // console.log("------------------ข้อมูลการเช่า", result);
    dataDeposit = result;
  });
  await connecDB
    .query(sql8, [req.session.user_id, dateDay])
    .then(([result]) => {
      // console.log("-----------------ผู้เช่าที่เพิ่มวันนี้", result);
      CountDay_users = result;
    });
  await connecDB
    .query(sql9, [req.session.user_id, mm, yyyy])
    .then(([result]) => {
      // console.log("-----------------ผู้เช่าที่เพิ่มในเดือนนี้", result);
      CountMonth_users = result;
    });
  await connecDB.query(sql10, [req.session.user_id, yyyy]).then(([result]) => {
    // console.log("-----------------ผู้เช่าที่เพิ่มในปีนี้", result);
    CountYear_users = result;
  });
  await connecDB.query(sql11, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------จำนวนการแจ้งซ่อมทั้งหมด", result);
    CountAll_repair = result;
  });
  await connecDB
    .query(sql12, [req.session.user_id, dateDay])
    .then(([result]) => {
      // console.log("-----------------จำนวนการแจ้งซ่อมวันนี้", result);
      CountDay_repair = result;
    });
  await connecDB
    .query(sql13, [req.session.user_id, mm, yyyy])
    .then(([result]) => {
      // console.log("-----------------จำนวนการแจ้งซ่อมในเดือนนี้", result);
      CountMonth_repair = result;
    });
  await connecDB.query(sql14, [req.session.user_id, yyyy]).then(([result]) => {
    // console.log("-----------------จำนวนการแจ้งซ่อมในปีนี้", result);
    CountYear_repair = result;
  });
  await connecDB.query(sql15, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------จำนวนการชำระเงินแจ้งซ่อมทั้งหมด", result);
    CountAll_paymentrepair = result;
  });
  await connecDB
    .query(sql16, [req.session.user_id, dateDay])
    .then(([result]) => {
      // console.log("-----------------จำนวนการชำระเงินแจ้งซ่อมวันนี้", result);
      CountDay_paymentrepair = result;
    });
  await connecDB
    .query(sql17, [req.session.user_id, mm, yyyy])
    .then(([result]) => {
      // console.log(
      //   "-----------------จำนวนการชำระเงินแจ้งซ่อมในเดือนนี้",
      //   result
      // );
      CountMonth_paymentrepair = result;
    });
  await connecDB.query(sql18, [req.session.user_id, yyyy]).then(([result]) => {
    // console.log("-----------------จำนวนการชำระเงินแจ้งซ่อมในปีนี้", result);
    CountYear_paymentrepair = result;
  });
  await connecDB.query(sql19, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------จำนวนการชำระเงินบิลทั้งหมด", result);
    CountAll_paymentbill = result;
  });
  await connecDB
    .query(sql20, [req.session.user_id, dateDay])
    .then(([result]) => {
      // console.log("-----------------จำนวนการชำระเงินบิลวันนี้", result);
      CountDay_paymentbill = result;
    });
  await connecDB
    .query(sql21, [req.session.user_id, mm, yyyy])
    .then(([result]) => {
      // console.log("-----------------จำนวนการชำระเงินบิลในเดือนนี้", result);
      CountMonth_paymentbill = result;
    });
  await connecDB.query(sql22, [req.session.user_id, yyyy]).then(([result]) => {
    // console.log("-----------------จำนวนการชำระเงินบิลในปีนี้", result);
    CountYear_paymentbill = result;
  });
  await connecDB.query(sql23, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------จำนวนเงินทั้งหมดของการเช่า", result);
    SumAll_deposit = result;
  });
  await connecDB.query(sql24, [req.session.user_id]).then(([result]) => {
    // console.log("-----------------จำนวนเงินทั้งหมดของการชำระบิล", result);
    SumAll_paymentbillprice = result;
  });
  await connecDB.query(sql25, [req.session.user_id]).then(([result]) => {
    // console.log(
    //   "-----------------จำนวนเงินทั้งหมดของการชำระค่าอุปกรณ์",
    //   result
    // );
    SumAll_paymentrepairprice = result;
  });
  var sumPriceAll =
    parseFloat(SumAll_deposit[0].SumDepositPrice ?? 0) +
    parseFloat(SumAll_paymentbillprice[0].SumPaymentbillPrice ?? 0) +
    parseFloat(SumAll_paymentrepairprice[0].SumPaymentrepairPrice ?? 0);

  await connecDB
    .query(sql26, [req.session.user_id, dateDay])
    .then(([result]) => {
      // console.log("-----------------จำนวนเงินการเช่าของวันนี้", result);
      SumDay_deposit = result;
    });
  await connecDB
    .query(sql27, [req.session.user_id, dateDay])
    .then(([result]) => {
      // console.log("-----------------จำนวนเงินการชำระบิลของวันนี้", result);
      SumDay_paymentbillprice = result;
    });
  await connecDB
    .query(sql28, [req.session.user_id, dateDay])
    .then(([result]) => {
      // console.log(
      //   "-----------------จำนวนเงินการชำระบิลค่าซ่อมของวันนี้",
      //   result
      // );
      SumDay_paymentrepairprice = result;
    });
  var SumPriceDay =
    parseFloat(SumDay_deposit[0].SumDepositPrice ?? 0) +
    parseFloat(SumDay_paymentbillprice[0].SumPaymentbillPrice ?? 0) +
    parseFloat(SumDay_paymentrepairprice[0].SumPaymentrepairPrice ?? 0);

  await connecDB
    .query(sql29, [req.session.user_id, mm, yyyy])
    .then(([result]) => {
      // console.log("-----------------จำนวนการชำระเงินบิลในเดือนนี้", result);
      SumMonth_deposit = result;
    });
  await connecDB
    .query(sql30, [req.session.user_id, mm, yyyy])
    .then(([result]) => {
      // console.log("-----------------จำนวนการชำระเงินบิลในเดือนนี้", result);
      SumMonth_paymentbillprice = result;
    });
  await connecDB
    .query(sql31, [req.session.user_id, mm, yyyy])
    .then(([result]) => {
      // console.log("-----------------จำนวนการชำระเงินบิลในเดือนนี้", result);
      SumMonth_paymentrepairprice = result;
    });
  var SumPriceMonth =
    parseFloat(SumMonth_deposit[0].SumDepositPrice ?? 0) +
    parseFloat(SumMonth_paymentbillprice[0].SumPaymentbillPrice ?? 0) +
    parseFloat(SumMonth_paymentrepairprice[0].SumPaymentrepairPrice ?? 0);

  await connecDB.query(sql32, [req.session.user_id, yyyy]).then(([result]) => {
    // console.log("-----------------จำนวนการชำระเงินบิลในปีนี้", result);
    SumYear_deposit = result;
  });
  await connecDB.query(sql33, [req.session.user_id, yyyy]).then(([result]) => {
    // console.log("-----------------จำนวนการชำระเงินบิลในปีนี้", result);
    SumYear_paymentbillprice = result;
  });
  await connecDB.query(sql34, [req.session.user_id, yyyy]).then(([result]) => {
    // console.log("-----------------จำนวนการชำระเงินบิลในปีนี้", result);
    SumYear_paymentrepairprice = result;
  });
  var SumPriceYear =
    parseFloat(SumYear_deposit[0].SumDepositPrice ?? 0) +
    parseFloat(SumYear_paymentbillprice[0].SumPaymentbillPrice ?? 0) +
    parseFloat(SumYear_paymentrepairprice[0].SumPaymentrepairPrice ?? 0);
  res.render("viewOwner/ownerDashbord", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    dataUser: dataUser,
    dataCountuser: dataCountuser,
    dataDeposit: dataDeposit,
    CountEmptyAll_room: CountEmptyAll_room,
    CountDay_room: CountDay_room,
    CountMonth_room: CountMonth_room,
    CountYear_room: CountYear_room,
    CountDay_users: CountDay_users,
    CountMonth_users: CountMonth_users,
    CountYear_users: CountYear_users,
    CountAll_repair: CountAll_repair,
    CountDay_repair: CountDay_repair,
    CountMonth_repair: CountMonth_repair,
    CountYear_repair: CountYear_repair,
    CountAll_paymentrepair: CountAll_paymentrepair,
    CountDay_paymentrepair: CountDay_paymentrepair,
    CountMonth_paymentrepair: CountMonth_paymentrepair,
    CountYear_paymentrepair: CountYear_paymentrepair,
    CountAll_paymentbill: CountAll_paymentbill,
    CountDay_paymentbill: CountDay_paymentbill,
    CountMonth_paymentbill: CountMonth_paymentbill,
    CountYear_paymentbill: CountYear_paymentbill,
    sumPriceAll: sumPriceAll,
    SumPriceDay: SumPriceDay,
    SumPriceMonth: SumPriceMonth,
    SumPriceYear: SumPriceYear,
    route: "ownerDashbord",
  });
});

module.exports = route;
