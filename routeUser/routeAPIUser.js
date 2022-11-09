const express = require("express");
const Connection = require("../configDB/configDB");
const route = express.Router();
const path = require("path");
const fs = require("fs");

// -----------------------------------------บันทึกการชำระเงิน---------------------------------------------------------
route.post("/AddPay", async (req, res) => {
  try {
    const {
      paymentBill_type,
      paymentBill_price,
      paymentbilldate,
      user_id,
      bill_id,
    } = req.body;

    const fileType = path.extname(req.body.filename);
    // console.log(fileType)
    let newFilename =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    newFilename = newFilename + fileType;

    var pathUP = path.join("public/images_bill/" + newFilename);
    // console.log(pathUP);

    var image = req.body.file;
    var data = image.split(",")[1];
    fs.writeFileSync(pathUP, data, { encoding: "base64" });
    var temp = fs.readFileSync(pathUP);
    var buff = new Buffer(temp);
    var base64data = buff.toString("base64");

    let sql = `INSERT INTO payment_bill(user_id,bill_id,paymentBill_type,paymentBill_price,paymentBill_image,paymentBill_date,paymentBill_status) 
        VALUES (?,?,?,?,?,?,?)`;
    Connection.execute(sql, [
      user_id,
      bill_id,
      paymentBill_type,
      paymentBill_price,
      newFilename,
      paymentbilldate,
      0,
    ]).then(async () => {
      let sql2 =
        "UPDATE bill \n" + "SET bill_status = 1 \n" + "WHERE\n" + "	bill_id = ?";
      const Data = await Connection.execute(sql2, [bill_id]);
      // console.log(Data[0].insertId);
      if (Data[0].insertId != undefined) {
        res.status(200).send({ message: "success" });
      } else {
        res.status(500).send({ message: "error" });
      }
    });
  } catch (error) {
    res.status(500).send({ message: "error" });
  }
});

// -----------------------------------------บันทึกการแจ้งซ่อม---------------------------------------------------------
route.post("/AddRepair", async (req, res) => {
  try {
    const { UserID, Room_ID, Repair_name, Repair_detal, repairdate } = req.body;

    const fileType = path.extname(req.body.filename);
    // console.log(fileType)
    let newFilename =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    newFilename = newFilename + fileType;

    var pathUP = path.join("public/images_repair/" + newFilename);
    // console.log(pathUP);

    var image = req.body.file;
    var data = image.split(",")[1];
    fs.writeFileSync(pathUP, data, { encoding: "base64" });
    var temp = fs.readFileSync(pathUP);
    var buff = Buffer(temp);
    var base64data = buff.toString("base64");

    let sql = `INSERT INTO repair(user_id,room_id,repair_name,repair_detal,repair_image,repair_date,repair_status) 
        VALUES (?,?,?,?,?,?,?)`;
    const Data = await Connection.execute(sql, [
      UserID,
      Room_ID,
      Repair_name,
      Repair_detal,
      newFilename,
      repairdate,
      0,
    ]);
    if (Data[0].insertId != undefined) {
      res.status(200).send({ message: "success" });
    } else {
      res.status(500).send({ message: "error" });
    }
  } catch (error) {
    res.status(500).send({ message: "error" });
  }
});

// -----------------------------------------ยกเลิกการแจ้งซ่อม---------------------------------------------------------
route.post("/UpdateStatus_Repair/", async (req, res) => {
  const repair_id = req.body.repair_id;
  // console.log(user_status);
  let sql = `UPDATE repair SET repair_status = 3 WHERE repair_id =?`;
  // console.log(sql);
  const updateStatus = await Connection.execute(sql, [repair_id]);
  // console.log(updateStatus);
  res.status(200).send({
    message: "UpdateStatus_Repair",
  });
});

// -----------------------------------------บันทึกการชำระเงินของการแจ้งซ่อม---------------------------------------------------------
route.post("/AddPayRepair", async (req, res) => {
  try {
    const {
      paymentRepair_type,
      paymentRepairdate,
      paymentRepair_price,
      user_id,
      repair_id,
    } = req.body;

    const fileType = path.extname(req.body.filename);
    // console.log(fileType)
    let newFilename =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    newFilename = newFilename + fileType;

    var pathUP = path.join("public/images_bill/" + newFilename);
    // console.log(pathUP);

    var image = req.body.file;
    var data = image.split(",")[1];
    fs.writeFileSync(pathUP, data, { encoding: "base64" });
    var temp = fs.readFileSync(pathUP);
    var buff = new Buffer(temp);
    var base64data = buff.toString("base64");

    let sql = `INSERT INTO payment_repair(user_id,repair_id,paymentRepair_type,paymentRepair_price,paymentRepair_image,paymentRepair_date,paymentRepair_status) 
        VALUES (?,?,?,?,?,?,?)`;
    Connection.execute(sql, [
      user_id,
      repair_id,
      paymentRepair_type,
      paymentRepair_price,
      newFilename,
      paymentRepairdate,
      0,
    ]).then(async () => {
      let sql2 = `UPDATE repair SET repair_status = 4 WHERE repair_id = ?`;
      const Data = await Connection.execute(sql2, [repair_id]);
      // console.log(Data[0].insertId);
      if (Data[0].insertId != undefined) {
        res.status(200).send({ message: "success" });
      } else {
        res.status(500).send({ message: "error" });
      }
    });
  } catch (error) {
    res.status(500).send({ message: "error" });
  }
});

// -----------------------------------------แก้ไขข้อมูลส่วนตัว---------------------------------------------------------
route.post("/UpdateUser", async (req, res) => {
  try {
    const {
      Firstname,
      Surname,
      username,
      password,
      Email,
      Address,
      Phonenumber,
      UserId,
      Role_id,
    } = req.body;
    // console.log(req.body);

    let findSql1 = "SELECT * FROM users WHERE user_id = ?";
    const [[users]] = await Connection.query(findSql1, [UserId]);
    // console.log(users.username, "==", username);
    if (users.username != username) {
      // console.log(users.username, "!=", username);
      let findSql = "SELECT * FROM users WHERE username =  ?  AND role_id = ? ";
      const [user, resultData] = await Connection.query(findSql, [
        username,
        Role_id,
      ]);
      if (user.length > 0) throw new Error("user_duplicated");
    }

    let sql =
      "UPDATE users SET firstname =  ?,  surname = ? , username = ? , password = ? , user_email = ? , user_address = ? , user_tel = ? WHERE user_id = ? ";
    // console.log(sql);
    const Data = await Connection.execute(sql, [
      Firstname,
      Surname,
      username,
      password,
      Email,
      Address,
      Phonenumber,
      UserId,
    ]);
    // console.log(Data[0].insertId);
    if (Data[0].insertId != undefined) {
      res.status(200).send({ message: "success" });
    } else {
      // console.log("1");
      res.status(500).send({ message: "error" });
    }
  } catch (error) {
    // console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});
module.exports = route;
