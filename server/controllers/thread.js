const db = require("../config/db");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.createThread = (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const image = req.body.image;
  const author = req.user.userName;

  if (image) {
    db.query(
      "INSERT INTO thread (title, description, image, author, date) VALUES (?, ?, ?, ?, NOW());",
      [title, description, image, author],
      (err, results) => {
        console.log(err);
        res.send(results);
      });
  } else {
    db.query(
      "INSERT INTO thread (title, description, author, date) VALUES (?, ?, ?, NOW());",
      [title, description, author],
      (err, results) => {
        console.log(err);
        res.send(results);
      });
  }

};

exports.comment = (req, res) => {
  const threadcomment = req.body.idthread;
  const comment = req.body.commentaire;
  const userName = req.user.userName;
  db.query(
    "INSERT INTO comments (threadcomment, comment, usercomment) VALUES (?, ?, ?);",
    [threadcomment, comment, userName],
    (err, results) => {
      console.log(results, err);
    });
  db.query(
    "UPDATE thread SET commentcount = commentcount + 1 WHERE idthread = ?;",
    threadcomment,
    (err, results) => {
      console.log(results, err);
    });
  db.query(
    "SELECT * FROM comments WHERE threadcomment = ?;",
    threadcomment,
    (err, results) => {
      console.log(err);
      res.send(results);
    });
};

exports.getAllThreads = (req, res) => {
  db.query("SELECT * FROM thread",
    (err, results) => {
      res.send(results);
    });
};

exports.getComments = (req, res) => {
  const threadcomment = req.body.idthread;
  db.query("SELECT * FROM comments where threadcomment = ?;",
    threadcomment,
    (err, results) => {
      console.log(err);
      res.send(results);
    });
};

exports.deleteComment = (req, res) => {
  const idcomment = req.body.idcomment;
  threadcomment = req.body.idthread;

  db.query(
    "DELETE FROM comments WHERE idcomments = ?;",
    idcomment,
    (err, results) => {
      console.log(err, results);
    });
  db.query(
    "UPDATE thread SET commentcount = commentcount - 1 WHERE idthread = ?;",
    threadcomment,
    (err, results) => {
      console.log(results, err);
    });
};

exports.getProfileThreads = (req, res) => {
  const userName = req.user.userName;
  db.query('SELECT * FROM thread where author = ?;SELECT avatar FROM user where username = ?;', [userName, userName], function(err, results) {
    if (err) throw err;  
    res.send(results);
  });
  
};

exports.delete = (req, res) => {
  const idthread = req.body.idthread;
  const userName = req.user.userName;
  const publicId = req.body.image;
  db.query(
    "SELECT * FROM thread WHERE author = ? AND idthread = ?;",
    [userName, idthread],
    (err, results) => {
      console.log(err, results, results[0].author);
      if (req.user.role == "moderateur" || userName == results[0].author) {
        cloudinary.uploader.destroy(publicId, function (result) { console.log(result) })

        db.query(
          "DELETE FROM thread WHERE idthread = ?;",
          idthread,
          (err, results) => {
            console.log(err, results);
          });
        db.query(
          "SELECT * FROM thread WHERE author = ?;",
          userName,
          (err, results) => {
            console.log(err);
            res.send(results);
          });
      }
    })
};

exports.like = (req, res) => {
  const userName = req.user.userName;
  const threadid = req.body.idthread;
  db.query(
    "SELECT EXISTS(SELECT * from likes WHERE userliking = ? AND threadid = ?)  AS cnt",
    [userName, threadid],
    (err, results) => {
      console.log(results, err)
      if (results[0].cnt == 0) {
        db.query(
          "INSERT INTO likes (userliking, threadid) VALUES (?, ?)",
          [userName, threadid],
          (err, results) => {
          });
        db.query(
          "UPDATE thread SET likecount = likecount + 1 WHERE idthread = ?",
          threadid,
          (err, results) => {
            console.log(err)
          });
      } else {
        db.query(
          "DELETE FROM likes WHERE userliking = ? AND threadid = ?",
          [userName, threadid],
          (err, results) => {
            console.log(results, err)
          });
        db.query(
          "UPDATE thread SET likecount = likecount - 1 WHERE idthread = ?",
          threadid,
          (err, results) => {
            console.log(err)
          });
      }
      db.query("SELECT * FROM thread",
        (err, results) => {
          res.send(results);
        });
    });
};

exports.modifyThread = (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const threadid = req.body.idthread;
  const userName = req.user.userName;
  db.query(
    "UPDATE thread SET title = ?, description = ? WHERE idthread = ?",
    [title, description, threadid],
    (err, results) => {
      console.log(err)
    });
  db.query(
    "SELECT * FROM thread WHERE author = ?;",
    userName,
    (err, results) => {
      console.log(err);
      res.send(results);
    });
}