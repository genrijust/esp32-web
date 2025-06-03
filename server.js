const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Receive data from ESP32 and broadcast to website
app.post('/api/from-esp32', (req, res) => {
  io.emit('esp32-data', req.body);
  res.sendStatus(200);
});

// Receive data from website to send to ESP32
let latestWebMessage = {};
app.post('/api/to-esp32', (req, res) => {
  latestWebMessage = req.body;
  res.sendStatus(200);
});

// ESP32 fetches data sent from website
app.get('/api/to-esp32', (req, res) => {
  res.json(latestWebMessage);
  latestWebMessage = {};
});

http.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});