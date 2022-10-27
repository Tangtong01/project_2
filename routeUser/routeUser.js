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

route.get("/tenantManagement", Checklogin, async (req, res) => {
  // console.log(req.session.user_id);
  const sql = "SELECT  *  FROM users WHERE user_id = ?";
  const sql2 = "SELECT * FROM users WHERE role_id =3 and owner_id = ?";
  let dataUser;
  let dataTenant;
  await connecDB.query(sql, [req.session.user_id]).then(([result]) => {
    // console.log(result[0].firstname);
    dataUser = result[0];
  });
  await connecDB.query(sql2, req.session.user_id).then(([result]) => {
    // console.log(result);
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
  res.render("viewUsers/tenantManagement", {
    checklogin: req.session.user_id,
    CheckRole: req.session.role_id,
    route: "tenantManagement",
    datauser: dataUser,
    dataTenant: dataTenant,
  });
});

module.exports = route;
