// index.js
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

// Enable CORS for all routes
app.use(cors());

// Create an HTTP server
const server = http.createServer(app);

// Create a new instance of Socket.IO with CORS settings
const io = new Server(server, {
  cors: {
    origin: "http://localhost:53783", // Update this with your Angular app's URL
    methods: ["GET", "POST"],
  },
});


// Sample tank data
const tankData = [
  {
    id: 1,
    title: "Tank 1",
    type: "Unleaded",
    alertStatus: "0",
    fillPercentage: 30,
    capacity: 200,
    volume: 2000,
  },
  {
    id: 2,
    title: "Tank 2",
    type: "Diesel",
    alertStatus: "1",
    fillPercentage: 60,
    capacity: 300,
    volume: 2500,
  },
  {
    id: 3,
    title: "Tank 3",
    type: "Premium",
    alertStatus: "0",
    fillPercentage: 90,
    capacity: 400,
    volume: 3000,
  },
  {
    id: 4,
    title: "Tank 4",
    type: "Premium",
    alertStatus: "0",
    fillPercentage: 30,
    capacity: 400,
    volume: 3000,
  },
  {
    id: 5,
    title: "Tank 5",
    type: "Premium",
    alertStatus: "0",
    fillPercentage: 95,
    capacity: 400,
    volume: 10000,
  },
  {
    id: 6,
    title: "Tank 6",
    type: "Premium",
    alertStatus: "0",
    fillPercentage: 65,
    capacity: 200,
    volume: 10000,
  },
];

// Sample site data
const sites = [
  {
    id: 1,
    title: "Fuel Controller",
    lastUpdated: "3 min ago",
    dynamicText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    details: [
      { key: "VM Status", value: "Active" },
      { key: "Services", value: "Stopped" },
    ],
  },
  {
    id: 2,
    title: "Site Controller",
    lastUpdated: "4 min ago",
    dynamicText: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    details: [
      { key: "VM Status", value: "Active" },
      { key: "Services", value: "Stopped" },
      { key: "Alerts", value: "None" },
    ],
  },
  {
    id: 3,
    title: "POS",
    lastUpdated: "10 min ago",
    dynamicText: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    details: [
      { key: "VM Status", value: "Active" },
      { key: "Service", value: "Stopped" },
    ],
  },
  {
    id: 4,
    title: "EPC Controller",
    lastUpdated: "4 min ago",
    dynamicText: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    details: [
      { key: "VM Status", value: "Active" },
      { key: "Service", value: "Stopped" },
      { key: "SAF Count", value: "20" },
      { key: "SAF Amount", value: "100" },
      { key: "Host Status", value: "Active" },
    ],
  },
];

// Sample pump status data
const pumpStatusList = [
  {
    id: 1,
    title: "Gilbarco - FPI",
    printerStatus: "Printer status",
    status: "Idle",
  },
  {
    id: 2,
    title: "FPI 2",
    printerStatus: "Printer status",
    status: "Payment",
  },
  {
    id: 3,
    title: "FPI 3",
    printerStatus: "Printer status",
    status: "Offline",
  },
  {
    id: 4,
    title: "FPI 4",
    printerStatus: "Printer status",
    status: "Idle",
  },
  {
    id: 5,
    title: "Gilbarco - FPI 5",
    printerStatus: "Printer status",
    status: "Offline",
  },
  {
    id: 6,
    title: "FPI 6",
    printerStatus: "Printer status",
    status: "Fuelling",
  },
];

// Sample price status data
const priceStatusList = [
  { name: "Petrol", pump: 234.00, pole: 233.00 },
  { name: "Diesel", pump: 234.00, pole: 233.00 },
  { name: "Grade 1", pump: 234.00, pole: 233.00 },
  { name: "Grade 2", pump: 234.00, pole: 233.00 },
  { name: "Grade 3", pump: 234.00, pole: 233.00 },
];

// API Endpoint 1: Returns an array of tank data
app.get("/api/tankData", (req, res) => {
  res.json(tankData);
});

// API Endpoint 2: Returns an array of site data
app.get("/api/siteList", (req, res) => {
  res.json(sites);
});

// API Endpoint 3: Returns an array of pump status data
app.get("/api/pumpStatusList", (req, res) => {
  res.json(pumpStatusList);
});

// API Endpoint 4: Returns an array of price status data
app.get("/api/priceList", (req, res) => {
  res.json(priceStatusList);
});

// When a client connects to the Socket.IO server
io.on("connection", (socket) => {
  console.log("A client connected: ", socket.id);

  // Send initial tank data to the client
  socket.emit("tankData", tankData);

  // Example of how to update tank data periodically
  setInterval(() => {
    // Modify tank data randomly (simulate real-time changes)
    tankData.forEach((tank) => {
      tank.fillPercentage = Math.floor(Math.random() * 100); // Random fill percentage
    });

    // Emit the updated tank data to all connected clients
    io.emit("tankData", tankData);
  }, 5000); // Update every 5 seconds

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the server using the HTTP server to support Socket.IO
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
