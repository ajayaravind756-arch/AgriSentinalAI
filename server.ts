import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database (In-memory for prototype, but structured for real API)
  const db = {
    reports: [],
    inspections: [],
    exchange: {
      supply: [
        { id: 1, farmer: "Raghavan K.", crop: "Paddy", quantity: 500, unit: "kg", price: 28, harvestDate: "2026-04-10", district: "Palakkad", contact: "+91 98470 12345", status: "available" },
        { id: 2, farmer: "Sumi M.", crop: "Banana", quantity: 200, unit: "kg", price: 42, harvestDate: "2026-04-05", district: "Thrissur", contact: "+91 94471 67890", status: "available" },
        { id: 3, farmer: "Jose P.", crop: "Coconut", quantity: 1000, unit: "piece", price: 30, harvestDate: "2026-04-15", district: "Kozhikode", contact: "+91 94950 11223", status: "available" }
      ],
      demand: [
        { id: 1, buyer: "Kochi Retailers", crop: "Banana", quantity: 500, unit: "kg", maxPrice: 45, district: "Ernakulam", contact: "0484-2345678" },
        { id: 2, buyer: "Palakkad Rice Mill", crop: "Paddy", quantity: 2000, unit: "kg", maxPrice: 30, district: "Palakkad", contact: "0491-2522011" }
      ],
      reservations: []
    },
    riskLevels: {
      "Thiruvananthapuram": 15,
      "Kollam": 22,
      "Pathanamthitta": 10,
      "Alappuzha": 45,
      "Kottayam": 30,
      "Idukki": 12,
      "Ernakulam": 55,
      "Thrissur": 40,
      "Palakkad": 65,
      "Malappuram": 35,
      "Kozhikode": 28,
      "Wayanad": 18,
      "Kannur": 25,
      "Kasaragod": 20
    }
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/weather/:district", (req, res) => {
    const { district } = req.params;
    // Mock weather data
    res.json({
      temp: 28 + Math.floor(Math.random() * 5),
      humidity: 75 + Math.floor(Math.random() * 15),
      rainfall: Math.random() > 0.7 ? "Heavy Rain Expected" : "Light Showers",
      forecast: [
        { day: "Mon", temp: 30, rain: 10 },
        { day: "Tue", temp: 29, rain: 80 },
        { day: "Wed", temp: 28, rain: 40 },
        { day: "Thu", temp: 31, rain: 5 },
        { day: "Fri", temp: 32, rain: 0 },
      ]
    });
  });

  app.get("/api/soil/:district", (req, res) => {
    const { district } = req.params;
    res.json({
      moisture: 35 + Math.floor(Math.random() * 20),
      ph: 5.5 + (Math.random() * 1.5),
      nitrogen: "Medium",
      phosphorus: "Low",
      potassium: "High",
      recommendation: "Apply 40kg DAP per acre for Paddy crops."
    });
  });

  app.get("/api/data", (req, res) => {
    res.json(db);
  });

  app.get("/api/market", (req, res) => {
    res.json({
      prices: [
        { crop: 'Paddy', current: 28.5, forecast: 30.2, trend: 'up', unit: 'kg', alert: "Sell in 5 days for peak price", historical: [25, 26, 27, 28, 28.5] },
        { crop: 'Coconut', current: 32.0, forecast: 28.5, trend: 'down', unit: 'piece', alert: "Sell now: price crash expected", historical: [35, 34, 33, 32.5, 32] },
        { crop: 'Banana', current: 45.0, forecast: 48.2, trend: 'up', unit: 'kg', alert: "Delay harvest by 3 days", historical: [40, 42, 43, 44, 45] },
        { crop: 'Pepper', current: 620.0, forecast: 645.0, trend: 'up', unit: 'kg', alert: "Hold stock: +12% rise forecast", historical: [580, 590, 600, 610, 620] },
        { crop: 'Rubber', current: 185.0, forecast: 182.0, trend: 'down', unit: 'kg', alert: "Market volatile: monitor daily", historical: [190, 188, 187, 186, 185] }
      ],
      buyers: [
        { name: "Kollam Agri Cooperative", crop: "Banana", price: 46.5, distance: "5km", verified: true, contact: "+91 98765 43210" },
        { name: "Ernakulam Wholesale Market", crop: "Paddy", price: 29.0, distance: "12km", verified: true, contact: "0484-2345678" },
        { name: "Wayanad Spices Board", crop: "Pepper", price: 630.0, distance: "8km", verified: true, contact: "04936-202201" },
        { name: "Local Organic Hub", crop: "Vegetables", price: 35.0, distance: "2km", verified: false, contact: "+91 99988 77766" }
      ],
      schemes: [
        { id: 1, title: "PM-KISAN Payout", description: "Next installment due on April 15th. Verify your Aadhar via AIMS portal.", type: "Subsidy", link: "https://pmkisan.gov.in" },
        { id: 2, title: "Kuttanad Paddy Bonus", description: "Special bonus of ₹2/kg announced for Alappuzha farmers.", type: "Grant", link: "https://keralaagriculture.gov.in" },
        { id: 3, title: "Crop Insurance Deadline", description: "Last date for Kharif crop insurance is April 10th.", type: "Alert", link: "https://pmfby.gov.in" },
        { id: 4, title: "AgriStack Land Verification", description: "Complete your digital land survey to be eligible for future subsidies.", type: "AgriStack", link: "https://agristack.gov.in" }
      ],
      trends: [
        { district: 'Palakkad', crop: 'Paddy', volatility: 'Low', demand: 'High' },
        { district: 'Idukki', crop: 'Pepper', volatility: 'Medium', demand: 'Very High' },
        { district: 'Kottayam', crop: 'Rubber', volatility: 'High', demand: 'Medium' },
        { district: 'Wayanad', crop: 'Coffee', volatility: 'Low', demand: 'High' }
      ]
    });
  });

  app.post("/api/reports", (req, res) => {
    const report = { ...req.body, id: Date.now(), timestamp: new Date().toISOString() };
    db.reports.push(report);
    
    // Simple logic to increase risk in the district
    if (db.riskLevels[report.district] !== undefined) {
      db.riskLevels[report.district] = Math.min(100, db.riskLevels[report.district] + 8);
    }
    
    res.status(201).json(report);
  });

  app.post("/api/inspections", (req, res) => {
    const inspection = { ...req.body, id: Date.now(), timestamp: new Date().toISOString() };
    db.inspections.push(inspection);
    res.status(201).json(inspection);
  });

  // Smart Agri Exchange Endpoints
  app.get("/api/exchange", (req, res) => {
    // Simple matching engine logic
    const matches = db.exchange.supply.map(s => {
      const matchingDemands = db.exchange.demand.filter(d => 
        d.crop === s.crop && 
        d.maxPrice >= s.price &&
        (d.district === s.district || d.district === "Any")
      );
      return { ...s, matches: matchingDemands };
    });
    res.json({ ...db.exchange, supply: matches });
  });

  app.post("/api/exchange/supply", (req, res) => {
    const item = { ...req.body, id: Date.now(), status: "available" };
    db.exchange.supply.push(item);
    res.status(201).json(item);
  });

  app.post("/api/exchange/demand", (req, res) => {
    const item = { ...req.body, id: Date.now() };
    db.exchange.demand.push(item);
    res.status(201).json(item);
  });

  app.post("/api/exchange/reserve", (req, res) => {
    const { supplyId, buyerId, buyerName } = req.body;
    const supplyItem = db.exchange.supply.find(s => s.id === supplyId);
    if (supplyItem) {
      supplyItem.status = "reserved";
      const reservation = { 
        id: Date.now(), 
        supplyId, 
        buyerId, 
        buyerName, 
        crop: supplyItem.crop,
        timestamp: new Date().toISOString() 
      };
      db.exchange.reservations.push(reservation);
      res.status(201).json(reservation);
    } else {
      res.status(404).json({ error: "Supply item not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
