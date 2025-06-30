require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connectToDb = require("./data/conectToDb");
connectToDb();

//error handling
const ErrorHandling = require('./Middleware/ErrorHandling.MiddleWare')
app.use(ErrorHandling);

const cookieParser = require("cookie-parser");
app.use(cookieParser());
const BlackListToken = require("./models/BlackListToken");

const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173" }));

// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// WhatsApp Client Setup
const client = new Client({
  puppeteer: { headless: true, args: ["--no-sandbox"] },
});

client.on("qr", (qr) => {
  console.log(`Scan this QR with WhatsApp on ${process.env.WHATSAPP_ADMIN_PHONE} to send messages!`);
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log(`WhatsApp client READY - sending from ${process.env.WHATSAPP_ADMIN_PHONE}`);
});

client.on("authenticated", () => {
  console.log(`WhatsApp authenticated with ${process.env.WHATSAPP_ADMIN_PHONE}`);
});

client.on("disconnected", (reason) => {
  console.log("WhatsApp disconnected:", reason);
  client.initialize();
});

client.initialize();

const activeSockets = {};

// Socket.IO Setup
io.on("connection", (socket) => {
  const { userId, serviceProviderId } = socket.handshake.query;

  if (userId) {
    activeSockets[userId] = socket.id;
    console.log(`🧑 User ${userId} connected with socket ${socket.id}`);
  }

  if (serviceProviderId) {
    activeSockets[serviceProviderId] = socket.id;
    console.log(`👷 Service Provider ${serviceProviderId} connected with socket ${socket.id}`);
  }

  console.log("📋 Current active sockets:", activeSockets);
  const activeIds = Object.keys(activeSockets);
  console.log("📋 Active users or providers:", activeIds);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`${userId} joined room`);
  });

  socket.on("error", (err) => {
    console.error(`Socket error: ${err.message}`);
  });

  socket.on("disconnect", () => {
    for (const id in activeSockets) {
      if (activeSockets[id] === socket.id) {
        console.log(`❌ Disconnected: ${id}`);
        delete activeSockets[id];
        break;
      }
    }
    const updatedIds = Object.keys(activeSockets);
    console.log("📋 Updated active users or providers:", updatedIds);
  });
});

// Make io and WhatsApp client globally accessible
global.io = io;
global.whatsappClient = client;
global.activeSockets = activeSockets;

const userRouter = require("./routes/UserRouter");
const ServiceRouter = require("./routes/ServiceRouter");
const BookingRouter = require("./routes/BookingRouter");
const paymentRouter = require("./routes/paymentRouter");
const ReviewRouter = require("./routes/ReviewRouter");
const locationRoutes = require("./routes/locationRoutes");

const adminRoutes = require("./routes/AdminRouter");
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("all is well");
});

// Logout route
app.post("/logout", async (req, res, next) => {
  try {
    let token =
      req.cookies.token ||
      (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));
    if (!token) {
      return res.status(401).json({ message: "Please login first" });
    }
    await BlackListToken.create({ token });
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully, token blacklisted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/user", userRouter);
app.use("/service", ServiceRouter);
app.use("/booking", BookingRouter);
app.use("/api", paymentRouter);
app.use("/Review_api", ReviewRouter);
app.use('/location', locationRoutes);

module.exports = { io, activeSockets };

server.listen(3000, () => {
  console.log("Server running on port 3000");
});