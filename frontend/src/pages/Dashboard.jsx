import Navbar from "../components/Navbar";
import OverviewCards from "../components/OverviewCards";
import GatewayCards from "../components/GatewayCards";
import PredictionCard from "../components/PredictionCard";
import GatewayTable from "../components/GatewayTable";
import PerformanceChart from "../components/PerformanceChart";
import Sidebar from "../components/Sidebar";
import RoutingHistory from "../components/RoutingHistory";
import ResponseTrendChart from "../components/ResponseTrendChart";

import "../styles/Dashboard.css";
import "../styles/Layout.css";

function Dashboard() {

    return (

        <div className="appLayout">

            <Sidebar />

            <div className="mainContent">

                <Navbar
                    title="Dashboard"
                    subtitle="Intelligent ML-Driven AI Gateway"
                    showSearch={true}
                />

                <div className="dashboard">

                    {/* =========================
                        Overview Cards
                    ========================= */}

                    <div className="row cards">

                        <OverviewCards />

                    </div>


                    {/* =========================
                        Gateway Status
                    ========================= */}

                    <h3 className="sectionTitle">
                        Gateway Status
                    </h3>

                    <div className="row gateways">

                        <GatewayCards />

                    </div>





                    {/* =========================
                        Existing Dashboard Content
                    ========================= */}

                    <div className="row bottom">

                        <div>

                            <PerformanceChart />

                            <RoutingHistory />

                        </div>

                        <PredictionCard />

                    </div>


                    {/* =========================
                        Gateway Table
                    ========================= */}

                    <GatewayTable />

                </div>

            </div>

        </div>
    );
}

export default Dashboard;