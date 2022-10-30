const e = require("express");
const express = require("express");
const Connection = require("../configDB/configDB");
const route = express.Router();
const fs = require("fs");
const path = require("path");

//------------------------------------------------------------------------------------จัดการหอพัก------------------------------------------------------------------//
// -----------------------------------------เพิ่มข้อมูลหอพัก---------------------------------------------------------
route.post("/AddDomitory", async (req, res) => {
  try {
    const {
      Domitory_name,
      Domitory_address,
      Domitory_description,
      User_id,
    } = req.body;

    const fileType = path.extname(req.body.filename);
    let newFilename = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    newFilename = newFilename + fileType;

    var pathUP = path.join("public/images_domitory/" + newFilename);
    console.log(pathUP);

    var image = req.body.file;
    var data = image.split(',')[1];
    fs.writeFileSync(pathUP, data, { encoding: 'base64' });
    var temp = fs.readFileSync(pathUP);
    var buff = new Buffer(temp);
    var base64data = buff.toString('base64');

    let sql = `INSERT INTO domitory(user_id,domitory_name,domitory_address,domitory_description) 
      VALUES (?,?,?,?)`;
    Connection.execute(sql, [
      User_id,
      Domitory_name,
      Domitory_address,
      Domitory_description,
    ]).then(async (result) => {
      let lastID = result[0].insertId;

      let sql2 = `INSERT INTO domitory_detal(domitory_id,domitory_images) VALUES (?,?)`;
      const Data = await Connection.execute(sql2, [lastID, newFilename]);
      console.log(Data[0].insertId);
      if (Data[0].insertId != undefined) {
        res.status(200).send({ message: "success" });
      } else {
        res.status(500).send({ message: error.message });
      }
    });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


//------------------------------------------------------------------------------------จัดการผู้เช่า------------------------------------------------------------------//
// -----------------------------------------เพิ่มข้อมูลผู้เช่าหอ---------------------------------------------------------
route.post("/AddTenant", async (req, res) => {
  try {
    const {
      Firstname,
      Surname,
      username,
      password,
      Email,
      Address,
      Phonenumber,
      owner,
      Role_id,
    } = req.body;
    // console.log(Role_id);
    let findSql = "SELECT * FROM users WHERE username =  ?  AND role_id = 3 ";
    const [user, resultData] = await Connection.query(findSql, [username]);
    if (user.length > 0) throw new Error("user_duplicated");

    let sql = `INSERT INTO users(role_id,firstname,surname,username,password,user_email,user_address,user_tel,user_status,owner_id) 
      VALUES (?,?,?,?,?,?,?,?,?,?)`;
    const Data = await Connection.execute(sql, [
      3,
      Firstname,
      Surname,
      username,
      password,
      Email,
      Address,
      Phonenumber,
      1,
      owner,
    ]);
    
    console.log(Data[0].insertId);
    if (Data[0].insertId != undefined) {
      res.status(200).send({ message: "success" });
    } else {
      res.status(500).send({ message: "error" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// -----------------------------------------แก้ไขข้อมูลผู้เช่าหอ---------------------------------------------------------
route.post("/UpdateTenant", async (req, res) => {
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

    let findSql1 = "SELECT * FROM users WHERE user_id = ?";
    const [[users]] = await Connection.query(findSql1, [UserId]);
    // console.log(users.username, "==", username);
    if (users.username != username) {
      // console.log(users.username, "!=", username);
      let findSql = "SELECT * FROM users WHERE username =  ?  AND role_id = ? ";
      const [user, resultData] = await Connection.query(findSql, [username, Role_id]);
      if (user.length > 0) throw new Error("user_duplicated");

    }
    // console.log(req.body);
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
    // console.log(error);
    res.status(500).send({ message: error.message });
  }
});

// -----------------------------------------ลบข้อมูลผู้เช่าหอ---------------------------------------------------------
route.post("/DeleteTenant/", async (req, res) => {
  const user_id = req.body.user_id;
  // console.log(user_id);
  let sql = `DELETE FROM users WHERE user_id = ?`;
  const DeleteDormowner = await Connection.execute(sql, [user_id]);
  // console.log(DeleteDormowner);
  res.status(200).send({
    message: "DeleteTenant",
  });
});

//------------------------------------------------------------------------------------จัดการห้องพัก------------------------------------------------------------------//
// -----------------------------------------เพิ่มข้อมูลห้องพัก---------------------------------------------------------
route.post("/AddRoom", async (req, res) => {
  try {
    const {
      Room_number,
      Room_price,
      Room_type,
      Domitory_id,
    } = req.body;

    let findSql = "SELECT * FROM room WHERE domitory_id = ? AND room_number = ?";
    const [result, resultData] = await Connection.query(findSql, [Domitory_id, Room_number]);
    if (result.length > 0) throw new Error("duplicated");

    let sql = `INSERT INTO room(domitory_id,room_number,room_type,room_price,room_status) 
      VALUES (?,?,?,?,?)`;
    const Data = await Connection.execute(sql, [
      Domitory_id,
      Room_number,
      Room_type,
      Room_price,
      0,
    ]);
    console.log(Data[0].insertId);
    if (Data[0].insertId != undefined) {
      res.status(200).send({ message: "success" });
    } else {
      res.status(500).send({ message: "error" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// -----------------------------------------แก้ไขข้อมูลห้องพัก---------------------------------------------------------
route.post("/UpdateRoom", async (req, res) => {
  try {
    const {
      Room_number,
      Room_price,
      Room_type,
      Room_id,
    } = req.body;


    let sql =
      "UPDATE room SET room_number =  ?,  room_type = ? , room_price = ?   WHERE room_id = ? ";
    // console.log(sql);
    const Data = await Connection.execute(sql, [
      Room_number,
      Room_type,
      Room_price,
      Room_id,
    ]);
    // console.log(Data[0].insertId);
    if (Data[0].insertId != undefined) {
      res.status(200).send({ message: "success" });
    } else {
      // console.log("1");
      res.status(500).send({ message: "error" });
    }
  } catch (error) {
    // console.log(error);
    res.status(500).send({ message: "error" });
  }
});

// -----------------------------------------ลบข้อมูลห้องพัก---------------------------------------------------------
route.post("/DeleteRoom/", async (req, res) => {
  const room_id = req.body.room_id;
  // console.log(room_id);
  let sql = `DELETE FROM room WHERE room_id = ?`;
  const DeleteRoom = await Connection.execute(sql, [room_id]);
  // console.log(DeleteRoom);
  res.status(200).send({
    message: "DeleteRoom",
  });
});


//------------------------------------------------------------------------------------จัดการมัดจำหอ------------------------------------------------------------------//
// -----------------------------------------เพิ่มข้อมูลการมัดจำหอ และปรับ statusของ table room เป็น 1---------------------------------------------------------
route.post("/AddDeposit", async (req, res) => {
  try {
    const {
      RoomID,
      TenantID,
      owner_id,
      Deposit_Price,
      deposit_start_date,
      deposit_end_date,
    } = req.body;

    let findSql = "SELECT * FROM deposit WHERE room_id = ? AND user_id = ?";
    const [result, resultData] = await Connection.query(findSql, [RoomID, TenantID]);
    if (result.length > 0) throw new Error("duplicated");

    const [room, resultData2] = await Connection.query("SELECT * FROM deposit WHERE room_id = ?", [RoomID]);
    if (room.length > 0) throw new Error("room_not_empty");

    let sql = `INSERT INTO deposit(room_id,user_id,owner_id,deposit_price,deposit_date,deposit_end_date,deposit_status) 
      VALUES (?,?,?,?,?,?,?)`;
    Connection.execute(sql, [
      RoomID,
      TenantID,
      owner_id,
      Deposit_Price,
      deposit_start_date,
      deposit_end_date,
      1,
    ]).then(async () => {
      const sqlUpdateRoomStatus = `UPDATE room SET room_status = 1 WHERE room_id = ?`
      const data = await Connection.execute(sqlUpdateRoomStatus, [RoomID]);
      // console.log(data[0].insertId);
      if (data[0].insertId != undefined) {
        res.status(200).send({ message: "success" });
      } else {
        res.status(500).send({ message: "error" });

      }
    });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


// -----------------------------------------แก้ไขข้อมูลการมัดจำ เวลาการมัดจำ---------------------------------------------------------
route.post("/UpdateDeposit", async (req, res) => {
  try {
    const {
      RoomID,
      TenantID,
      Deposit_Price,
      deposit_start_date,
      deposit_end_date,
      UserId,
    } = req.body;

    // let findSql = "SELECT * FROM deposit WHERE room_id = ? AND user_id = ?";

    let sql =
      "UPDATE deposit SET room_id =  ?,  user_id = ? , deposit_price = ? , deposit_date = ? , deposit_end_date = ?  WHERE user_id = ? ";
    // console.log(sql);
    const Data = await Connection.execute(sql, [
      RoomID,
      TenantID,
      Deposit_Price,
      deposit_start_date,
      deposit_end_date,
      UserId,
    ]);
    // console.log(Data[0].insertId);
    if (Data[0].insertId != undefined) {
      res.status(200).send({ message: "success" });
    } else {
      console.log("1");
      res.status(500).send({ message: "error" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "error" });
  }
});

// -----------------------------------------ลบข้อมูลการมัดจำและปรับ ห้องให้ว่าง---------------------------------------------------------
route.post("/DeleteDeposit/", async (req, res) => {
  const deposit_id = req.body.deposit_id;
  const RoomID = req.body.room_id;
  // console.log("----------", deposit_id);
  // console.log("----------", RoomID);
  let sql = `DELETE FROM deposit WHERE deposit_id = ?`;
  Connection.execute(sql, [deposit_id]).then(async () => {
    const sqlUpdateRoomStatus = `UPDATE room SET room_status = 0 WHERE room_id = ?`
    Connection.execute(sqlUpdateRoomStatus, [RoomID]).then(() => {
      res.status(200).send({
        message: "DeleteDeposit",
      });
    });

  });
  // console.log(DeleteDeposit);
});

//------------------------------------------------------------------------------------------------------จัดการบิลค่าต่างๆ--------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------จัดการบิลค่าห้อง------------------------------------------------------------------//
// -----------------------------------------ออกบิลค่าห้อง---------------------------------------------------------
route.post("/AddRoombill", async (req, res) => {
  try {
    const {
      room_id,
      roombill_date,
    } = req.body;
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!

    let findSql = "SELECT * FROM bill\n" +
      "LEFT JOIN roombill ON bill.roombill_id = roombill.roombill_id\n" +
      "LEFT JOIN room ON room.room_id =  roombill.room_id\n" +
      "WHERE room.room_id = ? AND MONTH(bill.bill_date) = ?"
    const [result, resultData] = await Connection.query(findSql, [room_id, mm]);
    if (result.length > 0) throw new Error("bill_duplicated");

    let sql = `INSERT INTO roombill(room_id,roombill_date) 
      VALUES (?,?)`;
    const Data = await Connection.execute(sql, [
      room_id,
      roombill_date,
    ]);
    console.log(Data[0].insertId);
    if (Data[0].insertId != undefined) {
      let sql2 = `INSERT INTO bill(roombill_id,bill_status) VALUES (?,?)`;
      Connection.execute(sql2, [Data[0].insertId, 0]);
      res.status(200).send({ message: "success" });
    } else {
      res.status(500).send({ message: "error" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// -----------------------------------------แก้ไขบิลค่าห้อง---------------------------------------------------------
route.post("/UpdateRoombill", async (req, res) => {
  try {
    const {
      room_id,
      roombill_date,
    } = req.body;

    let sql =
      "UPDATE roombill SET roombill_date =  ? WHERE room_id = ? ";
    // console.log(sql);
    const Data = await Connection.execute(sql, [
      roombill_date,
      room_id,
    ]);
    // console.log(Data[0].insertId);
    if (Data[0].insertId != undefined) {
      res.status(200).send({ message: "success" });
    } else {
      // console.log("1");
      res.status(500).send({ message: "error" });
    }
  } catch (error) {
    // console.log(error);
    res.status(500).send({ message: error.message });
  }
});


// -----------------------------------------ลบข้อมูลบิลค่าห้อง---------------------------------------------------------
route.post("/DeleteRoombill/", async (req, res) => {
  const roombill_id = req.body.roombill_id;
  const waterbill_id = req.body.waterbill_id;
  const powerbill_id = req.body.powerbill_id;
  // console.log(room_id);
  let sql1 = `DELETE FROM bill WHERE roombill_id = ?`;
  Connection.execute(sql1, [roombill_id]).then(async () => {
    let sql2 = `DELETE FROM roombill WHERE roombill_id = ?`;
    Connection.execute(sql2, [roombill_id]).then(() => {
      let sql3 = `DELETE FROM waterbill WHERE waterbill_id = ?`
      Connection.execute(sql3, [waterbill_id]).then(() => {
        let sql4 = `DELETE FROM powerbill WHERE powerbill_id = ?`
        Connection.execute(sql4, [powerbill_id]).then(() => {
          res.status(200).send({
            message: "DeleteRoombill",
          });
        })

      })

    })
  })

});


//-----------------------------------------จัดการบิลค่าน้ำ------------------------------------------------------------------//
// -----------------------------------------ออกบิลค่าน้ำ---------------------------------------------------------
route.post("/AddWaterbill", async (req, res) => {
  try {
    const {
      water_unit,
      water_unitPrice,
      water_price,
      waterbilldate,
      Bill_id,
    } = req.body;

    let sql = `INSERT INTO waterbill(water_unit,water_unitPrice,water_price,water_date) 
      VALUES (?,?,?,?)`;
    const Data = await Connection.execute(sql, [
      water_unit,
      water_unitPrice,
      water_price,
      waterbilldate,
    ]);
    // console.log(Data[0].insertId);
    if (Data[0].insertId != undefined) {
      // console.log("55555");
      // console.log(Data[0].insertId);
      let sql2 = `UPDATE bill SET waterbill_id = ? WHERE bill_id  = ? `;
      Connection.execute(sql2, [Data[0].insertId, Bill_id]);
      res.status(200).send({ message: "success" });
    } else {
      res.status(500).send({ message: "error" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


// -----------------------------------------แก้ไขบิลค่าน้ำ---------------------------------------------------------
route.post("/UpdateWaterbill", async (req, res) => {
  try {
    const {
      waterUnit,
      waterUnit_price,
      waterPrice,
      waterbilldate,
      waterbill_id
    } = req.body;

    let sql =
      "UPDATE waterbill SET water_unit =  ? , water_unitPrice = ? , water_price = ? , water_date = ? WHERE waterbill_id = ? ";
    // console.log(sql);
    const Data = await Connection.execute(sql, [
      waterUnit,
      waterUnit_price,
      waterPrice,
      waterbilldate,
      waterbill_id
    ]);
    // console.log(Data[0].insertId);
    if (Data[0].insertId != undefined) {
      res.status(200).send({ message: "success" });
    } else {
      // console.log("1");
      res.status(500).send({ message: "error" });
    }
  } catch (error) {
    // console.log(error);
    res.status(500).send({ message: error.message });
  }
});

// -----------------------------------------ลบข้อมูลบิลค่าน้ำ---------------------------------------------------------
route.post("/DeleteWaterbill/", async (req, res) => {
  const waterbill_id = req.body.waterbill_id;
  const bill_id = req.body.bill_id;
  // console.log("-------------บิลน้ำ", waterbill_id);
  // console.log("-------------บิล", bill_id);

  let sql1 = `UPDATE bill SET waterbill_id = null WHERE bill_id = ?`;
  Connection.execute(sql1, [bill_id]).then(async () => {
    let sql2 = `DELETE FROM waterbill WHERE waterbill_id = ?`;
    Connection.execute(sql2, [waterbill_id]).then(() => {
      res.status(200).send({
        message: "DeleteWaterbill",
      });
    })
  })

});

//-----------------------------------------จัดการบิลค่าไฟ------------------------------------------------------------------//
// -----------------------------------------ออกบิลค่าไฟ---------------------------------------------------------
route.post("/AddPowerbill", async (req, res) => {
  try {
    const {
      powerUnit,
      powerUnit_price,
      powerPrice,
      powerbilldate,
      Bill_id,
    } = req.body;

    let sql = `INSERT INTO powerbill(power_unit,power_unitPrice,power_price,power_date) 
      VALUES (?,?,?,?)`;
    const Data = await Connection.execute(sql, [
      powerUnit,
      powerUnit_price,
      powerPrice,
      powerbilldate,
    ]);
    // console.log(Data[0].insertId);
    if (Data[0].insertId != undefined) {
      // console.log("55555");
      // console.log(Data[0].insertId);
      let sql2 = `UPDATE bill SET powerbill_id = ? WHERE bill_id  = ? `;
      Connection.execute(sql2, [Data[0].insertId, Bill_id]);
      res.status(200).send({ message: "success" });
    } else {
      res.status(500).send({ message: "error" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// -----------------------------------------แก้ไขบิลค่าไฟ---------------------------------------------------------
route.post("/UpdatePowerbill", async (req, res) => {
  try {
    const {
      powerUnit,
      powerUnit_price,
      powerPrice,
      powerbilldate,
      powerbill_id
    } = req.body;

    let sql =
      "UPDATE powerbill SET power_unit =  ? , power_unitPrice = ? , power_price = ? , power_date = ? WHERE powerbill_id = ? ";
    // console.log(sql);
    const Data = await Connection.execute(sql, [
      powerUnit,
      powerUnit_price,
      powerPrice,
      powerbilldate,
      powerbill_id
    ]);
    // console.log(Data[0].insertId);
    if (Data[0].insertId != undefined) {
      res.status(200).send({ message: "success" });
    } else {
      // console.log("1");
      res.status(500).send({ message: "error" });
    }
  } catch (error) {
    // console.log(error);
    res.status(500).send({ message: error.message });
  }
});

// -----------------------------------------ลบข้อมูลบิลค่าไฟ---------------------------------------------------------
route.post("/DeletePowerbill/", async (req, res) => {
  const powerbill_id = req.body.powerbill_id;
  const bill_id = req.body.bill_id;
  console.log("-------------บิลไฟ", powerbill_id);
  console.log("-------------บิล", bill_id);

  let sql1 = `UPDATE bill SET powerbill_id = null WHERE bill_id = ?`;
  Connection.execute(sql1, [bill_id]).then(async () => {
    let sql2 = `DELETE FROM powerbill WHERE powerbill_id = ?`;
    Connection.execute(sql2, [powerbill_id]).then(() => {
      res.status(200).send({
        message: "DeletePowerbill",
      });
    })
  })

});

// -----------------------------------------ลบข้อมูลบิลค่าน้ำ---------------------------------------------------------
route.post("/DeleteWaterbill/", async (req, res) => {
  const waterbill_id = req.body.waterbill_id;
  const bill_id = req.body.bill_id;
  // console.log("-------------บิลน้ำ", waterbill_id);
  // console.log("-------------บิล", bill_id);

  let sql1 = `UPDATE bill SET waterbill_id = null WHERE bill_id = ?`;
  Connection.execute(sql1, [bill_id]).then(async () => {
    let sql2 = `DELETE FROM waterbill WHERE waterbill_id = ?`;
    Connection.execute(sql2, [waterbill_id]).then(() => {
      res.status(200).send({
        message: "DeleteWaterbill",
      });
    })
  })

});

module.exports = route;
