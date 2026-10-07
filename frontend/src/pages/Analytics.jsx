import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AnalyticsCards from "../components/analytics/AnalyticsCards";

import LatencyComparison from "../components/analytics/LatencyComparison";
import SuccessRateDonut from "../components/analytics/SuccessRateDonut";

import "../styles/Layout.css";
import "../styles/Analytics.css";

function Analytics() {

    return (

        <div className="appLayout">

            <Sidebar />

            <div className="mainContent">

                <Navbar
                    title="Analytics"
                    subtitle="AI Gateway Performance Analytics"
                />

                <div className="analyticsPage">

                    {/* Analytics Summary Cards */}
                    <AnalyticsCards />


                    {/* First Row */}
                    <div className="analyticsRow">



                        <SuccessRateDonut />
                        <LatencyComparison />

                    </div>


                    {/* Second Row */}
                    

                </div>

            </div>

        </div>

    );
}

export default Analytics;