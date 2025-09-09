// run: npm install ws
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3000 });

let players = {};

wss.on("connection", ws => {
  const id = Date.now();
  players[id] = { x:100, y:100, coins:0 };

  ws.on("message", msg => {
    const data = JSON.parse(msg);
    if(data.type === "update"){
      players[id] = data.player;
    }
    broadcast();
  });

  ws.on("close", () => {
    delete players[id];
    broadcast();
  });

  function broadcast(){
    const payload = JSON.stringify({ type:"state", players });
    wss.clients.forEach(c => c.send(payload));
  }
});
