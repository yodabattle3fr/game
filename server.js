// Install with: npm install ws
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3000 });

let players = {};
let coins = [];

function spawnCoin() {
  const id = Date.now() + Math.random();
  coins.push({ id, x: Math.random() * 780, y: Math.random() * 580 });
}

for (let i = 0; i < 10; i++) spawnCoin();

wss.on("connection", ws => {
  const id = Date.now();
  players[id] = { id, x: 100, y: 100, coins: 0, color: getRandomColor() };

  ws.send(JSON.stringify({ type: "init", id, coins, players }));

  ws.on("message", msg => {
    const data = JSON.parse(msg);

    if (data.type === "move") {
      players[id].x = data.x;
      players[id].y = data.y;
    }

    if (data.type === "pickup") {
      coins = coins.filter(c => c.id !== data.coinId);
      players[id].coins++;
      spawnCoin();
    }

    if (data.type === "owner") {
      // owner cheat commands
      if (data.secret === "mySecret123") {
        if (data.action === "instawin") {
          broadcast({ type: "gameover", winner: players[id] });
        }
        if (data.action === "addcoins") {
          players[id].coins += 10;
