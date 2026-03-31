<div align="center">
<img width="1200" height="475" alt="AgriSentinelAI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🌿 AgriSentinelAI (AgriSense Kerala)
### An Intelligent "One Health" Surveillance & Decision Support System
#### 🏆 Built with Google AI Studio & Antigravity (Mulearn Challenge)

[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.11.0-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Lucide](https://img.shields.io/badge/Lucide-Icons-F43F5E?logo=lucide&logoColor=white)](https://lucide.dev/)
[![Gemini](https://img.shields.io/badge/AI-Gemini_3_Flash-4285F4?logo=google-cloud&logoColor=white)](https://ai.google.dev/)

</div>

---

## 🎯 Problem Statement
Farmers lack access to real-time, localized, and actionable insights on **crop health**, **weather conditions**, **irrigation needs**, and **market trends**, leading to delayed decisions, crop losses, and reduced profitability.

### 🚩 Problem Description
In regions like **Kerala**, farming is heavily affected by unpredictable weather, pest outbreaks, and fluctuating market prices. Most farmers rely on traditional knowledge or delayed information, which is often insufficient in modern conditions.

**Critical Issues Identified:**
- **Late Disease Detection**: By the time action is taken, damage has already spread.
- **Disconnected Data Sources**: Weather, soil, and market data exist separately, forcing farmers to make decisions without the full picture.
- **Communication Gap**: Lack of direct, immediate access to agricultural experts or government authorities.
- **Market Uncertainty**: Without price forecasting, farmers risk financial losses.

---

## 🚀 The Solution: AgriSentinelAI
AgriSentinelAI is an intelligent, real-time platform designed to bridge these gaps using state-of-the-art **Google AI**. It integrates regional monitoring, AI-driven diagnostics, and a role-based exchange system into a single, premium user experience.

### 🌟 Key Features
- **🌍 Regional Monitoring (One Health Risk Map)**: A live, GeoJSON-powered heatmap of Kerala districts showing real-time agricultural risk layers (pests, weather, humidity).
- **🦠 AI-Powered Disease Detection**: Snap a photo or share symptoms to receive a high-confidence diagnosis with organic and chemical treatment protocols.
- **📢 Global Broadcast Hub**: Real-time government alerts and advisories (transmitted via Firestore) ensure farmers receive critical regional warnings instantly.
- **🚜 Smart Agri-Exchange**: A role-based marketplace that matches farmer supply with buyer demand, supporting pre-orders and reservations.
- **💬 AgriSense Assistant**: A premium, markdown-capable AI chatbot built on Gemini 3 Flash, providing localized agricultural advice in both English and Malayalam.
- **🏛️ Officer Command Center**: A powerful administrative portal for Agricultural Officers to manage broadcasts, verify local reports, and track field resource inventories.
- **📜 Government Gazette**: A searchable, elegant repository for official circulars and technical protocols.

---

## 🛠️ Google AI Tools Used

### ☑️ **Antigravity (Primary IDE & Agent)**
Antigravity was used as the **primary engine** to build the entire AgriSentinelAI ecosystem:
- **UI/UX Engineering**: Orchestrated the premium, dark-themed glassmorphism interface across all portals.
- **Complex Prototyping**: Rapidly implemented the smart matching engine for the Agri-Exchange and the risk map architecture.
- **Auto-Debugging**: Resolved critical runtime errors and lifecycle loops, ensuring a production-grade experience.
- **Agentic Automation**: Automated the installation of dependencies (Leaflet, Framer Motion, Recharts) and orchestrated all GitHub deployments.

### ☑️ **Google AI Studio (Model Intelligence)**
- **Gemini 3 Flash**: Powers the core **AgriSense Assistant** for low-latency, high-accuracy agricultural responses.
- **Gemini 3 Pro**: Utilized for complex crop health analysis and diagnostic report generation.
- **AI Agents**: Custom-built prompts were used for district-level risk calculations and market volatility indexing.

---

## 📦 Technological Stack
- **Frontend**: React 19 + Vite + Tailwind CSS (Glassmorphism architecture).
- **Backend**: Node.js + Express + TSX (High-performance API layer).
- **Real-time Database**: Firebase Firestore (Real-time broadcasts and exchange system).
- **Data Visualization**: Recharts (Market trends) & React-Leaflet (Kerala GeoJSON heatmapping).
- **Intelligence**: Google Generative AI (Gemini 3 Flash).

---

## 💻 Local Setup & Development

1. **Clone the Project**:
   ```bash
   git clone https://github.com/ajayaravind756-arch/AgriSentinalAI.git
   cd AgriSentinalAI
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```
4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Access the portal at **http://localhost:3000**.

---

## 🤝 Credits & Acknowledgements
Built by **AgriSentinel Team** as part of the **Build with AI Challenge**.
Developed with ❤️ using **Google AI Studio** and **Antigravity**.
The intelligent guardian for Kerala's agricultural future. 🌾🛡️
