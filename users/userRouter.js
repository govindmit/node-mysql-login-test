const router = require("express").Router();
const { User, login } = require("./userController");
router.post("/", User);
router.post("/login", login);
module.exports = router;
