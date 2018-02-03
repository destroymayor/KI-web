const express = require("express");
const path = require("path");
//載入壓縮組件
const compression = require("compression");
//載入路由配置
const routes = require("./server/route");

const app = express();
//socket.io config
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(compression());
app.use(express.static(path.join(__dirname, "client/build")));
routes(app);

server.listen(process.env.PORT || 5000);

//其他頁面導向index
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

io.on("connection", socket => {
  socket.emit("ChatMessage", { server: "response msg to client" });
  socket.on("my client", data => {
    console.log("server socket.on", data);
  });
});
