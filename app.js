const express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const useRouter = require("./users/userRouter");
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/users", useRouter);

app.listen(4001, () => {
  console.log("server is running on port 4001");
});
