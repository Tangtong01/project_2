const express = require("express");
const Connection = require("../configDB/configDB");
const route = express.Router();

//------------------------------------------------login เว็บ-------------------------------------------------------
route.get("/login/:username/:password", async (req, res) => {
  // console.log(req.params);

  const { username, password } = req.params;
  let sql = `SELECT * from users WHERE username=? and password=?`;
  const Data = await Connection.execute(sql, [username, password]);

  if (typeof Data[0][0] == "undefined") {
    // console.log("ไม่มีข้อมูล");
    res.status(500).send();
  } else {
    const userid = Data[0][0].user_id;
    const status = Data[0][0].user_status;
    const role_id = Data[0][0].role_id;
    // console.log("=>>>", status);

    if (status == 0) {
      res.status(203).send();
    } else if (status == 2) {
      res.status(204).send();
    } else {
      req.session.role_id = role_id;
      req.session.user_id = userid;
      res.status(200).send({
        role: role_id,
      });
    }
  }
});

route.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// -----------------------------------------สมัครสมาชิกข้อมูลเจ้าของหอ-------------------------------------------------
route.post("/register", async (req, res) => {
  try {
    const {
      Firstname,
      Surname,
      username,
      password,
      Email,
      Address,
      Phonenumber,
      Role_id,
    } = req.body;
    // console.log(Role_id);
    let findSql = "SELECT * FROM users WHERE username =  ?  AND role_id = ? ";
    const [user, resultData] = await Connection.query(findSql, [
      username,
      Role_id,
    ]);
    if (user.length > 0) throw new Error("user_duplicated");

    let sql = `INSERT INTO users(role_id,firstname,surname,username,password,user_email,user_address,user_tel,user_status) 
    VALUES (?,?,?,?,?,?,?,?,?)`;
    const Data = await Connection.execute(sql, [
      2,
      Firstname,
      Surname,
      username,
      password,
      Email,
      Address,
      Phonenumber,
      0,
    ]);
    // console.log(Data[0].insertId);
    if (Data[0].insertId != undefined) {
      res.status(200).send({ message: "success" });
    } else {
      res.status(500).send({ message: "error" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// -----------------------------------------เพิ่มข้อมูลเจ้าของหอ---------------------------------------------------------
route.post("/AddDormowner", async (req, res) => {
  try {
    const {
      Firstname,
      Surname,
      username,
      password,
      Email,
      Address,
      Phonenumber,
      Role_id,
    } = req.body;
    // console.log(Role_id);
    let findSql = "SELECT * FROM users WHERE username =  ?  AND role_id = ? ";
    const [user, resultData] = await Connection.query(findSql, [
      username,
      Role_id,
    ]);
    if (user.length > 0) throw new Error("user_duplicated");

    let sql = `INSERT INTO users(role_id,firstname,surname,username,password,user_email,user_address,user_tel,user_status) 
    VALUES (?,?,?,?,?,?,?,?,?)`;
    const Data = await Connection.execute(sql, [
      2,
      Firstname,
      Surname,
      username,
      password,
      Email,
      Address,
      Phonenumber,
      1,
    ]);
    // console.log(Data[0].insertId);
    if (Data[0].insertId != undefined) {
      res.status(200).send({ message: "success" });
    } else {
      res.status(500).send({ message: "error" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// -----------------------------------------แก้ไขข้อมูลเจ้าของหอ---------------------------------------------------------
route.post("/UpdateDormowner", async (req, res) => {
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

// -----------------------------------------ลบข้อมูลเจ้าของหอ---------------------------------------------------------
route.post("/DeleteDormowner/", async (req, res) => {
  const user_id = req.body.user_id;
  // console.log(user_id);
  let sql = `DELETE FROM users WHERE user_id = ?`;
  const DeleteDormowner = await Connection.execute(sql, [user_id]);
  // console.log(DeleteDormowner);
  res.status(200).send({
    message: "DeleteDormowner",
  });
});

// -----------------------------------------ยืนยันข้อมูลเจ้าของหอ---------------------------------------------------------
route.post("/UpdateStatusDormowner/", async (req, res) => {
  const user_status = req.body.user_status;
  const user_id = req.body.user_id;
  // console.log(user_status);
  let sql = `UPDATE users SET user_status = 1 WHERE user_id =?`;
  // console.log(sql);
  const updateStatus = await Connection.execute(sql, [user_id]);
  // console.log(updateStatus);
  res.status(200).send({
    message: "UpdateStatusDormowner",
  });
});

// -----------------------------------------แก้ไขข้อมูลส่วนตัว [ADMIN]---------------------------------------------------------
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
    } = req.body;
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
    // console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});
module.exports = route;
