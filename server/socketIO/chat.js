module.exports = io => {
  //socket.io connection
  io.sockets.on("connection", socket => {
    //接收client訊息並回傳
    socket.on("SendMessage", data => {
      console.log("server接收訊息", "使用者:", data.username, "內容:", data.content);
      socket.emit("SendMessage", { username: "ChatBot", content: "server回傳訊息" });
    });

    //離線
    socket.on("disconnect", () => {
      console.log("server 連線已斷開", new Date());
    });
  });
};
