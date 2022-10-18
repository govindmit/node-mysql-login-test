const create = require("../users/userService");
const pool = require("../database/conn");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { hashSync, genSaltSync, compareSync } = require("bcrypt");

module.exports = {
  User: (req, res) => {
    const body = req.body;
    console.log(body, "bodyyyy");
    var email = req.body.email;
    var password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    console.log(hash, "hash");
    let query = `INSERT INTO users
    (email, password) VALUES (?, ?);`;

    pool.query(query, [email, hash], (err, result) => {
      if (err) throw err;
      console.log("Row inserted with id = " + result.insertId);
      var id = result.insertId;
      var data = {
        id: id,
        email: body.email,
        password: hash,
      };
      res.send(data);
    });
  },

  login: (req, res) => {
    console.log(req.body);
    pool.query(
      `SELECT * FROM users WHERE email = ${pool.escape(req.body.email)};`,
      (err, result) => {
        // console.log(result[0].password, "rtes");
        // user does not exists
        // if (err) {
        //   throw err;
        //   return res.status(400).send({
        //     msg: err,
        //   });
        // }
        if (!result.length) {
          return res.status(401).send({
            msg: "Email or password is incorrect!",
          });
        }
        // check password
        bcrypt.compare(
          req.body.password,
          result[0].password,
          (bErr, bResult) => {
            // wrong password
            if (bErr) {
              return res.status(401).send({
                msg: "Email or password is incorrect!",
              });
            }
            if (bResult) {
              const token = jwt.sign(
                { id: result[0].id },
                "the-super-strong-secrect",
                { expiresIn: "1h" }
              );

              return res.status(200).send({
                msg: "Logged in!",
                token,
                user: result[0],
              });
            }
            return res.status(401).send({
              msg: "Username or password is incorrect!",
            });
          }
        );
      }
    );
  },
};
