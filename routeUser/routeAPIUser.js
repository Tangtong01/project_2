const express = require("express");
const Connection = require("../configDB/configDB");
const route = express.Router();
const path = require("path")
const fs = require("fs");
// -----------------------------------------บันทึกการชำระเงิน---------------------------------------------------------
route.post("/AddPay", async (req, res) => {
    try {
        const {
            payment_price,
            paymentdate,
            user_id,
            bill_id,
        } = req.body;

        const fileType = path.extname(req.body.filename);
        console.log(fileType)
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

        let sql = `INSERT INTO payment(user_id,bill_id,payment_price,payment_image,payment_date,payment_status) 
        VALUES (?,?,?,?,?,?)`;
        Connection.execute(sql, [
            user_id,
            bill_id,
            payment_price,
            newFilename,
            paymentdate,
            0,
        ]).then(async () => {
            let sql2 = "UPDATE bill \n" +
                "SET bill_status = 1 \n" +
                "WHERE\n" +
                "	bill_id = ?"
            const Data = await Connection.execute(sql2, [bill_id]);
            console.log(Data[0].insertId);
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


module.exports = route;
