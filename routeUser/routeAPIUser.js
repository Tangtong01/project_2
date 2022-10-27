const express = require("express");
const Connection = require("../configDB/configDB");
const route = express.Router();

// -----------------------------------------เพิ่มข้อมูลผู้เช่าหอ---------------------------------------------------------
// route.post("/AddTenant", async (req, res) => {
//   try {
//     const {
//       Firstname,
//       Surname,
//       username,
//       password,  
//       Email,
//       Address,
//       Phonenumber,
//       owner,
//     } = req.body;
//     let sql = `INSERT INTO users(role_id,firstname,surname,username,password,user_email,user_address,user_tel,user_status,owner_id) 
//       VALUES (?,?,?,?,?,?,?,?,?,?)`;
//     const Data = await Connection.execute(sql, [
//       3,
//       Firstname,
//       Surname,
//       username,
//       password,
//       Email,
//       Address,
//       Phonenumber,
//       1,
//       owner,
//     ]);
//     console.log(Data[0].insertId);
//     if (Data[0].insertId != undefined) {
//       res.status(200).send({ message: "success" });
//     } else {
//       res.status(500).send({ message: "error" });
//     }
//   } catch (error) {
//     res.status(500).send({ message: "error" });
//   }
// });

// // -----------------------------------------แก้ไขข้อมูลผู้เช่าหอ---------------------------------------------------------
// route.post("/UpdateTenant", async (req, res) => {
//   try {
//     const {
//       Firstname,
//       Surname,
//       username,
//       password,
//       Email,
//       Address,
//       Phonenumber,
//       UserId,
//     } = req.body;
//     console.log(req.body);
//     let sql =
//       "UPDATE users SET firstname =  ?,  surname = ? , username = ? , password = ? , user_email = ? , user_address = ? , user_tel = ? WHERE user_id = ? ";
//     console.log(sql);
//     const Data = await Connection.execute(sql, [
//       Firstname,
//       Surname,
//       username,
//       password,
//       Email,
//       Address,
//       Phonenumber,
//       UserId,
//     ]);
//     console.log(Data[0].insertId);
//     if (Data[0].insertId != undefined) {
//       res.status(200).send({ message: "success" });
//     } else {
//       console.log("1");
//       res.status(500).send({ message: "error" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: "error" });
//   }
// });

// // -----------------------------------------ลบข้อมูลผู้เช่าหอ---------------------------------------------------------
// route.post("/DeleteTenant/", async (req, res) => {
//   const user_id = req.body.user_id;
//   console.log(user_id);
//   let sql = `DELETE FROM users WHERE user_id = ?`;
//   const DeleteDormowner = await Connection.execute(sql, [user_id]);
//   console.log(DeleteDormowner);
//   res.status(200).send({
//     message: "DeleteTenant",
//   });
// });

module.exports = route;
