import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import GatewayManagementCards from "../components/GatewayManagementCards";
import GatewayManagementTable from "../components/GatewayManagementTable";

import "../styles/Layout.css";
import "../styles/GatewayManagement.css";

function GatewayManagement() {

    return (

        <div className="appLayout">

            <Sidebar />

            <div className="mainContent">

                <Navbar
                    title="Gateway Management"
                    subtitle="Manage AI gateways and monitor operational status"
                />

                <div className="gatewayPage">

                    <GatewayManagementCards />

                    <GatewayManagementTable />

                </div>

            </div>

        </div>

    );
}

export default GatewayManagement;