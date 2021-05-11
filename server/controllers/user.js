const db = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      function isPassword(password) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password);
      }
      if (!isPassword(req.body.password)) {
        res.status(400).send({ message: "Votre mot de passe doit contenir au moins 8 caractères, une majuscule, un caractère spécial et au moins un chiffre" });
      } else {
        const username = req.body.username;
        const role = "basic";
        db.query(
          "INSERT INTO User (username, password, role) VALUES (?, ?, ?);",
          [username, hash, role],
          (err, results) => {
            console.log(err);
            if(err){
              res.status(400).send({ message: "Le nom d'utilisateur est déjà pris"});
            }else {
              res.status(200).send({ message: "Compte enregistré" });
            }
          }
        );
      }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM User WHERE username = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            res.status(200).json({
              userName: result[0].username,
              role: result[0].role,
              token: jwt.sign(
                { userName: result[0].username, role: result[0].role }, // Payload (données à encoder)
                process.env.ACCESS_TOKEN_SECRET, // Clé secrète pour l'encodage
                { expiresIn: '24h' }
              ),
              loggedIn: true
            });
          } else {
            res.status(400).send({ message: "Mot de passe incorrect" });
          }
        });
      } else {
        res.status(400).send({ message: "L'utilisateur n'existe pas" });
      }
    }
  );
};

exports.delete = (req, res) => {
  const username = req.user.userName;
  db.query(
    "DELETE FROM User WHERE username = ?;",
    username,
    (err, results) => {
      console.log(err);
      res.send(results);
  }
  );
};

exports.avatar = (req, res) => {
  const userName = req.user.userName;
  const image = req.body.image
  db.query(
    "UPDATE user SET avatar = ? WHERE username = ?",
    [image, userName],
    (err, results) => {
      console.log(err)
    });
    db.query(
      "SELECT avatar FROM user WHERE username = ?;",
      userName,
      (err, results) => {
        console.log(err);
        res.send(results);
      });
};
