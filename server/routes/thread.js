const express = require("express");
const router = express.Router();
const threadCtrl = require('../controllers/thread');
const auth = require('../middleware/auth');


router.get('/', threadCtrl.getAllThreads);
router.post('/', auth, threadCtrl.createThread);
router.get("/byUser/:username", auth, threadCtrl.getProfileThreads);
router.delete("/delete", auth, threadCtrl.delete);
router.post("/like", auth, threadCtrl.like);
router.post("/comment", auth, threadCtrl.comment);
router.post("/getComments", threadCtrl.getComments);
router.delete("/deleteComment", auth, threadCtrl.deleteComment);
router.post("/modify", auth, threadCtrl.modifyThread);



module.exports = router;
