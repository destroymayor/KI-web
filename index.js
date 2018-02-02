const express = require("express");
const path = require("path");
const compression = require("compression");

//載入路由配置
const routes = require("./server/route");

const app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, "client/build")));

routes(app);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(process.env.PORT || 5000, () => {
  console.log("runing on http://localhost:5000 ");
});
