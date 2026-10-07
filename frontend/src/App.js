import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import SplashScreen from "./components/SplashScreen/SplashScreen";

import Dashboard from "./pages/Dashboard";
import GatewayManagement from "./pages/GatewayManagement";
import HealthMonitoring from "./pages/HealthMonitoring";
import Prediction from "./pages/Prediction";
import Analytics from "./pages/Analytics";
import About from "./pages/About";

import "./styles/Layout.css";

function App() {
  return (
      <BrowserRouter>

        <Routes>

          {/* Splash Screen */}
          <Route path="/" element={<SplashScreen />} />

          {/* Main Application */}
          <Route
              path="/*"
              element={
                <div className="layout">

                  <Sidebar />

                  <div className="content">

                      <Routes>
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="gateway-management" element={<GatewayManagement />} />
                          <Route path="health-monitoring" element={<HealthMonitoring />} />
                          <Route path="prediction" element={<Prediction />} />
                          <Route path="analytics" element={<Analytics />} />
                          <Route path="about" element={<About />} />
                      </Routes>

                  </div>

                </div>
              }
          />

        </Routes>

      </BrowserRouter>
  );
}

export default App;