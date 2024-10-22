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
    origin: "http://localhost:4200", // Update this with your Angular app's URL
    methods: ["GET", "POST"],
  },
});


// Sample tank data
const tankData = [
  {
      title: "Tank 1",
      type: "Unleaded",
      alertStatus: "0",
      fillPercentage: 50,
      waterFillPercentage: 20,
      capacity: 200,
      volume: 100,
  },
  {
      title: "Tank 2",
      type: "Diesel",
      alertStatus: "1",
      fillPercentage: 60,
      waterFillPercentage: 30,
      capacity: 300,
      volume: 200,
  },
  {
      title: "Tank 3",
      type: "Octane 91",
      alertStatus: "0",
      fillPercentage: 80,
      waterFillPercentage: 20,
      capacity: 400,
      volume: 380,
  },
  {
      title: "Tank 4",
      type: "Petrol",
      alertStatus: "0",
      fillPercentage: 30,
      waterFillPercentage: 20,
      capacity: 400,
      volume: 150,
  },
  {
      title: "Tank 5",
      type: "Regular",
      alertStatus: "0",
      fillPercentage: 80,
      waterFillPercentage: 20,
      capacity: 400,
      volume: 400,
  },
  {
      title: "Tank 6",
      type: "Premium",
      alertStatus: "0",
      fillPercentage: 65,
      waterFillPercentage: 15,
      capacity: 200,
      volume: 150,
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

// Temporary storage for submitted alerts
let submittedAlerts = [];



// API Endpoint: Submit alert data
app.post("/api/submitAlert", express.json(), (req, res) => {
  const { siteId, alertType, alertLevel, action } = req.body;

  // Process the alert data and store it in the temporary array
  const alertData = { siteId, alertType, alertLevel, action, timestamp: new Date() };
  submittedAlerts.push(alertData);

  console.log("Received alert data:", alertData);

  // Respond with a success message
  res.json({ message: `Alert ${action}d successfully for site ${siteId}!` });
});

// API Endpoint: Get list of submitted alerts
app.get("/api/submittedAlerts", (req, res) => {
  res.json(submittedAlerts);
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
